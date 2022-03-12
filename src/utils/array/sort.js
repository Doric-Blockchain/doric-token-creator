export function shuffleArray(array) {
  const shuffed = array

  for (let i = shuffed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffed[i]
    shuffed[i] = shuffed[j]
    shuffed[j] = temp
  }

  return shuffed
}
