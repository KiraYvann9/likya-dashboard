

import { CardComponent } from "@/components/CardComponent";
import { getAllTransactions } from "./_actions/actions";

export default async function TransactionsPage() {

    const transactions = await getAllTransactions()

    // const getAllTransactions = async () => {
    //     const response = await fetchData('/transactions');
    //     console.log('Transactions :',response)
    // }


    return(
        <CardComponent className="min-h-[70%] w-full">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        </CardComponent>
    )
}