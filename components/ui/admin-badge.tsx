import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AdminBadgeProps {
  className?: string
  showIcon?: boolean
}

export function AdminBadge({ className, showIcon = true }: AdminBadgeProps) {
  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 bg-[#0098d1]/10 text-[#0098d1] font-medium ${className}`}>
      {showIcon && <Shield className="h-3 w-3" />}
      Admin
    </Badge>
  )
}
