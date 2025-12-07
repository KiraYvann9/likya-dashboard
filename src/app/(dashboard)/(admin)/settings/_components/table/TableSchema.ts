export type USerType = {
    id: string
    username: string,
    lastname: string,
    firstname: string,
    contact: {
        phonenumber_one: string | null
    },
    email: string,
    matricule: string,
    created_at: string,
    updated_at: string,
    last_login: string
}