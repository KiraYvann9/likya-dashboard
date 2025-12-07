import {z} from 'zod'

export const editUserFormSchema = z.object({
    username: z.string({message: ''}).min(4, {message :'Ce champ doit contenir au moins 4 caractères'}),
    roles: z.array(z.string({message: ''})),
    attributes: z.object({
        address: z.string({}).optional(),
        compte_bancaire: z.string({}).optional()
    }),

})