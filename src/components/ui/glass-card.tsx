import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { scale: 1.02, y: -4 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "glass-panel glass-highlight rounded-[24px] overflow-hidden p-6 relative transition-shadow duration-300",
          hoverEffect && "hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
GlassCard.displayName = "GlassCard"
