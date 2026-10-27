"""Keyless local mode: hashed bag-of-words embeddings and extractive answers.

Used when OPENAI_API_KEY is not set, so the whole product (ingest, retrieval,
cited answers) can be run and judged without an API account. It is simple on
purpose: it finds the passages that share the most words with the question and
quotes them. It does not write new sentences the way a language model does.
"""
import hashlib
import math
import re

DIM = 384
_TOKEN = re.compile(r"[a-z0-9]+")
_STOP = frozenset(
    "a an and are as at be but by can do does for from had has have how i if in is it its me my of on or our "
    "so than that the their them then there these they this to up us was we what when where which who why will "
    "with would you your take get give make".split()
)


def _stem(word: str) -> str:
    for suffix in ("ing", "ed", "es", "s"):
        if len(word) > len(suffix) + 3 and word.endswith(suffix):
            return word[: -len(suffix)]
    return word


def tokens(text: str) -> list[str]:
    return [_stem(w) for w in _TOKEN.findall(text.lower()) if w not in _STOP]


def _bucket(feature: str) -> tuple[int, float]:
    digest = hashlib.sha1(feature.encode("utf-8")).digest()
    value = int.from_bytes(digest[:4], "big")
    return value % DIM, 1.0 if (value >> 31) & 1 else -1.0


def embed(texts: list[str]) -> list[list[float]]:
    vectors = []
    for text in texts:
        words = tokens(text)
        counts: dict[str, int] = {}
        for word in words:
            counts[word] = counts.get(word, 0) + 1
        for first, second in zip(words, words[1:]):
            key = f"{first}_{second}"
            counts[key] = counts.get(key, 0) + 1
        vec = [0.0] * DIM
        for feature, count in counts.items():
            index, sign = _bucket(feature)
            weight = (1.0 + math.log(count)) * (0.5 if "_" in feature else 1.0)
            vec[index] += sign * weight
        norm = math.sqrt(sum(v * v for v in vec))
        vectors.append([v / norm for v in vec] if norm else vec)
    return vectors


_SENTENCE = re.compile(r"(?<=[.!?])\s+")
# A few question words and the words documents use for the same idea. Plain lexical matching has no meaning,
# so this small list is what lets "how long" find "within 5 business days".
_SYNONYMS = {
    "long": {"day", "hour", "week", "within"},
    "soon": {"within", "day", "hour"},
    "arrive": {"paid", "receive", "back"},
    "cost": {"eur", "price", "fee"},
    "much": {"eur"},
    "vacation": {"leave"},
    "report": {"contact", "email"},
    "rule": {"must", "require"},
}
_QUANTITY = re.compile(r"^\s*(how (long|many|much|soon|often)|when|within|by when)", re.IGNORECASE)


def compose_answer(question: str, hits: list[dict]) -> str:
    """Quote the sentences from the retrieved passages that best match the question."""
    original = set(tokens(question))
    wanted = set(original)
    for word in list(wanted):
        wanted |= _SYNONYMS.get(word, set())
    if not hits or not wanted:
        return "I could not find that in the indexed documents."
    wants_number = bool(_QUANTITY.match(question))
    scored: list[tuple[float, int, int, str]] = []
    for source, hit in enumerate(hits, start=1):
        for sentence in _SENTENCE.split(hit["text"]):
            sentence = sentence.strip()
            words = set(tokens(sentence))
            overlap = len(wanted & words)
            # A sentence must share at least one word the user actually typed, not only a synonym.
            if overlap and original & words and len(sentence) > 25:
                bonus = 0.75 if wants_number and re.search(r"\d", sentence) else 0.0
                scored.append((overlap + bonus + hit["score"], overlap, source, sentence))
    if not scored:
        return "I could not find that in the indexed documents."
    scored.sort(key=lambda item: item[0], reverse=True)
    best_overlap = scored[0][1]
    chosen: list[tuple[int, str]] = []
    for _, overlap, source, sentence in scored:
        # A second sentence is quoted only when it matches the question almost as well as the first.
        if chosen and overlap < max(2, best_overlap):
            continue
        if all(sentence != existing for _, existing in chosen):
            chosen.append((source, sentence))
        if len(chosen) == 2:
            break
    return " ".join(f"{sentence} [{source}]" for source, sentence in chosen)
