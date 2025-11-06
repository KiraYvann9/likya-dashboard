import { cn } from "@/lib/utils"

export const CardComponent = ({children, className}:{children: React.ReactNode, className: string}) =>{
    return(
        <div className={cn(className, 'p-4 bg-gradient-to-br from-white to-white/10 rounded-2xl border border-white drop-shadow-xl')}>
            {children}
        </div>
    )
}