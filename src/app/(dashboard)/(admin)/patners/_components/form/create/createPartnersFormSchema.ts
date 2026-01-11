import { z } from 'zod';

export const createPartnersFormSchema = z.object({
    name: z.string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(100, "Le nom ne peut pas dépasser 100 caractères"),

    /*logo_file: z.instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB max
            "Le fichier ne doit pas dépasser 5MB"
        )
        .refine(
            (file) => !file || ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
            "Le fichier doit être une image (JPEG, PNG, WebP)"
        ),*/

    establishment_type: z.string()
        .min(2, "Le type d'établissement est requis")
        .max(50, "Le type ne peut pas dépasser 50 caractères"),

    identification_number: z.object({
        identification_type: z.enum(['IFU', 'RCCM', 'Agrément Santé', 'Autre'], {
            required_error: "Le type d'identification est requis"
        }),
        identification_value: z.string()
            .min(1, "Le numéro d'identification est requis")
            .max(50, "Le numéro ne peut pas dépasser 50 caractères")
    }),

    contact: z.object({
        email: z.string()
            .email("Format d'email invalide")
            .min(1, "L'email est requis"),

        phone_number: z.string()
            .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
            .max(20, "Le numéro ne peut pas dépasser 20 caractères")
            .regex(/^[+]?[\d\s()-]+$/, "Format de téléphone invalide"),

        website: z.string()
            .url("Format d'URL invalide")
            .optional()
            .or(z.literal(''))
    }),

    address: z.object({
        city: z.string()
            .min(2, "La ville est requise")
            .max(50, "La ville ne peut pas dépasser 50 caractères"),

        country: z.string()
            .min(2, "Le pays est requis")
            .max(50, "Le pays ne peut pas dépasser 50 caractères"),

        street: z.string()
            .min(2, "La rue est requise")
            .max(100, "La rue ne peut pas dépasser 100 caractères"),

        additional_info: z.string()
            .max(200, "Les informations supplémentaires ne peuvent pas dépasser 200 caractères")
            .optional()
            .or(z.literal(''))
    })
});

export type CreatePartnerFormSchema = z.infer<typeof createPartnersFormSchema>;