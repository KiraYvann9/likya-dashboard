export type USerType = {
    _id: string,
    user_id: string,
    username: string,
    lastname: string,
    firstname: string,
    contact: {
        phonenumber_one: string | null,
        phonenumber_two: string | null,
    },
    address: {
        street: string,
        city: string,
        region: string,
    }
    email: string,
    matricule: string,
    created_at: string,
    updated_at: string,
    last_login: string
}