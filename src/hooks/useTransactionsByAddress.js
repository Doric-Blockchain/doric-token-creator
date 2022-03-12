import { useQuery } from '@apollo/client'
import { getTransactionsExplorer } from 'constants/explorer'

const useTransactionsByAddress = ({ address }) => {
  const { loading, error, data } = useQuery(getTransactionsExplorer(address))

  if (!loading) {
    const {
      address: {
        transactions: { edges },
      },
    } = data

    return { transactions: edges }
  }

  return { error, data }
}

export default useTransactionsByAddress
