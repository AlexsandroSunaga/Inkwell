# ACME Corp — Security & Access

All staff must use **SSO (Okta)** for production systems. Passwords for legacy tools must be **16+ characters** and rotated every **90 days**.

- **MFA** is required on email, VPN, and cloud admin roles.
- Customer data (PII) must not be stored in personal Google Drive or Slack DMs.
- Laptops must run the company MDM agent; full-disk encryption is mandatory.
- Report suspected phishing to security@acme-example.com within **1 hour**.

API keys for integrations live in **Vault**; never commit secrets to Git.
