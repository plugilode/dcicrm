"use client"

import { useEffect } from "react"

export default function HiddenAdminLink() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A shortcut for admin panel
      if (e.altKey && e.key === "a") {
        // Navigate to admin page
        window.location.href = "/admin"
      }
    }

    // Add event listener
    window.addEventListener("keydown", handleKeyDown)
    
    // Clean up
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // This component is invisible and renders nothing visually
  return null
}
