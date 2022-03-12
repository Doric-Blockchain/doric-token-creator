import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  getTokensByAddressURL,
  getTokensByAddress,
  getTransactionsByAddressURL,
  getTransactionsByAddress,
} from 'constants/explorer'
import { useNetworkState } from 'store/network/state'

const useAddressTransactions = ({ address, onChange }) => {
  const { selectedNetwork } = useNetworkState()

  const [result, setResult] = useState([])
  const { data: transactions } = useSWR(
    getTransactionsByAddressURL(address),
    async () => {
      const fetchedTXs = await getTransactionsByAddress(
        address,
        selectedNetwork,
      )
      return fetchedTXs
    },
  )

  const { data: tokens } = useSWR(getTokensByAddressURL(address), async () => {
    const fetchedTXs = await getTokensByAddress(address, selectedNetwork)
    return fetchedTXs
  })

  useEffect(() => {
    if (tokens?.result && transactions?.result) {
      const filteredTransactions = transactions.result.filter(item => {
        const tokenFound = tokens.result.find(({ hash }) => hash)

        if (!tokenFound) return true

        return tokenFound !== item.hash
      })

      setResult(
        [].concat(filteredTransactions, tokens.result).sort(function(a, b) {
          return b.timeStamp - a.timeStamp
        }),
      )
    }
  }, [tokens, transactions])

  useEffect(() => {
    if (typeof onChange === 'function') onChange({ transactions: result })
    // eslint-disable-next-line
  }, [result])

  return { transactions: result }
}

export default useAddressTransactions
