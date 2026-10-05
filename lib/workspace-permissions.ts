export function normalizeWorkspaceRole(
  role?: string | null,
) {
  return String(role || "")
    .trim()
    .toUpperCase();
}

export function canManageWorkspace(
  role?: string | null,
) {
  return ["OWNER", "ADMIN"].includes(
    normalizeWorkspaceRole(role),
  );
}

export function canEditWorkspace(
  role?: string | null,
) {
  return [
    "OWNER",
    "ADMIN",
    "MEMBER",
    "LAWYER",
    "INTERN",
  ].includes(
    normalizeWorkspaceRole(role),
  );
}

export function canDeleteWorkspace(
  role?: string | null,
) {
  return canManageWorkspace(role);
}

export function isWorkspaceReadOnly(
  role?: string | null,
) {
  return !canEditWorkspace(role);
}

export function workspaceRoleLabel(
  role?: string | null,
) {
  const normalized =
    normalizeWorkspaceRole(role);

  const labels: Record<string, string> = {
    OWNER: "Proprietário",
    ADMIN: "Administrador",
    MEMBER: "Integrante",
    LAWYER: "Advogado",
    INTERN: "Estagiário",
    VIEWER: "Visualizador",
  };

  return labels[normalized] || normalized;
}