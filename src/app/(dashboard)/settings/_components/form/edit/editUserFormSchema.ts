import {z} from 'zod'

export const editUserFormSchema = z.object({
    fullname: z.string({message: ''}).min(4, {message :'Ce champ doit contenir au moins 4 caractères'}),
    role: z.string({message: ''}),
    attributes: z.object({
        address: z.string({}).optional(),
        compte_bancaire: z.string({}).optional()
    }),

})