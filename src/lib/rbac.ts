import type { Role } from '../generated/prisma/client';

const viewRoles: Role[] = ['Admin', 'AnalystL1', 'AnalystL2', 'AnalystL3'];
const editStatusRoles: Role[] = ['Admin', 'AnalystL2', 'AnalystL3'];
const moderateRoles: Role[] = ['Admin', 'AnalystL3'];

export function canViewAudit(role: Role) {
  return viewRoles.includes(role);
}

export function canUpdateStatus(role: Role) {
  return editStatusRoles.includes(role);
}

export function canChangeCriticality(role: Role) {
  return moderateRoles.includes(role);
}

export function canManageUsers(role: Role) {
  return role === 'Admin';
}
