import axios from 'axios'
import { transactionByAddress } from 'constants/queries'

const EXPLORER_TESTNET_BASE_URL = 'https://testnetexplorer.doric.network'
const EXPLORER_MAINNET_BASE_URL = 'https://explorer.doric.network'

export const getExplorerBaseUrl = selectedNetwork => {
  if (selectedNetwork === 'mainnet') return EXPLORER_MAINNET_BASE_URL

  return EXPLORER_TESTNET_BASE_URL
}

export function getTransactionsExplorer(address) {
  const response = transactionByAddress(address)
  return response
}

export function getExplorerAddressURL(address, selectedNetwork) {
  return `${getExplorerBaseUrl(selectedNetwork)}/address/${address}`
}

export function getExplorerTXURL(hash, selectedNetwork) {
  return `${getExplorerBaseUrl(selectedNetwork)}/tx/${hash}`
}

export function getTransactionsByAddressURL(address, selectedNetwork) {
  const url = `${getExplorerBaseUrl(
    selectedNetwork,
  )}/api?module=account&action=txlist&address=${address}`
  return url
}

export function getTokensByAddressURL(address, selectedNetwork) {
  const url = `${getExplorerBaseUrl(
    selectedNetwork,
  )}/api?module=account&action=tokentx&address=${address}`
  return url
}

export async function getTransactionsByAddress(address, selectedNetwork) {
  const { data } = await axios.get(
    getTransactionsByAddressURL(address, selectedNetwork),
  )
  return data
}

export async function getTokensByAddress(address, selectedNetwork) {
  const { data } = await axios.get(
    getTokensByAddressURL(address, selectedNetwork),
  )
  return data
}
