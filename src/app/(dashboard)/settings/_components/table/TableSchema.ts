export type USerType = {
    _id: string
    fullname: string,
    role: string,
    email: string,
    phonenumber:  string,
    is_active: boolean,
    extras: {
        role_info:{
            name: string
        }
    }
}