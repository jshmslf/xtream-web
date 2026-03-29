// Deterministic gradient based on name so it's always the same color per user
const GRADIENTS = [
  ['#E24B4A', '#c43b3a'],
  ['#378ADD', '#185FA5'],
  ['#1D9E75', '#0F6E56'],
  ['#EF9F27', '#BA7517'],
  ['#D4537E', '#993556'],
  ['#7F77DD', '#534AB7'],
  ['#D85A30', '#993C1D'],
  ['#639922', '#3B6D11'],
]

export function getInitials(firstName: string, lastName?: string | null): string {
  const first = firstName.charAt(0).toUpperCase()
  const last  = lastName?.charAt(0).toUpperCase() ?? ''
  return last ? `${first}${last}` : first
}

export function getAvatarGradient(firstName: string): [string, string] {
  const index = firstName.charCodeAt(0) % GRADIENTS.length
  return GRADIENTS[index] as [string, string]
}