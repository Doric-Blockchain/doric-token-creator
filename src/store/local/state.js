import { createState, useState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'

const localState = createState({
  themeDarkMode: false,
  deployedTokens: [],
})

export function useLocalState() {
  const state = useState(localState)
  state.attach(Persistence('localState'))

  return {
    get isDarkMode() {
      return state.themeDarkMode.get()
    },
    toggleDarkMode() {
      state.themeDarkMode.set(isDarkMode => !isDarkMode)
    },
    deployedTokens(selectedNetwork) {
      return state.deployedTokens
        .get()
        .filter(({ network }) => network === selectedNetwork)
    },
    addDeployedToken(token) {
      state.deployedTokens.set(deployedTokens => {
        return deployedTokens ? [...deployedTokens, token] : [token]
      })
    },
    removeContractHistory(address) {
      state.deployedTokens.set(deployedTokens => {
        return deployedTokens.filter(token => token.address !== address)
      })
    },
  }
}
