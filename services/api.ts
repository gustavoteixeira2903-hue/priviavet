function normalizePriviaApiBaseUrl(
  value: string | undefined,
): string | undefined {
  const base = value?.trim().replace(/\/+$/, '');

  if (!base) {
    return undefined;
  }

  return /\/api\/v1$/i.test(base)
    ? base
    : `${base}/api/v1`;
}
const API_URL = normalizePriviaApiBaseUrl(process.env.NEXT_PUBLIC_PRIVIA_API_URL ?? process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:3001/api/v1';

type ApiOptions = {
  method?: string;
  body?: unknown;
};

export type Workspace = {
  id: string;
  name: string;
  workspaceType?: string;
  role: string;
};

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  workspaces: Workspace[];
};

export type Client = {
  id: string;
  workspaceId: string;
  companyName: string;
  tradeName?: string | null;
  document?: string | null;
  sector?: string | null;
  companySize?: string | null;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone?: string | null;
  city?: string | null;
  state?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientInput = {
  companyName: string;
  tradeName?: string;
  document?: string;
  sector?: string;
  companySize?: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone?: string;
  city?: string;
  state?: string;
  notes?: string;
};

export type Question = {
  id: string;
  sectionId: string;
  text: string;
  helpText?: string | null;
  type: string;
  required: boolean;
  order: number;
};

export type QuestionnaireResponse = {
  id: string;
  questionnaireId: string;
  questionId: string;
  workspaceId: string;
  projectId: string;
  rawValue?: string | null;
  interpretedValue?: string | null;
};

export type QuestionnaireSection = {
  id: string;
  questionnaireId: string;
  title: string;
  description?: string | null;
  order: number;
  questions?: Question[];
};

export type Questionnaire = {
  id: string;
  projectId: string;
  status: string;
  publicToken: string;
  expiresAt?: string | null;
  submittedAt?: string | null;
  lastAccessedAt?: string | null;
  sections?: QuestionnaireSection[];
  responses?: QuestionnaireResponse[];
};

export type Project = {
  id: string;
  workspaceId: string;
  clientId: string;
  responsibleId?: string | null;
  name: string;
  description?: string | null;
  status: string;
  currentPhase: string;
  startDate: string;
  deadline?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  client?: Client;
  questionnaire?: Questionnaire | null;
};

export type ProjectInput = {
  clientId: string;
  name: string;
  description?: string;
  deadline?: string;
};

export type ProjectUpdateInput = {
  name?: string;
  description?: string;
  status?: string;
  currentPhase?: string;
  deadline?: string;
};

export type PublicQuestionnaire = Questionnaire & {
  project: Project & {
    client: Client;
  };
};

export type PendingItem = {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: string;
  owner?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type PendingItemInput = {
  title: string;
  description?: string;
  owner?: string;
  dueDate?: string;
};

export type PendingItemUpdateInput = Partial<PendingItemInput> & {
  status?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function readApiResponse(
  response: Response,
): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  const payload = await readApiResponse(response);

  if (!response.ok) {
    const apiPayload =
      payload && typeof payload === 'object'
        ? (payload as {
            message?: string | string[];
          })
        : null;

    const message = Array.isArray(apiPayload?.message)
      ? apiPayload.message.join(' ')
      : apiPayload?.message ||
        (typeof payload === 'string'
          ? payload
          : `Erro HTTP ${response.status}.`);

    throw new ApiError(
      message,
      response.status,
      payload,
    );
  }

  return payload as T;
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  workspaceName: string;
  workspaceType?: string;
}) {
  return apiFetch<{
    user: Session['user'];
    workspace: Workspace;
    emailVerificationRequired?: boolean;
    verificationUrl?: string;
  }>('/auth/register', {
    method: 'POST',
    body: data,
  });
}

export function loginUser(data: {
  email: string;
  password: string;
}) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: data,
  });
}

export function getMe() {
  return apiFetch<Session>('/auth/me');
}

export function logoutUser() {
  return apiFetch('/auth/logout', {
    method: 'POST',
  });
}

export function listClients(workspaceId: string) {
  return apiFetch<Client[]>(`/workspaces/${workspaceId}/clients`);
}

