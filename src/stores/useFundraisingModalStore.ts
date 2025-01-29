import {create} from 'zustand';

type modalType= 'VALIDATE' | 'REJECT'
type dataType = {
    id: string, title: string
}

interface confirmModalType{
    data: dataType | null,
    type: modalType | null,
    isOpen: boolean, 
    openModal: (type: modalType, data:dataType) => void,
    closeModal: () => void
}

export const useFundraisingModalStore = create<confirmModalType>((set)=>({
    data: null,
    type: null,
    isOpen: false,
    openModal: (type: modalType, data: dataType) => set({type, data, isOpen: true}),
    closeModal: () => set({isOpen: false})
}))