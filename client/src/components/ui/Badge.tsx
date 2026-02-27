import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'critical' | 'high' | 'medium' | 'low' | 'default';
    dot?: boolean;
}

export function Badge({ className, variant = 'default', dot = false, children, ...props }: BadgeProps) {
    const variantStyles = {
        critical: "bg-red-500/10 text-red-500 border border-red-500/20",
        high: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
        low: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        default: "bg-[#1e2230] text-slate-300 border border-[#2a2d36]",
    };

    return (
        <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variantStyles[variant], className)} {...props}>
            {dot && (
                <span className="mr-1.5 flex h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            )}
            {children}
        </div>
    );
}