export function createClient(workspaceId: string, data: ClientInput) {
  return apiFetch<Client>(`/workspaces/${workspaceId}/clients`, {
    method: 'POST',
    body: data,
  });
}

export function updateClient(workspaceId: string, clientId: string, data: Partial<ClientInput>) {
  return apiFetch<Client>(`/workspaces/${workspaceId}/clients/${clientId}`, {
    method: 'PATCH',
    body: data,
  });
}

export function deleteClient(workspaceId: string, clientId: string) {
  return apiFetch<{ success: boolean }>(`/workspaces/${workspaceId}/clients/${clientId}`, {
    method: 'DELETE',
  });
}

export function listProjects(workspaceId: string) {
  return apiFetch<Project[]>(`/workspaces/${workspaceId}/projects`);
}

export function createProject(workspaceId: string, data: ProjectInput) {
  return apiFetch<Project>(`/workspaces/${workspaceId}/projects`, {
    method: 'POST',
    body: data,
  });
}

export function getProject(workspaceId: string, projectId: string) {
  return apiFetch<Project>(`/workspaces/${workspaceId}/projects/${projectId}`);
}

export function updateProject(workspaceId: string, projectId: string, data: ProjectUpdateInput) {
  return apiFetch<Project>(`/workspaces/${workspaceId}/projects/${projectId}`, {
    method: 'PATCH',
    body: data,
  });
}

export function deleteProject(workspaceId: string, projectId: string) {
  return apiFetch<{ success: boolean }>(`/workspaces/${workspaceId}/projects/${projectId}`, {
    method: 'DELETE',
  });
}

export function getPublicQuestionnaire(token: string) {
  return apiFetch<PublicQuestionnaire>(`/public/questionnaires/${token}`);
}

export function savePublicQuestionnaireResponses(
  token: string,
  responses: { questionId: string; rawValue?: string }[],
) {
  return apiFetch<PublicQuestionnaire>(`/public/questionnaires/${token}/responses`, {
    method: 'PATCH',
    body: {
      responses,
    },
  });
}

export function submitPublicQuestionnaire(token: string) {
  return apiFetch<{
    success: boolean;
    alreadySubmitted?: boolean;
    draftGenerated?: boolean;
    draftId?: string;
  }>(
    `/public/questionnaires/${token}/submit`,
    {
      method: 'POST',
    },
  );
}

export function listPendingItems(workspaceId: string, projectId: string) {
  return apiFetch<PendingItem[]>(
    `/workspaces/${workspaceId}/projects/${projectId}/pending-items`,
  );
}

export function createPendingItem(
  workspaceId: string,
  projectId: string,
  data: PendingItemInput,
) {
  return apiFetch<PendingItem>(
    `/workspaces/${workspaceId}/projects/${projectId}/pending-items`,
    {
      method: 'POST',
      body: data,
    },
  );
}

