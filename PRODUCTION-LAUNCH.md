# Nexus Learning Worlds v4 — production launch requirements

The flat HTML is a feature-rich release candidate and migration-safe GitHub Pages build. It is not, by itself, a secure multi-user commercial service or a native App Store / Play Store package.

## Required from the owner before commercial launch

- Final company and product name, legal entity and support email.
- Domain and hosting environment.
- Apple Developer organisation account and Google Play organisation account.
- Revolut Business Merchant account/API credentials for web checkout; a personal revolut.me link cannot securely verify subscriptions.
- Subscription prices, trial rules, refund policy and countries of sale.
- Privacy policy, terms, data-processing register and parental-consent flow.
- Native-speaker educational review for all 20 language packs and curriculum mappings.
- Brand assets, store screenshots and age-rating answers.

## Production architecture

1. Web frontend/PWA or native clients.
2. Auth service with parent account, child subprofiles, MFA/passkeys and rate limiting.
3. Encrypted database with tenant isolation and audit logging.
4. Entitlement service fed by Revolut Merchant webhooks, StoreKit server notifications and Google Play Billing notifications.
5. Content service with versioned curriculum packs, editorial review and rollback.
6. Privacy service for parental consent, export and deletion.
7. Security verification against OWASP ASVS/MASVS before launch.
