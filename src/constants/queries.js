import { gql } from '@apollo/client'

export const transactionByAddress = address => {
  return gql`
    {
      address(hash: "${address}") {
        transactions(count: 10, last: 10) {
          edges {
            node {
              status
              hash
              value
              fromAddressHash
              gas
              toAddressHash
            }
          }
        }
      }
    }
  `
}
