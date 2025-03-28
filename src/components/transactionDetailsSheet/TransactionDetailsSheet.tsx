'use client'

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import {useTransactionStore} from "@/stores/useTransactionStore";
import {fetchData} from "@/services/service";
import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";

export function TransactionDetailsSheet() {

    const {isOpen, id, close} = useTransactionStore();

    const getAllTransactions = async () =>{
        const response = await fetchData(`/transactions/${id}`);
        return response
    }

    const {data, refetch} = useQuery({
        queryKey: ['Transaction-details'],
        queryFn: getAllTransactions,
    })

    useEffect(() => {
        if (isOpen) refetch()
    }, [isOpen, refetch])

    return (
        <Sheet open={isOpen} onOpenChange={close}>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Détails de la transaction <br/><span className={'text-green-500'}>[{data?.transaction_number}]</span></SheetTitle>
                    <SheetDescription>
                        {data?.description}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <h1 className={'text-2xl font-semibold'}>{data?.amount} XOF</h1>
                    <p>Status : {data?.status}</p>
                    <div className={'flex flex-col gap-4'}>
                        <strong>Effecté par :</strong>
                        <span>{data?.transaction_owner?.fullname}</span>
                        <span>{data?.transaction_owner?.phonenumber}</span>
                        <span>{data?.transaction_owner?.email}</span>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit" onClick={close}>Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
