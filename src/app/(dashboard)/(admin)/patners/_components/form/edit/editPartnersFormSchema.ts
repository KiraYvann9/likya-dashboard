import { z } from 'zod'
import { createPartnersFormSchema } from "../create/createPartnersFormSchema"

// Reuse the same structure for editing a partner
export const editPartnersFormSchema = createPartnersFormSchema
export type EditPartnerFormSchema = z.infer<typeof editPartnersFormSchema>