export function updatePendingItem(
  workspaceId: string,
  projectId: string,
  pendingItemId: string,
  data: PendingItemUpdateInput,
) {
  return apiFetch<PendingItem>(
    `/workspaces/${workspaceId}/projects/${projectId}/pending-items/${pendingItemId}`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}

export function deletePendingItem(
  workspaceId: string,
  projectId: string,
  pendingItemId: string,
) {
  return apiFetch<{ success: boolean }>(
    `/workspaces/${workspaceId}/projects/${projectId}/pending-items/${pendingItemId}`,
    {
      method: 'DELETE',
    },
  );
}

export function autoGeneratePendingItems(workspaceId: string, projectId: string) {
  return apiFetch<{ createdCount: number; items: PendingItem[] }>(
    `/workspaces/${workspaceId}/projects/${projectId}/pending-items/auto-generate`,
    {
      method: 'POST',
    },
  );
}

export type DataMapItem = {
  id: string;
  workspaceId: string;
  projectId: string;
  area?: string | null;
  activity?: string | null;
  dataSubject?: string | null;
  personalData?: string | null;
  purpose?: string | null;
  legalBasis?: string | null;
  sharing?: string | null;
  retention?: string | null;
  securityMeasures?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type DataMapItemInput = {
  area?: string;
  activity?: string;
  dataSubject?: string;
  personalData?: string;
  purpose?: string;
  legalBasis?: string;
  sharing?: string;
  retention?: string;
  securityMeasures?: string;
  notes?: string;
};

export function listDataMapItems(workspaceId: string, projectId: string) {
  return apiFetch<DataMapItem[]>(
    `/workspaces/${workspaceId}/projects/${projectId}/data-map`,
  );
}

export function createDataMapItem(
  workspaceId: string,
  projectId: string,
  data: DataMapItemInput,
) {
  return apiFetch<DataMapItem>(
    `/workspaces/${workspaceId}/projects/${projectId}/data-map`,
    {
      method: 'POST',
      body: data,
    },
  );
}

export function updateDataMapItem(
  workspaceId: string,
  projectId: string,
  dataMapItemId: string,
  data: DataMapItemInput,
) {
  return apiFetch<DataMapItem>(
    `/workspaces/${workspaceId}/projects/${projectId}/data-map/${dataMapItemId}`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}

export function deleteDataMapItem(
  workspaceId: string,
  projectId: string,
  dataMapItemId: string,
) {
  return apiFetch<{ success: boolean }>(
    `/workspaces/${workspaceId}/projects/${projectId}/data-map/${dataMapItemId}`,
    {
      method: 'DELETE',
    },
  );
}

export function autoGenerateDataMapItems(workspaceId: string, projectId: string) {
  return apiFetch<{ createdCount: number; items: DataMapItem[] }>(
    `/workspaces/${workspaceId}/projects/${projectId}/data-map/auto-generate`,
    {
      method: 'POST',
    },
  );
}
export type ActionPlanItem = {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string | null;
  priority?: string | null;
  status?: string | null;
  responsible?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type ActionPlanItemInput = {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  responsible?: string;
  dueDate?: string;
};

export function listActionPlanItems(workspaceId: string, projectId: string) {
  return apiFetch<ActionPlanItem[]>(
    `/workspaces/${workspaceId}/projects/${projectId}/action-plan`,
  );
}

export function createActionPlanItem(
  workspaceId: string,
  projectId: string,
  data: ActionPlanItemInput,
) {
  return apiFetch<ActionPlanItem>(
    `/workspaces/${workspaceId}/projects/${projectId}/action-plan`,
    {
      method: 'POST',
      body: data,
    },
  );
}

export function updateActionPlanItem(
  workspaceId: string,
  projectId: string,
  actionPlanItemId: string,
  data: Partial<ActionPlanItemInput>,
) {
  return apiFetch<ActionPlanItem>(
    `/workspaces/${workspaceId}/projects/${projectId}/action-plan/${actionPlanItemId}`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}

export function deleteActionPlanItem(
  workspaceId: string,
  projectId: string,
  actionPlanItemId: string,
) {
  return apiFetch<{ success: boolean }>(
    `/workspaces/${workspaceId}/projects/${projectId}/action-plan/${actionPlanItemId}`,
    {
      method: 'DELETE',
    },
  );
}
export function autoGenerateActionPlanItems(
  workspaceId: string,
  projectId: string,
) {
  return apiFetch<{ createdCount: number; items: ActionPlanItem[] }>(
    `/workspaces/${workspaceId}/projects/${projectId}/action-plan/auto-generate`,
    {
      method: 'POST',
    },
  );
}

export type Report = {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type ReportInput = {
  title: string;
  content: string;
};

export function listReports(workspaceId: string, projectId: string) {
  return apiFetch<Report[]>(
    `/workspaces/${workspaceId}/projects/${projectId}/reports`,
  );
}

export function createReport(
  workspaceId: string,
  projectId: string,
  data: ReportInput,
) {
  return apiFetch<Report>(
    `/workspaces/${workspaceId}/projects/${projectId}/reports`,
    {
      method: 'POST',
      body: data,
    },
  );
}

export function updateReport(
  workspaceId: string,
  projectId: string,
  reportId: string,
  data: Partial<ReportInput>,
) {
  return apiFetch<Report>(
    `/workspaces/${workspaceId}/projects/${projectId}/reports/${reportId}`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}

export function deleteReport(
  workspaceId: string,
  projectId: string,
  reportId: string,
) {
  return apiFetch<{ success: boolean }>(
    `/workspaces/${workspaceId}/projects/${projectId}/reports/${reportId}`,
    {
      method: 'DELETE',
    },
  );
}

export function autoGenerateReport(
  workspaceId: string,
  projectId: string,
) {
  return apiFetch<Report>(
    `/workspaces/${workspaceId}/projects/${projectId}/reports/auto-generate`,
    {
      method: 'POST',
    },
  );
}

async function downloadReportFile(
  workspaceId: string,
  projectId: string,
  reportId: string,
  format: 'pdf' | 'docx',
) {
  const response = await fetch(
    `${API_URL}/workspaces/${workspaceId}/projects/${projectId}/reports/${reportId}/export/${format}`,
    {
      credentials: 'include',
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || `Erro ao exportar relatório em ${format.toUpperCase()}.`,
    );
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition');
  const filenameMatch = disposition?.match(/filename="([^"]+)"/);
  const filename =
    filenameMatch?.[1] || `relatorio-lgpd.${format}`;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export async function exportReportPdf(
  workspaceId: string,
  projectId: string,
  reportId: string,
) {
  const previewWindow = window.open("", "_blank");

  if (!previewWindow) {
    throw new Error(
      "O navegador bloqueou a nova aba. Permita pop-ups para abrir o PDF.",
    );
  }

  try {
    const response = await fetch(
      `${API_URL}/workspaces/${workspaceId}/projects/${projectId}/reports/${reportId}/export/pdf`,
      {
        credentials: "include",
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(
        error?.message || "Erro ao abrir relatório em PDF.",
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    previewWindow.location.href = url;

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 60000);
  } catch (error) {
    previewWindow.close();
    throw error;
  }
}

export function exportReportDocx(
  workspaceId: string,
  projectId: string,
  reportId: string,
) {
  return downloadReportFile(
    workspaceId,
    projectId,
    reportId,
    'docx',
  );
}
export type ProjectDashboardSummary = {
  project: {
    id: string;
    name: string;
    status: string;
    currentPhase: string;
    clientName?: string | null;
  };

  overallProgress: number;

  questionnaire: {
    totalQuestions: number;
    answeredQuestions: number;
    progress: number;
  };

  pendingItems: {
    total: number;
    open: number;
    resolved: number;
    progress: number;
  };

  dataMap: {
    totalItems: number;
    progress: number;
  };

  actionPlan: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    progress: number;
  };

  reports: {
    total: number;
    progress: number;
  };

  documents: {
    total: number;
    progress: number;
  };
};

export function getProjectDashboard(
  workspaceId: string,
  projectId: string,
) {
  return apiFetch<ProjectDashboardSummary>(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboard`,
  );
}
export type WorkspacePendingItem = PendingItem & {
  isOverdue: boolean;
  project: {
    id: string;
    name: string;
    client?: {
      companyName: string;
    } | null;
  };
};

export function listWorkspacePendingItems(
  workspaceId: string,
) {
  return apiFetch<WorkspacePendingItem[]>(
    `/workspaces/${workspaceId}/pending-items`,
  );
}
export type ProjectDocument = {
  id: string;
  workspaceId: string;
  projectId: string;
  uploadedById?: string | null;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  filePath: string;
  category?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type ProjectDocumentMetadataInput = {
  category?: string;
  description?: string;
};

export function listProjectDocuments(
  workspaceId: string,
  projectId: string,
) {
  return apiFetch<ProjectDocument[]>(
    `/workspaces/${workspaceId}/projects/${projectId}/documents`,
  );
}

export async function uploadProjectDocument(
  workspaceId: string,
  projectId: string,
  file: File,
  data: ProjectDocumentMetadataInput,
) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('category', data.category || '');
  formData.append('description', data.description || '');

  const response = await fetch(
    `${API_URL}/workspaces/${workspaceId}/projects/${projectId}/documents`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || 'Erro ao enviar documento.',
    );
  }

  return response.json() as Promise<ProjectDocument>;
}

export function updateProjectDocument(
  workspaceId: string,
  projectId: string,
  documentId: string,
  data: ProjectDocumentMetadataInput,
) {
  return apiFetch<ProjectDocument>(
    `/workspaces/${workspaceId}/projects/${projectId}/documents/${documentId}`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}

export function deleteProjectDocument(
  workspaceId: string,
  projectId: string,
  documentId: string,
) {
  return apiFetch<{ success: boolean }>(
    `/workspaces/${workspaceId}/projects/${projectId}/documents/${documentId}`,
    {
      method: 'DELETE',
    },
  );
}

export async function downloadProjectDocument(
  workspaceId: string,
  projectId: string,
  document: ProjectDocument,
) {
  const response = await fetch(
    `${API_URL}/workspaces/${workspaceId}/projects/${projectId}/documents/${document.id}/download`,
    {
      credentials: 'include',
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || 'Erro ao baixar documento.',
    );
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement('a');

  link.href = url;
  link.download = document.originalName;

  window.document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}
export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: string;
  createdAt?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type WorkspaceMembersResponse = {
  members: WorkspaceMember[];
  availableRoles: string[];
};

export function listWorkspaceMembers(
  workspaceId: string,
) {
  return apiFetch<WorkspaceMembersResponse>(
    `/workspaces/${workspaceId}/members`,
  );
}

export function addWorkspaceMember(
  workspaceId: string,
  data: {
    email: string;
    role: string;
  },
) {
  return apiFetch<WorkspaceMember>(
    `/workspaces/${workspaceId}/members`,
    {
      method: 'POST',
      body: data,
    },
  );
}

export function updateWorkspaceMemberRole(
  workspaceId: string,
  membershipId: string,
  role: string,
) {
  return apiFetch<WorkspaceMember>(
    `/workspaces/${workspaceId}/members/${membershipId}/role`,
    {
      method: 'PATCH',
      body: {
        role,
      },
    },
  );
}

export function removeWorkspaceMember(
  workspaceId: string,
  membershipId: string,
) {
  return apiFetch<{ success: boolean }>(
    `/workspaces/${workspaceId}/members/${membershipId}`,
    {
      method: 'DELETE',
    },
  );
}
export type AuditLogUser = {
  id: string;
  name: string;
  email: string;
};

export type AuditLogItem = {
  id: string;
  workspaceId: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | string | null;
  createdAt: string;
  user?: AuditLogUser | null;
};

export type AuditLogsResponse = {
  items: AuditLogItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export function listWorkspaceAuditLogs(
  workspaceId: string,
  options?: {
    page?: number;
    pageSize?: number;
    action?: string;
    entity?: string;
  },
) {
  const params = new URLSearchParams();

  params.set(
    'page',
    String(options?.page || 1),
  );

  params.set(
    'pageSize',
    String(options?.pageSize || 50),
  );

  if (options?.action?.trim()) {
    params.set(
      'action',
      options.action.trim(),
    );
  }

  if (options?.entity?.trim()) {
    params.set(
      'entity',
      options.entity.trim(),
    );
  }

  return apiFetch<AuditLogsResponse>(
    `/workspaces/${workspaceId}/audit-logs?${params.toString()}`,
  );
}
export type AuthLinkResponse = {
  success: boolean;
  message: string;
  resetUrl?: string;
  verificationUrl?: string;
};

export function forgotPassword(email: string) {
  return apiFetch<AuthLinkResponse>(
    '/auth/forgot-password',
    {
      method: 'POST',
      body: { email },
    },
  );
}

export function resetPassword(
  token: string,
  password: string,
) {
  return apiFetch<{
    success: boolean;
    message: string;
  }>('/auth/reset-password', {
    method: 'POST',
    body: {
      token,
      password,
    },
  });
}

export function verifyEmail(token: string) {
  return apiFetch<{
    success: boolean;
    message: string;
  }>('/auth/verify-email', {
    method: 'POST',
    body: { token },
  });
}

export function resendVerification(email: string) {
  return apiFetch<AuthLinkResponse>(
    '/auth/resend-verification',
    {
      method: 'POST',
      body: { email },
    },
  );
}