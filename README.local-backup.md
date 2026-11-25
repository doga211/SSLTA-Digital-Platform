# SSLTA Professional Next.js App Router — V2 Federation UI

This version upgrades the existing SSLTA Next.js application using the approved SSLTA website prototype as the visual and information-architecture reference.

## Implemented

- Prototype masthead and federation-style navigation.
- Exact prototype brand palette:
  - SSLTA Blue `#2457A6`
  - Federation Blue `#173F82`
  - SSLTA Red `#D71920`
  - SSLTA Green `#0C8B4A`
  - SSLTA Gold `#F5C400`
  - Soft background `#F5F7FA`
  - Federation line `#E7E9ED`
- Prototype homepage structure:
  - Hero / Tennis for All
  - Five federation metrics
  - Upcoming Tournaments
  - National Rankings
  - Latest News
  - Vision / Mission / Values
  - Development & Community
  - SSLTA Membership
  - Competition calendar
  - Join SSLTA call-to-action
- Public routes aligned to the prototype:
  - `/`
  - `/about`
  - `/players`
  - `/tournaments`
  - `/rankings`
  - `/development`
  - `/membership`
  - `/gallery`
  - `/news`
  - `/contact`
- Responsive mobile navigation and layouts.
- Semantic metadata and improved accessibility labels.
- Removed the external Google Fonts dependency from global CSS so the UI is not blocked by remote font loading.
- Existing admin visual system retained and recolored to the same federation palette.

## Federation alignment direction

The UI and information architecture are structured for a national sport federation environment and future integration with SSNOC / international tennis competition systems. The application does **not** claim formal accreditation or compliance with any governing body; formal compliance depends on SSLTA-approved constitution, regulations, safeguarding policies, competition rules, ranking regulations, governance procedures and official federation requirements.

## Next production phase

The next engineering phase should connect this presentation layer to the SSLTA management platform:

1. Supabase Auth + official accounts
2. RBAC and PostgreSQL RLS
3. Player/member/club registry
4. Tournament sanctioning and registration
5. Draws, scheduling, courts and officials
6. Verified match results
7. Ranking calculation, history, freeze and publication
8. National teams and development programmes
9. Governance documents and controlled publication
10. Audit logs, notifications and reporting
11. Production QA, accessibility, performance and security review

The current release intentionally preserves the existing application architecture so the public site can become the presentation layer of the federation management system rather than a separate data source.
