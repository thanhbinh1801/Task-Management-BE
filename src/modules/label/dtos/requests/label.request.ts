import z from "zod";

export const LabelCreateRequestSchema = z.object({
  name: z.string().min(1, "name is required"),
  color: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{6})$/, "color must be a valid hex code"),
});

export type LabelCreateRequest = z.infer<typeof LabelCreateRequestSchema>;

export const LabelUpdateRequestSchema = z.object({
  labelId: z.string(),
  name: z.string().min(1).optional(),
  color: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{6})$/, "color must be a valid hex code")
    .optional(),
});

export type LabelUpdateRequest = z.infer<typeof LabelUpdateRequestSchema>;

export const CardLabelAssignRequestSchema = z.object({
  labelId: z.string(),
});

export type CardLabelAssignRequest = z.infer<typeof CardLabelAssignRequestSchema>;
