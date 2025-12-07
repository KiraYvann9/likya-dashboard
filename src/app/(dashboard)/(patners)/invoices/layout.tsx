import React, { ReactNode } from "react";

export default function InvoicesLayout({ children, wallet, qrcode }: { children: ReactNode, wallet: ReactNode, qrcode: ReactNode }) {
    return (
        <div className="w-full p-8 pt-6 flex">
            {children}

            
            <div className="w-full flex gap-4">
                {wallet}
                {qrcode}
            </div>

            
        </div>
    )
}