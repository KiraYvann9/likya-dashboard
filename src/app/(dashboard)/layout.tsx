import React from "react";
import {MaxWidthWrapper, NavComponent, SidebarComponent} from "@/components";
import './layout.css'

export default function DashboardLayout({children}: {
    children: React.ReactNode
}){
    return(
        <div className={'main_container'}>
            <SidebarComponent/>
            <div className={'content'}>
                <NavComponent/>
                <div className={"main"}>
                    <MaxWidthWrapper>
                        {children}
                    </MaxWidthWrapper>
                </div>
            </div>
        </div>
    )
}