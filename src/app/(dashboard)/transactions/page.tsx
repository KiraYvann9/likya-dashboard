'use client'

import {fetchData} from "@/services/service";

export default function TransactionsPage() {

    //const transactions = await getAllTransactions()

    const getAllTransactions = async () => {
        const response = await fetchData('/transactions');
        console.log('Transactions :',response)
    }

    getAllTransactions()

    return(
        <></>
    )
}