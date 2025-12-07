import React from "react";
import {MaxWidthWrapper, NavComponent, SidebarComponent} from "@/components";


export default function DashboardLayout({children}: {
    children: React.ReactNode
}){
    return(
        <div className={'w-full min-h-screen flex bg-gradient-to-tr from-slate-100 to-sky-100'}>
            <SidebarComponent/>
            <div className={'w-full p-8 space-y-5'}>
                <NavComponent/>
                <div className={"w-full h-full"}>
                    <MaxWidthWrapper>
                        {children}
                    </MaxWidthWrapper>
                </div>
            </div>
        </div>
    )
}