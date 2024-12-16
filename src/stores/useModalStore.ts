import {create} from 'zustand';

interface ModalType {
    isOpen : boolean,
    modalData: any,
    openModal: (status: 'CREATE' | 'EDIT' | 'DETAIL', data?:any) => void,
    closeModal: () => void,
    status: 'CREATE' | 'EDIT' | 'DETAIL'
}



export const useUserModal = create<ModalType>((set)=>({
    status: 'CREATE',
    isOpen : false,
    modalData: {},
    openModal: (status, data) => set({isOpen: true, modalData: data, status: status}),
    closeModal:()=> set({isOpen: false})
}))