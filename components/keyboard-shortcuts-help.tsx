"use client"

import { useState } from "react"
import { Keyboard } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false)

  const shortcuts = [
    { key: "Space", action: "Play/Pause" },
    { key: "←", action: "Seek backward 10s" },
    { key: "→", action: "Seek forward 10s" },
    { key: "Shift + ←", action: "Previous song" },
    { key: "Shift + →", action: "Next song" },
    { key: "↑", action: "Volume up" },
    { key: "↓", action: "Volume down" },
    { key: "M", action: "Mute/Unmute" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-gray-400">Use these shortcuts to control playback</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300">{shortcut.action}</span>
              <kbd className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-sm font-mono">{shortcut.key}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
