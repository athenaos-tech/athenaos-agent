/** Canonical Discord channel names + legacy aliases for existing servers. */

export const ATHENA_CATEGORY_HINTS = [
  'athena command center',
  'athena command center',
  'opencatz command center',
  'opencat command center',
] as const;

export const CONTROL_ROOM_CHANNEL_NAMES = [
  'athena-control-room',
  'athena-control-room',
  'opencatz-control-room',
  'opencat-control-room',
  'control-room',
] as const;

export const AUDIT_CHANNEL_NAMES = [
  'athena-audit',
  'athena-audit',
  'opencatz-audit',
  'opencat-audit',
  'audit-on-demand',
] as const;

export function isAthenaCategoryName(name: string): boolean {
  const lower = name.toLowerCase();
  return ATHENA_CATEGORY_HINTS.some((hint) => lower.includes(hint));
}

export function isControlRoomChannel(name: string): boolean {
  return CONTROL_ROOM_CHANNEL_NAMES.includes(name as (typeof CONTROL_ROOM_CHANNEL_NAMES)[number]);
}

export function isAuditChannel(name: string): boolean {
  return AUDIT_CHANNEL_NAMES.includes(name as (typeof AUDIT_CHANNEL_NAMES)[number]);
}
