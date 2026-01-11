import { z } from 'zod';

export interface createPartnersFormSchema {
    _id: string
    name: string
    establishment_type: string
    identification_number: {
        identification_type: 'IFU' | 'RCCM'| 'Agrément Santé' | 'Autre'
        identification_value: string
    }
    contact: {
        email: string
        phone_number: string
        website: string
    }
    address: {
        city: string,

        country: string

        street: string

        additional_info: string
    }
    is_active: boolean
}