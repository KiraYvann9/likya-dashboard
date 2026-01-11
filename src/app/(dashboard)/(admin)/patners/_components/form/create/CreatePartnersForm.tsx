import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createPartnersFormSchema, type CreatePartnerFormSchema } from './createPartnersFormSchema';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUserModal } from "@/stores/useModalStore";
import api from "@/services/axiosConfig";
import { AxiosError } from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Type pour les erreurs API
interface ApiErrorResponse {
    message?: string;
    error?: string;
}

export const CreatePartnersForm = () => {
    const closeModal = useUserModal(state => state.closeModal);
    const queryClient = useQueryClient();

    const form = useForm<CreatePartnerFormSchema>({
        resolver: zodResolver(createPartnersFormSchema),
        defaultValues: {
            name: '',
            // logo_file: undefined,
            establishment_type: '',
            identification_number: {
                identification_type: 'IFU',
                identification_value: ''
            },
            contact: {
                email: '',
                phone_number: '',
                website: ''
            },
            address: {
                city: '',
                country: '',
                street: '',
                additional_info: ''
            }
        }
    });

    const createPartner = async (data: CreatePartnerFormSchema) => {
        // const formData = new FormData();
        //
        // formData.append('name', data.name);
        // formData.append('establishment_type', data.establishment_type);

        // if (data.logo_file instanceof File) {
        //     formData.append('logo', data.logo_file);
        // }

        // formData.append('identification_number', JSON.stringify(data.identification_number));
        // formData.append('contact', JSON.stringify(data.contact));
        // formData.append('address', JSON.stringify(data.address));

        const response = await api.post('/establishments', data);
        return response.data;
    };

    const mutation = useMutation({
        mutationKey: ['partners-create'],
        mutationFn: createPartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partners'] });
            toast.success('Partenaire créé avec succès !');
            form.reset();
            closeModal();
        },
        onError: (err: AxiosError<ApiErrorResponse>) => {
            console.error('Erreur création partenaire:', err.response?.data);
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || err.message
                || 'Une erreur est survenue lors de la création du partenaire';
            toast.error(errorMessage);
        }
    });

    const onSubmit = async (data: CreatePartnerFormSchema) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Type d'identification */}
                <FormField
                    name="identification_number.identification_type"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>
                                Type d'identification
                                <span className="text-red-500 ml-1" aria-label="requis">*</span>
                            </FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={mutation.isPending}
                                >
                                    <SelectTrigger className="border h-10">
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IFU">IFU</SelectItem>
                                        <SelectItem value="RCCM">RCCM</SelectItem>
                                        <SelectItem value="Agrément Santé">Agrément Santé</SelectItem>
                                        <SelectItem value="Autre">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Nom du partenaire */}
                <FormField
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>
                                Nom du partenaire
                                <span className="text-red-500 ml-1" aria-label="requis">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    className="border h-10"
                                    placeholder="Nom"
                                    disabled={mutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="name"
                    control={form.control}
                />

                {/* Logo - CORRIGÉ */}
                {/*<FormField
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem className="w-full">
                            <FormLabel>Logo</FormLabel>
                            <FormControl>
                                <Input
                                    {...fieldProps}
                                    type="file"
                                    className="border h-10"
                                    accept="image/*"
                                    disabled={mutation.isPending}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        onChange(file || undefined);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="logo_file"
                    control={form.control}
                />*/}

                {/* Type d'établissement */}
                <FormField
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>
                                Type d'établissement
                                <span className="text-red-500 ml-1" aria-label="requis">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    className="border h-10"
                                    placeholder="Ex: Société, ONG..."
                                    disabled={mutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="establishment_type"
                    control={form.control}
                />

                {/* Numéro d'identification */}
                <FormField
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>
                                Numéro d'identification
                                <span className="text-red-500 ml-1" aria-label="requis">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    className="border h-10"
                                    placeholder="Valeur"
                                    disabled={mutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="identification_number.identification_value"
                    control={form.control}
                />

                {/* Contact - Grid 3 colonnes */}
                <div className="grid grid-cols-3 gap-3">
                    <FormField
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Email
                                    <span className="text-red-500 ml-1" aria-label="requis">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        className="border h-10"
                                        placeholder="email@exemple.com"
                                        disabled={mutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name="contact.email"
                        control={form.control}
                    />

                    <FormField
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Téléphone
                                    <span className="text-red-500 ml-1" aria-label="requis">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        className="border h-10"
                                        placeholder="Ex: +229..."
                                        disabled={mutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name="contact.phone_number"
                        control={form.control}
                    />

                    <FormField
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Site web</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        className="border h-10"
                                        placeholder="https://votre-site.com"
                                        disabled={mutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name="contact.website"
                        control={form.control}
                    />
                </div>

                {/* Adresse - Grid 2 colonnes */}
                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Ville
                                    <span className="text-red-500 ml-1" aria-label="requis">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        className="border h-10"
                                        placeholder="Ville"
                                        disabled={mutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name="address.city"
                        control={form.control}
                    />

                    <FormField
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Pays
                                    <span className="text-red-500 ml-1" aria-label="requis">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        className="border h-10"
                                        placeholder="Pays"
                                        disabled={mutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name="address.country"
                        control={form.control}
                    />
                </div>

                {/* Rue */}
                <FormField
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>
                                Rue
                                <span className="text-red-500 ml-1" aria-label="requis">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    className="border h-10"
                                    placeholder="Rue"
                                    disabled={mutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="address.street"
                    control={form.control}
                />

                {/* Informations supplémentaires */}
                <FormField
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Informations supplémentaires</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    className="border h-10"
                                    placeholder="Appartement, repère..."
                                    disabled={mutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name="address.additional_info"
                    control={form.control}
                />

                {/* Boutons d'action */}
                <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                    <Button
                        onClick={closeModal}
                        type="button"
                        variant="outline"
                        disabled={mutation.isPending}
                    >
                        Fermer
                    </Button>
                    <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Création...' : (
                            <>
                                <Plus className="mr-2" size={18} />
                                Créer
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};