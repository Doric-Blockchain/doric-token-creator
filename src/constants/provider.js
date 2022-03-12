import { ethers } from 'ethers'

export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum, 'any')
  }
}

export const CHAIN_ID = '0x102D' // Hex of 4141
export const CHAIN_ID_TESTNET = '0x102D' // Hex of 4141
export const nativeCurrency = {
  name: 'Doric',
  symbol: 'DRC',
  decimals: 18,
}

export const getMetaMaskParams = selectedNetwork => {
  if (selectedNetwork === 'mainnet') {
    return [
      {
        chainId: CHAIN_ID,
        chainName: 'DRC: Mainnet',
        rpcUrls: ['https://mainnet.doric.network'],
        nativeCurrency,
      },
    ]
  }

  return [
    {
      chainId: CHAIN_ID_TESTNET,
      chainName: 'DRC: Testnet',
      rpcUrls: ['https://testnet.doric.network'],
      nativeCurrency,
    },
  ]
}

export const isDoricNetworkChainId = checkChainId => {
  return checkChainId?.toUpperCase() === CHAIN_ID.toUpperCase()
}
