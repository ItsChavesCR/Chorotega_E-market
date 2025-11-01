"use client"

import * as React from "react"
import { ToastProps } from "@radix-ui/react-toast"

export type Toast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
}

export type ToasterToast = Omit<Toast, "id"> & { id: string }

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

type State = {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

const genId = () => Math.random().toString(36).substring(2, 9)

let state: State = { toasts: [] }
const listeners = new Set<(state: State) => void>()

function dispatch(action: Action) {
  switch (action.type) {
    case "ADD_TOAST":
      state = {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
      break
    case "UPDATE_TOAST":
      state = {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
      break
    case "DISMISS_TOAST":
      const { toastId } = action
      if (toastId) addToRemoveQueue(toastId)
      else state.toasts.forEach((t) => addToRemoveQueue(t.id))
      break
    case "REMOVE_TOAST":
      state = { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) }
      break
  }
  listeners.forEach((listener) => listener(state))
}

export function useToast() {
  const [localState, setLocalState] = React.useState<State>(state)

  React.useEffect(() => {
    const listener = (s: State) => setLocalState(s)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = genId()
    const newToast = { id, ...props }
    dispatch({ type: "ADD_TOAST", toast: newToast })
    return id
  }

  const dismiss = (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId })

  return {
    ...localState,
    toast,
    dismiss,
  }
}
