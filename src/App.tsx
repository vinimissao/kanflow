import { useEffect, useState } from 'react'
import {
  authMe,
  clearStoredToken,
  displayNameFromMePayload,
  getStoredToken,
  isApiConfigured,
  setSessionUserId,
  userIdFromMePayload,
} from './api'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Login from './pages/Login'

type Screen = 'login' | 'cadastro' | 'board'

const STORAGE_KEY = 'kanflow_user'

function readTokenNameCache(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [userName, setUserName] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const onSessionExpired = () => {
      setUserName(null)
      setScreen('login')
      localStorage.removeItem(STORAGE_KEY)
      setSessionUserId(null)
    }
    window.addEventListener('kanflow:session-expired', onSessionExpired)
    return () => window.removeEventListener('kanflow:session-expired', onSessionExpired)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!isApiConfigured()) {
        const saved = readTokenNameCache()
        if (saved) {
          setUserName(saved)
          setScreen('board')
        }
        setAuthChecked(true)
        return
      }

      const token = getStoredToken()
      if (!token) {
        setAuthChecked(true)
        return
      }

      try {
        const me = await authMe()
        if (cancelled) return
        setSessionUserId(userIdFromMePayload(me))
        const name = displayNameFromMePayload(me)
        localStorage.setItem(STORAGE_KEY, name)
        setUserName(name)
        setScreen('board')
      } catch {
        clearStoredToken()
        localStorage.removeItem(STORAGE_KEY)
        setSessionUserId(null)
      } finally {
        if (!cancelled) setAuthChecked(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!authChecked && isApiConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] text-sm text-gray-600">
        Carregando…
      </div>
    )
  }

  if (screen === 'login') {
    return (
      <Login
        onLogin={(name) => {
          localStorage.setItem(STORAGE_KEY, name)
          setUserName(name)
          setScreen('board')
        }}
        onGoCadastro={() => setScreen('cadastro')}
      />
    )
  }

  if (screen === 'cadastro') {
    return (
      <Cadastro
        onCadastro={(name) => {
          localStorage.setItem(STORAGE_KEY, name)
          setUserName(name)
          setScreen('board')
        }}
        onGoLogin={() => setScreen('login')}
      />
    )
  }

  return (
    <Home
      userName={userName ?? undefined}
      onLogout={() => {
        clearStoredToken()
        localStorage.removeItem(STORAGE_KEY)
        setSessionUserId(null)
        setUserName(null)
        setScreen('login')
      }}
    />
  )
}
