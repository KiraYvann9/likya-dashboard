"use server"

import api from "@/services/axiosConfig";

interface TransactionOwnerType {
    _id: string,
    fullname: string,
    phonenumber: string,
    email: string
}

const getWallet = async () =>{
    const response = await api.get(`/wallets`);
    return response.data;
}

const getAllTransactions = async () =>{
    const response = await api.get(`/transactions`);
    return response.data;
}

const getTransactionOwer = async (id: string): Promise<TransactionOwnerType> =>{
    const response = await api.get(`/users/${id}`);
    return response.data;
}

export { getWallet, getAllTransactions, getTransactionOwer }