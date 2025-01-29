import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { postData, updateData } from "@/services/service"
import { useFundraisingModalStore } from "@/stores/useFundraisingModalStore"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
  
  export function FundraisingModal() {

    const {isOpen, closeModal, data, type} = useFundraisingModalStore()

    const validate = async()=>{
      const response = await updateData(`/collects/${data?.id}/validate`,{})
      return response.data
    }
    const reject = async()=>{
      const response = await updateData(`/collects/${data?.id}/reject`,{})
      return response.data
    }

    const handleConfirm = () => {
      if (type === 'VALIDATE') {
        const response = validate()
        return response
      }else{
        const response = reject()
        return response
      }
    }

    const mutation = useMutation({
      mutationFn: handleConfirm,
      onSuccess: () => {
        toast.success('La cagnote a été validée')
      },
      onError: (error) => {
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
  