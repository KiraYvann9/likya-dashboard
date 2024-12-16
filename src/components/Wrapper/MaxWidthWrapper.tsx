import React from "react";
import './wrapper.css'
export const MaxWidthWrapper = ({children}:{children: React.ReactNode}) =>{
    return(
        <div className={'w-full min-h-full border p-4 rounded-md bg-white'}>
            {children}
        </div>
    )
}