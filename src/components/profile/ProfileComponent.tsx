import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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


export const ProfileComponent = () =>{
    const {isOpen, closeModal} = useProfileSheet()
    const {user} = useUserStore()
    return(
        <Sheet open={isOpen} onOpenChange={closeModal}>
            <SheetContent className={'flex flex-col gap-20'}>
                <SheetHeader>
                    <SheetTitle>Mon Profil</SheetTitle>
                    <SheetDescription>
                        Effectuez des modification sur votre profil. Cliquez sur 'Mettre à jour'.
                    </SheetDescription>
                </SheetHeader>

                <div className={'flex flex-col gap-4'}>
                    <div className={'flex flex-col'}>
                        <Label>Nom et prénoms</Label>
                        <span className={'text-xl font-semibold'}>{user?.user?.fullname|| 'Non définit'}</span>
                    </div>
                    <div className={'flex flex-col'}>
                        <Label>E-mail</Label>
                        <span className={'text-xl font-semibold'}>{user?.user?.email || 'Non définit'}</span>
                    </div>
                    <div className={'flex flex-col'}>
                        <Label>N° Téléphone</Label>
                        <span className={'text-xl font-semibold'}>{user?.user?.phonenumber || 'Non définit'}</span>
                    </div>
                    <div className={'flex flex-col'}>
                        <Label>Adresse</Label>
                        <span className={'text-xl font-semibold'}>{user?.user?.attributes?.address || 'Non définit'}</span>
                    </div>
                    <div className={'flex flex-col'}>
                        <Label>N° Compte bancaire</Label>
                        <span className={'text-xl font-semibold'}>{user?.user?.attributes?.compte_bancaire || 'Non définit'}</span>
                    </div>
                </div>

                <SheetFooter className={'flex gap-4'}>
                    <SheetClose asChild>
                        <Button type="button" variant={'outline'}>Fermer</Button>
                    </SheetClose>
                    <Button type={'button'} variant={'default'}>Mettre à jour</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}