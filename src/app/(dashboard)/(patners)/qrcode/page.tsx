'use client'

import {Button} from "@/components/ui/button";
import {Camera, Download, Printer} from "lucide-react";
import {QRCodeCanvas} from 'qrcode.react';
import Image from "next/image";
import {useRef} from "react";

import html2canvas from 'html2canvas'
import {jsPDF} from 'jspdf'
import {useUserStore} from "@/stores/useUserStore";

export default function QrCodePage(){

    const user = useUserStore(s => s.user)

    const printRef = useRef(null)

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a5"
    })

    const handlePdf = async () =>{
        const document = printRef.current;

        if(!document) return null

        const canvas = html2canvas(document)
        const data = (await canvas).toDataURL("image/png")


        const imgProperties = pdf.getImageProperties(data)
        const pdfWidth = pdf.internal.pageSize.getWidth();

        //get the perfect image ratio height
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0,0,pdfWidth,pdfHeight);
        pdf.save('Likya-QrCode.pdf')

    }

    const qrData = {
        merchant_id : user?._id,
        proced_payment: true
    }

    return(
        <div className={'w-full'}>
            <div className={'flex flex-col items-center gap-8'}>
                <div className="w-full flex justify-between">
                    <h1>QrCode</h1>
                    
                    <div className={'w-full flex gap-2 justify-end'}>
                        <Button variant={'outline'} title={'Imprimer'} ><Printer/> Imprimer</Button>
                        <Button variant={'outline'} title={'Télécharger'} className="bg-red-400 text-white" onClick={handlePdf}><Download/> Télécharger / PDF</Button>
                    </div>
                </div>

                <div ref={printRef} className={'w-full px-24 py-8 bg-custom_color-blue rounded-md flex flex-col gap-8 items-center'}>
                    <Image src={'/assets/logo-white.svg'} alt={'logo'} width={250} height={128}/>
                    <div className={' p-4 bg-white rounded-md'}>
                        <QRCodeCanvas value={JSON.stringify(qrData)} size={400}/>
                    </div>

                    <div className={'text-2xl text-white flex gap-4'}><Camera size={38}/> Scanner le QR Code <br/> pour payer</div>
                </div>
            </div>

        </div>
    )
}