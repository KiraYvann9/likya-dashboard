import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useProfileSheet } from "@/stores/useProfileSheet";
import { useUserStore } from "@/stores/useUserStore";
import { EditUserForm } from "@/components/profile/edit/EditUserForm";
import { Mail, Phone, MapPin, User, Edit3 } from "lucide-react";

export const ProfileComponent = () => {
    const { isOpen, closeModal, isOnEdit, setEditMode } = useProfileSheet()
    const { user, profile } = useUserStore()
    
    return (
        <Sheet open={isOpen} onOpenChange={closeModal}>
            <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
                {/* Header avec gradient */}
                <div className="bg-gradient-to-br from-[#59AD96] to-[#1C8973] px-6 py-8 rounded-b-3xl shadow-lg">
                    <SheetHeader className="space-y-2">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-2xl font-bold text-white">
                                Mon Profil
                            </SheetTitle>
                            {!isOnEdit && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={setEditMode}
                                    className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                                >
                                    <Edit3 className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                        <SheetDescription className="text-blue-100">
                            {isOnEdit 
                                ? "Modifiez vos informations personnelles"
                                : "Consultez et gérez vos informations"
                            }
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Contenu principal */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {!isOnEdit ? (
                        <div className="space-y-6">
                            {/* Nom complet */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <Label className="text-sm text-gray-500 font-medium">
                                        Nom et prénoms
                                    </Label>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 ml-12 -mt-1">
                                    {profile?.lastname || profile?.firstname 
                                        ? `${profile?.lastname || ''} ${profile?.firstname || ''}`.trim()
                                        : <span className="text-gray-400 italic font-normal">Non défini</span>
                                    }
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                            {/* Email */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                        <Mail className="h-4 w-4 text-green-600" />
                                    </div>
                                    <Label className="text-sm text-gray-500 font-medium">
                                        Adresse e-mail
                                    </Label>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 ml-12 -mt-1 break-all">
                                    {profile?.email || (
                                        <span className="text-gray-400 italic font-normal">Non défini</span>
                                    )}
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                            {/* Téléphone */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                        <Phone className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <Label className="text-sm text-gray-500 font-medium">
                                        Numéro de téléphone
                                    </Label>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 ml-12 -mt-1">
                                    {profile?.phonenumber || user?.phonenumber ? (
                                        <span>{profile?.phonenumber || user?.phonenumber}</span>
                                    ) : (
                                        <span className="text-gray-400 italic font-normal">
                                            Aucun numéro ajouté
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                            {/* Adresse */}
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                        <MapPin className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <Label className="text-sm text-gray-500 font-medium">
                                        Adresse
                                    </Label>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 ml-12 -mt-1">
                                    {profile?.addresse || user?.addresse ? (
                                        <span>{profile?.addresse || user?.addresse}</span>
                                    ) : (
                                        <span className="text-gray-400 italic font-normal">
                                            Aucune adresse ajoutée
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <EditUserForm user={user} />
                    )}
                </div>

                {/* Footer */}
                {!isOnEdit && (
                    <SheetFooter className="px-6 py-4 border-t bg-gray-50/50">
                        <div className="flex gap-3 w-full sm:w-auto">
                            <SheetClose asChild>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="flex-1 sm:flex-none"
                                >
                                    Fermer
                                </Button>
                            </SheetClose>
                            <Button 
                                type="button" 
                                onClick={setEditMode}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Modifier
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}