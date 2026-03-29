const KEY = 'sv_guest_token'

export function getGuestToken(): string {
  if (typeof window === 'undefined') return ''
  let token = localStorage.getItem(KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(KEY, token)
  }
  return token
}
