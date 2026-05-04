/** ID do usuário logado (para comentários: `autorId`). Vem do GET /auth/me. */
const USER_ID_KEY = 'kanflow_user_id'

export function setSessionUserId(id: string | null) {
  if (id) sessionStorage.setItem(USER_ID_KEY, id)
  else sessionStorage.removeItem(USER_ID_KEY)
}

export function getSessionUserId(): string | null {
  return sessionStorage.getItem(USER_ID_KEY)
}
