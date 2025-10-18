import z from "zod";

export const GetUserQuerySchema = z.object({
  page: z.coerce.number().int().default(1).openapi({
    description: "Page number",
    example: 1
  }),
  limit: z.coerce.number().int().default(10).openapi({
    description: "Items per page",
    example: 10
  }),
  name: z.string().optional().openapi({
    description: " Filter by name",
    example: "binh"
  }),
  email: z.string().optional().openapi({
    description: "Filter by email",
    example: "thanhbinhnkd@gmail.com"
  })
});