import { useEffect, useState } from 'react'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Login from './pages/Login'

type Screen = 'login' | 'cadastro' | 'board'

const STORAGE_KEY = 'kanflow_user'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setUserName(saved)
      setScreen('board')
    }
  }, [])

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
        localStorage.removeItem(STORAGE_KEY)
        setUserName(null)
        setScreen('login')
      }}
    />
  )
}

