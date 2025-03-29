
import {fetchData} from "@/services/service";
import { getAllTransactions } from "./_actions/actions";

export default async function TransactionsPage() {

    const transactions = await getAllTransactions()

    // const getAllTransactions = async () => {
    //     const response = await fetchData('/transactions');
    //     console.log('Transactions :',response)
    // }

    console.log('TRANSACTION', transactions)

    return(
        <></>
    )
}