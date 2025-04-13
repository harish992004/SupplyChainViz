import * as React from "react"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "relative h-[200px] w-full", 
      className
    )}
    {...props}
  />
))
Chart.displayName = "Chart"

export { Chart }
