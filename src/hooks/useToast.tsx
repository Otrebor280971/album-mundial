import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface ToastContextValue {
  toast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const toast = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), 2200)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
          background: '#1A1917',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '20px',
          fontSize: '13px',
          opacity: visible ? 1 : 0,
          transition: 'all 0.25s',
          pointerEvents: 'none',
          zIndex: 200,
          whiteSpace: 'nowrap',
        }}
      >
        {message}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
