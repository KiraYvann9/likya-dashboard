
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {CreateUserForm} from "@/app/(dashboard)/settings/_components/form/create/CreateUserForm";
import {useUserModal} from "@/stores/useModalStore";

export function UserModal() {

    const isOpen = useUserModal(state => state.isOpen)
    const closeModal = useUserModal(state => state.closeModal)
    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-[475px]">
                <DialogHeader>
                    <DialogTitle>Créer un utilisateur</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <CreateUserForm/>
            </DialogContent>
        </Dialog>
    )
}
