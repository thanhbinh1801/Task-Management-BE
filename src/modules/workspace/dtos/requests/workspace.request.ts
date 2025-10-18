import { WorkspaceStatusEnum } from "@prisma/client";
import z from "zod";

export const WorkspaceCreateRequestSchema = z.object({
  name: z.string(),
  visibility: z.enum(WorkspaceStatusEnum).default(WorkspaceStatusEnum.PUBLIC).optional()
});

export type WorkspaceCreateRequest = z.infer<typeof WorkspaceCreateRequestSchema>;

export const WorkspaceUpdateRequestSchema = z.object({
  name: z.string(),
  visibility: z.enum(WorkspaceStatusEnum).optional()
});

export type WorkspaceUpdateRequest = z.infer<typeof WorkspaceUpdateRequestSchema>;