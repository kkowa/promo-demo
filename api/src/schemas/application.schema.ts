// src/schemas/application.schema.ts
import { z } from "zod";

export const StatusSchema = z
  .enum([
    "DRAFT",
    "SUBMITTED",
    "MANAGER_REVIEW",
    "RETURNED",
    "MANAGER_APPROVED",
  ])
  .meta({ description: "Application status", id: "Status" });

export const FieldsSchema = z
  .object({
    currentLevel: z.string(),
    targetLevel: z.string(),
    justification: z.string().min(10),
    attachments: z.array(z.string()).optional(),
  })
  .meta({
    id: "Fields",
    example: {
      currentLevel: "L1",
      targetLevel: "L2",
      justification: "Shipped X & Y with measurable impact",
      attachments: [],
    },
  });

export const CommentSchema = z
  .object({
    by: z.string(),
    when: z.string().datetime(),
    text: z.string(),
  })
  .meta({ id: "Comment" });

export const EligibilitySchema = z
  .object({
    tenureDays: z.number().int(),
    certCount: z.number().int(),
    meetsTenureRule: z.boolean(),
    meetsCertRule: z.boolean(),
  })
  .partial()
  .meta({ id: "Eligibility" });

export const CreateApplicationInputSchema = z
  .object({
    employeeId: z.string(),
    managerId: z.string(),
    fields: FieldsSchema,
  })
  .meta({ id: "CreateApplicationInput" });

export const ApplicationSchema = z
  .object({
    id: z.string(),
    employeeId: z.string(),
    managerId: z.string(),
    status: StatusSchema,
    fields: FieldsSchema,
    eligibility: EligibilitySchema.optional(),
    comments: z.array(CommentSchema).default([]),
    submittedAt: z.string().datetime().optional(),
  })
  .meta({ id: "Application" });

export const ApplicationListSchema = z
  .array(ApplicationSchema)
  .meta({ id: "ApplicationList" });
