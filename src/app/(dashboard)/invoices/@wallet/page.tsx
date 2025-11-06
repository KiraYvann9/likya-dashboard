'use client'

import {fetchData} from "@/services/service";
import {useUserStore} from "@/stores/useUserStore";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {useTransactionStore} from "@/stores/useTransactionStore";
import {TransactionDetailsSheet} from "@/components/transactionDetailsSheet/TransactionDetailsSheet";
import { CardComponent } from "@/components/CardComponent";


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
    console.log('user in transaction : ', user)

    const getWallet = async () =>{
        const response = await fetchData(`/wallets`);
        return response.items;
    }

    const getAllTransactions = async () =>{
        const response = await fetchData(`/transactions?transaction_receiver=${user._id}`);
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
        <CardComponent className={'flex flex-col gap-10 w-full '}>
            <h1>Wallet</h1>
            <div className="flex flex-col justify-center w-full max-w-screen-xl gap-10 justify-self-center">
                <div className={'w-full flex gap-10 items-center'}>
                    {
                        isLoading
                            ? 
                            <div className="flex">
                                <Skeleton className={'p-10 w-full flex h-36'}/>
                                <Skeleton className={'p-10 w-full flex h-36'}/>
                                <Skeleton className={'p-10 w-full flex h-36'}/>
                            </div>
                            : 
                            <div className={'w-full flex gap-5'}>
                                <div className="w-full relative flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="absolute top-4 left-4 text-blue-200 opacity-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-blue-100 text-sm mb-2">Solde disponible</span>
                                    <span className={'text-6xl font-bold text-white flex gap-4 items-start'}>
                                        <sup className={'text-xl text-blue-200 mt-2'}>{walletData && walletData[0]?.currency}</sup>
                                        <span className="tracking-tight">{walletData && walletData[0]?.balance}</span>
                                    </span>
                                </div>
                                <div className={'flex gap-4 flex-col min-w-[200px]'}>
                                    <Button 
                                        variant={'outline'} 
                                        className={'flex-1 py-8 text-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300 rounded-xl border-2'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Déposer
                                    </Button>
                                    <Button 
                                        variant={'default'} 
                                        className={'flex-1 py-8 text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-xl'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Retirer
                                    </Button>
                                </div>
                            </div>
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
        </CardComponent>
    )
}