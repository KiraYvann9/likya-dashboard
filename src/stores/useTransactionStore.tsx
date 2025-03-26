import {create} from 'zustand'

interface TransactionStoreType {
    id: string ,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean, id: string) => void,
    close: () => void,

}
export const useTransactionStore = create<TransactionStoreType>((set)=>(
    {
        id: "",
        isOpen: false,
        setIsOpen: (isOpen, id) => { set({ isOpen: true, id: id })},
        close: () => set({ isOpen: false }),
    }
))