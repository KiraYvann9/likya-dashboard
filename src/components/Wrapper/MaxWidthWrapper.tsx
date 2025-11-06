import React from "react";
import './wrapper.css';

export const MaxWidthWrapper = ({children}:{children: React.ReactNode}) =>{
    return(
        <div className={'w-full rounded-2xl'}>
            {children}
        </div>
    )
}