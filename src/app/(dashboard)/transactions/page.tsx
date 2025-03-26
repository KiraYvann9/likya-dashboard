import {getAllTransactions} from "@/app/(dashboard)/transactions/_actions/actions";

export default async function TransactionsPage() {

    const transactions = await getAllTransactions()

    console.log('Transactions :',transactions)
    return(
        <></>
    )
}