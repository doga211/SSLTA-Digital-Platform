export const SSLTA_ROLES = [
  'super_admin',
  'admin',
  'competition_manager',
  'ranking_officer',
  'membership_officer',
  'finance_officer',
  'club_admin',
  'coach',
  'official',
  'player',
  'editor',
  'staff',
] as const

export type SSLTARole = (typeof SSLTA_ROLES)[number]

export const ROLE_LABELS: Record<SSLTARole, string> = {
  super_admin: 'Super Administrator',
  admin: 'Administrator',
  competition_manager: 'Competition Manager',
  ranking_officer: 'Ranking Officer',
  membership_officer: 'Membership Officer',
  finance_officer: 'Finance Officer',
  club_admin: 'Club Administrator',
  coach: 'Coach',
  official: 'Tournament Official',
  player: 'Player',
  editor: 'Content Editor',
  staff: 'Staff',
}

export const ADMIN_ROLES: SSLTARole[] = ['super_admin', 'admin', 'competition_manager', 'ranking_officer', 'membership_officer', 'finance_officer', 'editor', 'staff']
