export const parseBalance = value => {
  if (!value || value === 0) return '0.0'

  const [int, decimals] = value.split('.')
  return `${int}.${decimals.slice(0, 6)}`
}
