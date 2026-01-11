import { z } from 'zod'

export const editProfileFormSchema = z.object({
  email: z.string().optional(),
  lastname: z.string().min(1, { message: 'Nom requis' }),
  firstname: z.string().min(1, { message: 'Prénom requis' }),
  contact: z.object({
    phonenumber_one: z.string().optional().default(''),
    phonenumber_two: z.string().optional().default(''),
  }),
  address: z.object({
    region: z.string().optional().default(''),
    city: z.string().optional().default(''),
    street: z.string().optional().default(''),
    postal_code: z.string().optional().default(''),
  }),
  date_of_birth: z
    .string()
    .refine(
      (val) => !val || !Number.isNaN(Date.parse(val)),
      { message: 'Date de naissance invalide' }
    ),
})

export type EditProfileFormValues = z.infer<typeof editProfileFormSchema>
