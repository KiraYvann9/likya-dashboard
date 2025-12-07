
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
import {useProfileSheet} from "@/stores/useProfileSheet";
import {useUserStore} from "@/stores/useUserStore";
import {EditUserForm} from "@/components/profile/edit/EditUserForm";

export const ProfileComponent = () =>{
    const {isOpen, closeModal, isOnEdit, setEditMode} = useProfileSheet()
    const {user} = useUserStore()
    return(
        <Sheet open={isOpen} onOpenChange={closeModal}>
            <SheetContent className={'flex flex-col gap-20'}>
                <SheetHeader>
                    <SheetTitle>Mon Profil</SheetTitle>
                    <SheetDescription>
                        Effectuez des modification sur votre profil. Cliquez sur &#39;Mettre à jour&#39;.
                    </SheetDescription>
                </SheetHeader>
                {
                    !isOnEdit ?
                        <div className={'flex flex-col gap-4'}>
                            <div className={'flex flex-col'}>
                                <Label>Nom et prénoms</Label>
                                <span className={'text-xl font-semibold'}>{user?.fullname|| 'Non définit'}</span>
                            </div>
                            <div className={'flex flex-col'}>
                                <Label>E-mail</Label>
                                <span className={'text-xl font-semibold'}>{user?.email || 'Non définit'}</span>
                            </div>
                            <div className={'flex flex-col'}>
                                <Label>N° Téléphone</Label>
                                <span className={'text-xl font-semibold'}>{user?.phonenumber || 'Non définit'}</span>
                            </div>
                            <div className={'flex flex-col'}>
                                <Label>Adresse</Label>
                                <span className={'text-xl font-semibold'}>{user?.attributes?.address || 'Non définit'}</span>
                            </div>
                            <div className={'flex flex-col'}>
                                <Label>N° Compte bancaire</Label>
                                <span className={'text-xl font-semibold'}>{user?.attributes?.compte_bancaire || 'Non définit'}</span>
                            </div>
                        </div>
                        :
                    <EditUserForm user={user}/>
                }

                { !isOnEdit &&
                    <SheetFooter className={'flex gap-4'}>
                        <SheetClose asChild>
                            <Button type="button" variant={'outline'} >Fermer</Button>
                        </SheetClose>
                        <Button type={'button'} variant={'default'} onClick={setEditMode}>Mettre à jour</Button>
                    </SheetFooter>
                }
            </SheetContent>
        </Sheet>
    )
}