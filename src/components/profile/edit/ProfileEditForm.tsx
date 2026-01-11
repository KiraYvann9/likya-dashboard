"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editProfileFormSchema, type EditProfileFormValues } from "@/components/profile/edit/editProfileFormSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Mail, User, Phone, MapPin, Home, Calendar, X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/axiosConfig"
import { toast } from "react-hot-toast"
import { useUserStore } from "@/stores/useUserStore"
import { useProfileSheet } from "@/stores/useProfileSheet"

export const ProfileEditForm = () => {
    const { user, profile, updateProfile } = useUserStore()
    const closeModal = useProfileSheet(s => s.closeModal)
    const queryClient = useQueryClient()

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileFormSchema),
        defaultValues: {
            email: profile?.email ?? user?.email ?? "",
            lastname: profile?.lastname ?? "",
            firstname: profile?.firstname ?? "",
            contact: {
                phonenumber_one: profile?.contact?.phonenumber_one ?? profile?.phonenumber ?? user?.phonenumber ?? "",
                phonenumber_two: profile?.contact?.phonenumber_two ?? "",
            },
            address: {
                region: profile?.address?.region ?? "",
                city: profile?.address?.city ?? "",
                street: profile?.address?.street ?? "",
                postal_code: profile?.address?.postal_code ?? "",
            },
            date_of_birth: profile?.date_of_birth ?? "",
        },
    })

    const createProfileRequest = async (data: EditProfileFormValues) => {
        const res = await api.post("/profiles", {...data, user_id: user?._id || user?.id})
        return res.data
    }

    const updateProfileRequest = async (data: EditProfileFormValues) => {
        const userId = user?._id || user?.id
        if (!userId) throw new Error("Identifiant utilisateur introuvable")
        const res = await api.patch(`/profiles/${userId}`, data)
        return res.data
    }

    const upsertProfileRequest = async (data: EditProfileFormValues) => {
        try {

            return await updateProfileRequest(data)
        } catch (err: any) {
            const status = err?.response?.status

            if (status === 400) {
                const created = await createProfileRequest(data)
                return created
            }
            throw err
        }
    }

    const mutation = useMutation({
        mutationFn: upsertProfileRequest,
        onSuccess: (data: any) => {
            updateProfile?.(data)
            queryClient.invalidateQueries({ queryKey: ["profiles", user?._id || user?.id] })
            toast.success("Profil mis à jour avec succès")
            closeModal()
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message || err?.message || "Une erreur s'est produite"
            toast.error(message)
        },
    })

    const onSubmit = (values: EditProfileFormValues) => {
        mutation.mutate(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Section Email */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <div className="p-1.5 bg-green-50 rounded-md">
                            <Mail className="h-4 w-4 text-green-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Informations de contact</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            className="h-11 pl-10 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                            placeholder="votre@email.com"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Section Identité */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <div className="p-1.5 bg-blue-50 rounded-md">
                            <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Identité</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Nom</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="h-11 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                            placeholder="Nom de famille"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Prénom</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="h-11 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                            placeholder="Prénom"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>


                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <div className="p-1.5 bg-purple-50 rounded-md">
                            <Phone className="h-4 w-4 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Numéros de téléphone</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="contact.phonenumber_one"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Téléphone principal</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="tel"
                                                className="h-11 pl-10 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                                placeholder="+225 00 00 00 00"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact.phonenumber_two"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Téléphone secondaire</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="tel"
                                                className="h-11 pl-10 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                                placeholder="+225 00 00 00 00 (optionnel)"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Section Adresse */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <div className="p-1.5 bg-orange-50 rounded-md">
                            <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Adresse</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="address.region"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Région</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="h-11 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                            placeholder="Ex: Abidjan"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Ville</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="h-11 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                            placeholder="Ex: Cocody"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="address.street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Rue</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                className="h-11 pl-10 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                                placeholder="Nom de la rue"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address.postal_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Code postal</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="h-11 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                            placeholder="Ex: 00225"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Section Date de naissance */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <div className="p-1.5 bg-pink-50 rounded-md">
                            <Calendar className="h-4 w-4 text-pink-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-700">Informations personnelles</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Date de naissance</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="datetime-local"
                                            className="h-11 pl-10 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeModal}
                        className="flex-1 h-11 border-2 hover:bg-gray-50 rounded-lg transition-all"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                        disabled={mutation.isPending}
                    >
                        <Check className="mr-2 h-4 w-4" />
                        {mutation.isPending ? "Enregistrement..." : "Mettre à jour"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}