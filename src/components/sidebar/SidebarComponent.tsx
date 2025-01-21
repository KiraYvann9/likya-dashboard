'use client'

import './sidebar.css'
import {SidebarItems, sidebarItemType} from "@/components/sidebar/SidebarItems";
import Link from "next/link";
import Image from "next/image"

import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {useUserStore} from "@/stores/useUserStore";

export const SidebarComponent =()=>{
    const user = useUserStore(s => s.user)

    const pathname = usePathname()
    return(
        <section className={'sidebar'}>
            <Image src={'/assets/logo-white.svg'} alt={'logo'} width={100} height={40}/>
            <ul>
                {
                    SidebarItems.filter((item)=>item?.permission?.includes(user?.user?.role?.slug)).map((item: sidebarItemType) =>{
                        return(
                            <li key={item.id}>
                                <Link href={item.link} className={cn(pathname=== item.link && 'bg-white/20 border-t-white border-b-white')}><item.icon/> {item.title}</Link>
                            </li>
                        )
                    })
                }

            </ul>
        </section>
    )
}