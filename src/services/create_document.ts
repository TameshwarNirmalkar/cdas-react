import { apiCall } from "./api";

const createDocumentApi = async (payload) => {
  return await apiCall("/documents/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
const getAuditLogApi = async () => {
  return await apiCall("/documents/auditlogs");
};

export { createDocumentApi, getAuditLogApi };
