import {create} from 'zustand';

interface ModalType {
    isOpen : boolean,
    openModal: () => void,
    closeModal: () => void,
}



export const useProfileSheet = create<ModalType>((set)=>({
    isOpen : false,
    modalData: {},
    openModal: () => set({isOpen: true}),
    closeModal:()=> set({isOpen: false})
}))