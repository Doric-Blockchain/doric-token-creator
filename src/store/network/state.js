import { createState, useState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'

const initialState = createState({
  selectedNetwork: 'mainnet',
})

export function useNetworkState() {
  const state = useState(initialState)
  state.attach(Persistence('networkState'))

  return {
    get selectedNetwork() {
      return state.selectedNetwork.get()
    },
    toggleNetwork() {
      state.selectedNetwork.set(selectedNetwork =>
        selectedNetwork === 'testnet' ? 'mainnet' : 'testnet',
      )
      window.location.reload()
    },
  }
}
