import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  description: z.string().min(2, { message: 'La description doit contenir au moins 2 caractères' }),
  parent_id: z.string().nullable().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
