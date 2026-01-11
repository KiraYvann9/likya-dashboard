import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { CreatePartnersForm } from "../form/create/CreatePartnersForm"
import { EditPartnersForm } from "../form/edit/EditPartnersForm"
import {useUserModal} from "@/stores/useModalStore";
import {Button} from "@/components/ui/button";

export function UserSheet() {
    const {isOpen,openModal, closeModal, modalData, status} = useUserModal()
    return (
        <Sheet open={isOpen} onOpenChange={closeModal}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        {status==='CREATE'&&'Création'}
                        {status==='DETAIL'&&'Détails'}
                        {status==='EDIT'&&'Modification'}
                    </SheetTitle>
                    <SheetDescription>
                        {status==='CREATE'&&'Création d\'un utilisateur'}
                        {status==='DETAIL'&&'Détail de l\'utilisateur.'}
                        {status==='EDIT'&&'Modification de l\'utilisateur'}
                    </SheetDescription>
                </SheetHeader>

                <div>
                    {status==='CREATE'&&<CreatePartnersForm/>}
                    {status==='EDIT'&&<EditPartnersForm/>}
                </div>


                {status==='DETAIL'&&
                    <>
                        <div className={'my-8 space-y-4'}>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>Nom et prénom</span>
                                <h3 className={'text-xl font-semibold'}>{modalData?.fullname}</h3>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>N° Téléphone</span>
                                <h3 className={'text-xl font-semibold'}>{modalData?.phonenumber}</h3>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>E-mail</span>
                                <h3 className={'text-xl font-semibold'}>{modalData?.email}</h3>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>Rôle</span>
                                <h3 className={'text-xl font-semibold'}>{modalData?.extras?.role_info.name}</h3>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>Adresse</span>
                                <h3 className={'text-xl font-semibold'}>{modalData?.attributes?.address}</h3>
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span className={'text-muted-foreground'}>Adresse</span>
                                <h3 className={'text-xl font-semibold'}>{modalData?.attributes?.compte_bancaire}</h3>
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button>Fermer</Button>
                            </SheetClose>
                            {/*je passe la data récupérée lorsque a cliqué sur le button détail, si les données seront effacé
                            lorsqu'on va cliquer sur ce button*/}
                            <Button variant={'secondary'} onClick={()=>openModal('EDIT', modalData)}>Modifier</Button>
                        </SheetFooter>
                    </>
                }
            </SheetContent>
        </Sheet>
    )
}
