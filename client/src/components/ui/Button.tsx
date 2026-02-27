import React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'solid' | 'outline' | 'ghost' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export function Button({ className, variant = 'solid', size = 'md', icon, children, ...props }: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
    const sizeClasses = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const variantClasses = {
        solid: "bg-[#1f2937] text-white hover:bg-[#374151]",
        outline: "border border-[#2a2d36] text-white hover:bg-[#1f2937]",
        ghost: "text-slate-400 hover:text-white hover:bg-[#1f2937]",
        gradient: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 drop-shadow-md"
    };

    return (
        <button
            className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
}
