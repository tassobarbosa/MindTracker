import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import type { ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 4000

type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
}

type State = {
  toasts: ToasterToast[]
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & Pick<ToasterToast, 'id'> }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

let memoryState: State = { toasts: [] }

const listeners = new Set<(state: State) => void>()

function emit(nextState: State) {
  memoryState = nextState
  listeners.forEach((listener) => { listener(memoryState) })
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: 'REMOVE_TOAST', toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast,
        ),
      }
    case 'DISMISS_TOAST': {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => { addToRemoveQueue(toast.id) })
      }

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined ? { ...toast, open: false } : toast,
        ),
      }
    }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts:
          action.toastId === undefined
            ? []
            : state.toasts.filter((toast) => toast.id !== action.toastId),
      }
  }
}

function dispatch(action: Action) {
  emit(reducer(memoryState, action))
}

function generateId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function toast({ ...props }: Omit<ToasterToast, 'id'>) {
  const id = generateId()

  const dismiss = () => { dispatch({ type: 'DISMISS_TOAST', toastId: id }) }

  const update = (nextToast: Partial<ToasterToast>) => {
    dispatch({ type: 'UPDATE_TOAST', toast: { ...nextToast, id } })
  }

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss()
        }
      },
    },
  })

  return { id, dismiss, update }
}

export function useToast() {
  const [state, setState] = useState<State>(memoryState)

  useEffect(() => {
    listeners.add(setState)

    return () => {
      listeners.delete(setState)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => { dispatch({ type: 'DISMISS_TOAST', toastId }) },
  }
}