import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children?: React.ReactNode
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-[#0A84FF] text-white shadow-[0_4px_12px_rgba(10,132,255,0.3)] hover:shadow-[0_6px_16px_rgba(10,132,255,0.4)] border border-white/20 dark:border-white/10 relative overflow-hidden",
      secondary: "glass-panel glass-highlight text-zinc-800 dark:text-zinc-100",
      ghost: "text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10"
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97, y: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          className
        )}
        {...props}
      >
        {variant === 'primary' && (
          <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    )
  }
)
GlassButton.displayName = "GlassButton"
