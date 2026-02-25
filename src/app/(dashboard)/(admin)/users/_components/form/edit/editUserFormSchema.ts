import {z} from 'zod'

export const editUserFormSchema = z.object({

    email: z.string().email().min(4, {message: ''}),
    lastname: z.string({message: ''}).min(4, {message :'Ce champ doit contenir au moins 4 caractères'}),
    firstname: z.string({message: ''}).min(4, {message :'Ce champ doit contenir au moins 4 caractères'}),
    contact: z.object({
        phonenumber_one: z.string(),
        phonenumber_two: z.string().optional(),
    }),
    address: z.object({
        region: z.string(),
        city: z.string(),
        street: z.string(),
        postal_code: z.string(),
    }),
    date_of_birth: z.string()
})

export type editProfileType = z.infer<typeof editUserFormSchema>


