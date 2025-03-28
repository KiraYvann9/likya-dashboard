'use client'

import {fetchData} from "@/services/service";
import {useUserStore} from "@/stores/useUserStore";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {useTransactionStore} from "@/stores/useTransactionStore";
import {TransactionDetailsSheet} from "@/components/transactionDetailsSheet/TransactionDetailsSheet";


interface TransactionType {
    _id: string
    transaction_number: string
    amount: number
    transaction_owner: string,
    transaction_receiver : string,
    description: string
    phonenumber: string
    timestamp: string
    method: string
    status: string

}

interface TransactionOwnerType {
    _id: string,
    fullname: string,
    phonenumber: string,
    email: string
}

export default function FacturePage(){

    const user = useUserStore(state => state.user);
    console.log('user',user)

    const getWallet = async () =>{
        const response = await fetchData(`/wallets`);
        return response.items;
    }

    const getAllTransactions = async () =>{
        const response = await fetchData(`/transactions?transaction_receiver=${user?.user?._id}`);
        return response.items;
    }

    const getTransactionOwer = async (id: string): Promise<TransactionOwnerType> =>{
        const response = await fetchData(`/users/${id}`);
        return response;
    }

    const {data: walletData, isLoading} = useQuery({
        queryKey: ['wallet'],
        queryFn: getWallet,
    });

    const {data: transactionsData} = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
    });

    const {data: transactionOwner, isLoading: transactionOwnerIsLoading} = useQuery({
        queryKey: ['users', transactionsData?.map((item: {transaction_owner: string})=>item.transaction_owner)],
        queryFn: async () =>{
            if(!transactionsData) return [];
            const user = transactionsData?.map((item: {transaction_owner: string})=>getTransactionOwer(item.transaction_owner));
            return Promise.all(user)
        }
    })

    const {setIsOpen} = useTransactionStore();

    return(
        <div>
            <h1>Wallet</h1>
            <div className="flex flex-col justify-center w-full max-w-screen-xl gap-10 justify-self-center">
                <div className={'grid grid-cols-3 gap-10 items-center'}>
                    {
                        isLoading
                            ? <>
                                <Skeleton className={'p-10 w-full flex h-36'}/>
                                <Skeleton className={'p-10 w-full flex h-36'}/>
                                <Skeleton className={'p-10 w-full flex h-36'}/>
                            </>
                            : <>
                                <div></div>
                                <div className={'w-full flex flex-col gap-5'}>
                                    <div className=" relative flex flex-col justify-center items-center bg-blue-600 rounded-md p-10 ">
                                        <span className={'text-5xl font-semibold text-white flex gap-4'}> <sup className={'text-xl text-white'}>{walletData && walletData[0]?.currency}</sup> <span>{walletData && walletData[0]?.balance}</span></span>
                                    </div>
                                    <div className={'flex gap-4'}>
                                        <Button variant={'outline'} className={'flex-1 py-6'}>Déposer</Button>
                                        <Button variant={'default'} className={'flex-1 py-6'}>Retirer</Button>
                                    </div>
                                </div>
                                <div></div>

                            </>
                    }
                </div>


                <div className={'w-full flex flex-col gap-4'}>
                    <h2 className={'text-left font-semibold'}>Historique des transactions</h2>
                    <div className={'w-full flex flex-col border-t px-24 py-4'}>
                        {
                            transactionsData && transactionsData.map( (item: TransactionType, index: number) => {
                                    const user = transactionOwner?.[index]
                                    return(
                                        <div key={index}
                                             onClick={()=>setIsOpen(true, item._id)}
                                             className={'flex border-b justify-between w-full items-center py-2 px-10 cursor-pointer hover:bg-gray-200 transition-all ease-in'}>

                                            {
                                                transactionOwnerIsLoading ? <div className={'flex flex-col gap-1'}>
                                                        <Skeleton className={'w-44 flex h-4'}/>
                                                        <Skeleton className={'w-52 flex h-4'}/>
                                                    </div>
                                                    :
                                                    <div className={'flex flex-col gap-1'}>
                                                        <span className={'font-semibold'}>{user?.fullname}</span>
                                                        <span>{user?.phonenumber}</span>
                                                    </div>
                                            }
                                            <div className={'flex flex-col gap-1'}>
                                                <span
                                                    className={'font-semibold text-xl text-custom_color-blue text-right'}>{item.amount} F CFA</span>
                                                <span className={'text-sm text-gray-400'}>{
                                                    new Intl.DateTimeFormat("fr", {
                                                    timeStyle: 'medium',
                                                    dateStyle: 'long'
                                                }).format(new Date(item.timestamp))}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
            </div>

            <TransactionDetailsSheet />
        </div>
    )
}