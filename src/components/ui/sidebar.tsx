
"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type SidebarContextProps = {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps>({
  isCollapsed: false,
  setIsCollapsed: () => undefined,
})

export function SidebarProvider({
  children,
  defaultState = false,
}: {
  children: React.ReactNode
  defaultState?: boolean
}) {
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(defaultState)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)

  if (context === undefined)
    throw new Error("useSidebar must be used within a SidebarProvider")

  return context
}

export function SidebarTrigger() {
  const { setIsCollapsed, isCollapsed } = useSidebar()

  return (
    <button
      type="button"
      onClick={() => setIsCollapsed((prev) => !prev)}
      className={cn(
        "absolute left-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all",
        isCollapsed && "lg:left-[4.5rem]"
      )}
    >
      {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
    </button>
  )
}

export function Sidebar({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={cn(
        "group fixed inset-y-0 flex w-[240px] flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-width duration-300 ease-in-out",
        isCollapsed && "w-[70px]",
        className
      )}
    >
      <div className="flex flex-1 flex-col overflow-hidden pb-6">
        {children}
      </div>
    </aside>
  )
}

export function SidebarHeader({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-center border-b border-border px-4",
        className
      )}
    >
      {children}
    </header>
  )
}

export function SidebarContent({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden px-2 py-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SidebarGroup({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1 py-1", className)}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isCollapsed } = useSidebar()

  return (
    <div className={cn("px-2", className, isCollapsed && "hidden")}>
      <h3
        className={cn(
          "mb-1 mt-2 text-xs font-medium text-sidebar-foreground/80"
        )}
      >
        {children}
      </h3>
    </div>
  )
}

export function SidebarGroupContent({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("", className)}
    >
      {children}
    </div>
  )
}

export function SidebarMenu({
  children,
  className,
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("m-0 list-none p-0", className)}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({
  children,
  className,
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("m-0 p-0", className)}>
      {children}
    </li>
  )
}

const sidebarButtonVariants = cva(
  "group flex w-full items-center rounded-md border border-transparent px-2 py-1 transition-colors",
  {
    variants: {
      variant: {
        default:
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        ghost: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  asChild?: boolean;
}

export function SidebarMenuButton({
  className,
  variant,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const { isCollapsed } = useSidebar()
  const Comp = asChild ? React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    (asdProps, ref) => React.cloneElement(React.Children.only(asdProps.children as React.ReactElement), {
      ref,
      className: cn(sidebarButtonVariants({ variant }), className),
    })
  ) : "button"

  return (
    <Comp
      className={asChild ? undefined : cn(sidebarButtonVariants({ variant }), className)}
      {...props}
    >
      {asChild ? null : (
        <>
          {props.children && React.Children.map(props.children, (child, index) => {
            if (index === 0) {
              return <span className="mr-2 flex h-5 w-5 items-center justify-center">
                {child}
              </span>
            }
            return isCollapsed ? null : child
          })}
        </>
      )}
    </Comp>
  )
}

export function SidebarFooter({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn(
        "mb-2 mt-auto flex flex-col gap-2 px-2 py-2",
        className
      )}
    >
      {children}
    </footer>
  )
}
