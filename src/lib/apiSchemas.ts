import { z } from "zod";

// Error schema
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

// Generic API response schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.nullable(),
    error: ApiErrorSchema.nullable(),
  });

// Example: Success response with data
// export const ExampleResponse = ApiResponseSchema(z.object({ foo: z.string() }));

// Placeholder request schemas (to be filled in per endpoint)
export const CreateGroupRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateGroupNameRequestSchema = z.object({
  name: z.string().min(1),
});

export const UpdateGroupDescriptionRequestSchema = z.object({
  description: z.string().optional(),
});

export const CreateListItemRequestSchema = z.object({
  type: z.union([z.literal("text"), z.literal("url")]),
  value: z.string(),
  description: z.string().optional(),
});

export const UpdateListItemRequestSchema = z.object({
  type: z.union([z.literal("text"), z.literal("url")]),
  value: z.string(),
  description: z.string().optional(),
});

export const ReorderListItemsRequestSchema = z.object({
  orderedIds: z.array(z.string()), // Will refine to Id<"listItems">
});

export const CreateNotepadRequestSchema = z.object({
  // No body required, but placeholder for future
});

export const UpdateNotepadRequestSchema = z.object({
  content: z.string(),
});
