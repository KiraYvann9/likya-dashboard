import {z} from 'zod'


export const createUserFormSchema = z.object({
    username: z.string().min(4, {message :'Le nom d\'utilisateur doit contenir au moins 4 caractères'}),
    password: z.string().min(8, {message: 'Le mot de passe doit contenir au moins 8 caractères'}),
})

export const updateUserFormSchema = z.object({
    user_id: z.string({message: ''}).min(1, {message: 'ID utilisateur requis'}).optional(),
    lastname: z.string({message: ''}).min(4, {message :'Ce champ doit contenir au moins 4 caractères'}),
    firstname: z.string({message: ''}).min(4, {message :'Ce champ doit contenir au moins 4 caractères'}),
    // contact: z.object({
    //     phonenumber_one: z.string({message: ''}).regex(/^\+\d{11,15}$/, "Le numéro de téléphone doit commencer par '+' suivi de 11 à 15 chiffres."),
    // }).optional(),
    
    email: z.string({message: ''}).email({message: 'Adresse email invalide'}),
    // role: z.string({message: ''}),
    // address: z.object({
    //     region : z.string().optional()
    // }).optional(),
    // date_of_birth: z.string().optional(),

})

export type CreateUserFormSchema = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormSchema = z.infer<typeof updateUserFormSchema>;