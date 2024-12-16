import {z} from 'zod'

export const createUserFormSchema = z.object({
    fullname: z.string({message: ''}).min(4, {message :'Ce champ doit contenir au moins 4 caractères'}),
    phonenumber: z.string({message: ''})
        .regex(/^\+\d{11,15}$/, "Le numéro de téléphone doit commencer par '+' suivi de 11 à 15 chiffres."),
    email: z.string({message: ''}),
    password: z.string({message: ''}).min(2,  {message: 'le mot de passe doit contenir au moins  8 caracteres'}),
    role: z.string({message: ''}),
    attributes: z.object({
        address: z.string({}).optional(),
        compte_bancaire: z.string({}).optional()
    }),

})