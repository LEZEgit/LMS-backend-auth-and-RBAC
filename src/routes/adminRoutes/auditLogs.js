import express from "express";
import { getAuditLogs } from "../../controllers/auditLogsController";
import { authenticate } from "../../middleware/authenticate";

const router =  express.Router();


router.get(
  "/admin/audit-logs",
  authenticate,
  getAuditLogs
);

export default router;