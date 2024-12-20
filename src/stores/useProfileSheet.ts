import {create} from 'zustand';

interface ModalType {
    isOnEdit: boolean,
    isOpen : boolean,
    setEditMode: ()=> void,
    openModal: () => void,
    closeModal: () => void,
}



export const useProfileSheet = create<ModalType>((set)=>({
    isOnEdit: false,
    isOpen : false,
    modalData: {},
    setEditMode: () => set({isOnEdit: true}),
    openModal: () => set({isOpen: true}),
    closeModal:()=> set({isOpen: false, isOnEdit: false})
}))