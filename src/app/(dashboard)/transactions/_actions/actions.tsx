"use server"

import {fetchData} from "@/services/service";

interface TransactionOwnerType {
    _id: string,
    fullname: string,
    phonenumber: string,
    email: string
}

const getWallet = async () =>{
    const response = await fetchData(`/wallets`);
    return response.items;
}

const getAllTransactions = async () =>{
    const response = await fetchData(`/transactions`);
    return response.items;
}

const getTransactionOwer = async (id: string): Promise<TransactionOwnerType> =>{
    const response = await fetchData(`/users/${id}`);
    return response;
}

export { getWallet, getAllTransactions, getTransactionOwer }