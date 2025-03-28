import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"

import { cn } from "@/lib/utils"
import { updateData } from "@/services/service"
import { useFundraisingModalStore } from "@/stores/useFundraisingModalStore"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import toast from "react-hot-toast"
  
  export function FundraisingModal() {

    const queryClient = useQueryClient()

    const {isOpen, closeModal, data, type} = useFundraisingModalStore()

    const validate = async(status: 'validate' | 'reject')=>{
      if(data){
        const response = await updateData(`/collects/${data.id}/validate?collect_status=${status}`,{})
        return response.data
      }else{
        return null
      }
    }


    const handleConfirm = () => {
      if (type === 'VALIDATE') {
        const response = validate('validate')
        return response
      }else{
        const response = validate('reject')
        return response
      }
    }

    const mutation = useMutation({
      mutationFn: handleConfirm,
      onSuccess: () => {
          toast.success('La cagnote a été validée')
          queryClient.invalidateQueries({queryKey: ['collects']})
          closeModal()
      },
      onError: () => {
        toast.error('Erreur lors de la validation')
      }
    })

    return (
      <AlertDialog open={isOpen}>
        {/* <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{type==='REJECT'?'Voulez-vous vraiment annuler la cagnote':'Voulez-vous vraiment valider la cagnote'}</AlertDialogTitle>
            <AlertDialogDescription className="text-xl">
              {data?.title}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeModal}>Annuler</AlertDialogCancel>
            <AlertDialogAction className={cn(type==='VALIDATE'?"bg-green-400 text-white":"bg-red-400 text-white")} onClick={()=>mutation.mutate()}>Continuer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  