'use client'

import {useUserStore} from "@/stores/useUserStore";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {useTransactionStore} from "@/stores/useTransactionStore";
import {TransactionDetailsSheet} from "@/components/transactionDetailsSheet/TransactionDetailsSheet";
import {CardComponent} from "@/components/CardComponent";
import api from "@/services/axiosConfig";
import {ArrowRightLeft} from "lucide-react";
import Link from "next/link";


interface TransactionType {
    _id: string
    transaction_number: string
    amount: number
    transaction_owner: string,
    transaction_receiver: string,
    description: string
    phonenumber: string
    timestamp: string
    method: string
    status: string

}


export default function FacturePage() {

    const user = useUserStore(state => state.user);

    const getWallet = async () => {
        const response = await api.get(`/wallets/me`);
        return response.data;
    }

    const {data: walletData, isLoading} = useQuery({
        queryKey: ['wallet'],
        queryFn: getWallet,
        refetchOnWindowFocus: false,
        refetchInterval: 1000 * 60 * 5
    });

    const getAllTransactions = async () => {
        // "use server"
        const response = await api.get(`/transactions/me`);
        return response.data;
    }

    const getTransactionOwer = async () => {
        const response = await api.get(`/transactions/me`);
        return response.data;
    }


    const {data: transactionsData} = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
    });

    // const {data: transactionOwner, isLoading: transactionOwnerIsLoading} = useQuery({
    //     queryKey: ['users', transactionsData?.map((item: {transaction_owner: string})=>item.transaction_owner)],
    //     queryFn: async () =>{
    //         if(!transactionsData) return [];
    //         const user = transactionsData?.map((item: {transaction_owner: string})=>getTransactionOwer(item.transaction_owner));
    //         return Promise.all(user)
    //     }
    // })

    const {setIsOpen} = useTransactionStore();

    return (
        <CardComponent className={'flex flex-col gap-10 w-full '}>
            <h1 className={'text-2xl font-semibold'}>Wallet</h1>
            <div className="flex flex-col justify-center w-full max-w-screen-xl gap-10 justify-self-center">
                <div className={'w-full flex gap-10 items-center'}>
                    {
                        isLoading
                            ?
                            <div className="w-full flex gap-5 items-stretch">
                                <div className="flex-1">
                                    <Skeleton className={'w-full h-[275px] rounded-2xl'}/>
                                </div>
                                <div className="w-64 flex flex-col gap-4">
                                    <Skeleton className={'w-full h-20 rounded-xl'}/>
                                    <Skeleton className={'w-full h-20 rounded-xl'}/>
                                    <Skeleton className={'w-full h-20 rounded-xl'}/>
                                </div>
                            </div>
                            :
                            <div className={'w-full flex gap-5'}>
                                <div
                                    className="w-full relative flex flex-col justify-center items-center bg-gradient-to-br from-custom_color-green to-emerald-700 rounded-2xl p-12 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="absolute top-4 left-4 text-emerald-200 opacity-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20"
                                             fill="currentColor">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                                            <path fillRule="evenodd"
                                                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <span className="text-emerald-100 text-sm mb-2">Solde disponible</span>
                                    <span className={'text-6xl font-bold text-white flex gap-4 items-start'}>
                                        <sup
                                            className={'text-xl text-emerald-200 mt-2'}>{walletData && walletData?.currency}</sup>
                                        <span className="tracking-tight">{walletData && walletData?.balance}</span>
                                    </span>
                                </div>
                                <div className={'flex gap-4 flex-col min-w-[200px]'}>
                                    <Button
                                        variant={'outline'}
                                        className={'flex-1 py-8 text-lg font-medium bg-[#2ECC71] transition-colors duration-300 rounded-xl border-2'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                        Déposer
                                    </Button>
                                    <Button
                                        variant={'default'}
                                        className={'flex-1 py-8 text-lg font-medium bg-[#E74C3C] transition-colors duration-300 rounded-xl text-white'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                        Retirer
                                    </Button>
                                    <Button
                                        variant={'outline'}
                                        className={'flex-1 py-8 text-lg font-medium bg-[#2980B9] text-white transition-colors duration-300 rounded-xl border-2'}
                                    >
                                        <ArrowRightLeft className={'h-5 w-5 mr-2'} size={34}/>
                                        Transferer
                                    </Button>
                                </div>
                            </div>
                    }
                </div>


                <div className={'w-full flex flex-col gap-4'}>
                    <div className={'w-full flex justify-between items-center py-4'}>
                        <h2 className={'text-left font-semibold'}>Historique des transactions</h2>
                        <Link href={'/transactions'} className={'underline text-sm text-blue-600'}> Tout afficher </Link>
                    </div>
                    <div className={'w-full flex flex-col border-t py-4'}>

                        <div className={'flex justify-between w-full items-center border-b pb-2 h-10'}>

                        </div>
                        <div className={'flex justify-between w-full items-center border-b pb-2 h-10'}>

                        </div>
                        <div className={'flex justify-between w-full items-center border-b pb-2 h-10'}>

                        </div>
                        {/* {
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
                        } */}
                    </div>
                </div>
            </div>

            {/*<TransactionDetailsSheet />*/}
        </CardComponent>
    )
}