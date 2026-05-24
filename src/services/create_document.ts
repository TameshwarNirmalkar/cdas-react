import { apiCall } from "./api";

interface CreateDocumentPayload {
  title: string;
  content: string;
  createdBy: string;
  workflow: {
    stepOrder: number;
    isParallel: boolean;
    approvers: string[];
  }[];
}

const createDocumentApi = async (payload: CreateDocumentPayload) => {
  return await apiCall("/documents/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
const getAuditLogApi = async () => {
  return await apiCall("/documents/auditlogs");
};

export { createDocumentApi, getAuditLogApi };
