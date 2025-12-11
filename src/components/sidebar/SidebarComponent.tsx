'use client'
import SidebarItems, { getSidebarItems, sidebarItemType } from "@/components/sidebar/SidebarItems";
import Link from "next/link";
import Image from "next/image"

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";
import {CardComponent} from "@/components/CardComponent";

export const SidebarComponent = () => {
    const user = useUserStore(s => s.user)

    const pathname = usePathname()
    const items = getSidebarItems(user)

    return (
        <CardComponent className={'flex flex-col gap-10 h-screen sticky top-0 left-0 z-10 '}>
            <section className={'w-[200px] min-h-screen py-8 px-4 flex flex-col items-center gap-24'}>
                <Image src={'/assets/logo2.svg'} alt={'logo'} width={100} height={40} />
                <ul className='w-full'>
                    {items.map((item: sidebarItemType) => {
                        return (
                            <li key={item.id}>
                                <Link href={item.link} className={cn('text-custom_color-blue  w-full flex gap-4 items-center p-2 hover:bg-white rounded-xl hover:shadow-md transition-all duration-200', pathname === item.link && 'bg-gradient-to-r from-[#5EB49D] to-[#18937F] text-white rounded-xl dropshadow-xl')}><item.icon/> {item.title}</Link>

                            </li>
                        )
                    })}
                    {/* {
                        SidebarItems.map((item: sidebarItemType) => {
                            return (
                                <li key={item.id}>
                                    <Link href={item.link} className={cn('text-custom_color-blue ', pathname === item.link && 'bg-gradient-to-r from-[#5EB49D] to-[#18937F] text-white rounded-xl dropshadow-xl')}><item.icon /> {item.title}</Link>
                                </li>
                            )
                        })
                    } */}

                </ul>
            </section>
        </CardComponent>
    )
}