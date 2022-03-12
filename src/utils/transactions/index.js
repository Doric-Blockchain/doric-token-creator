import { ethers, BigNumber } from 'ethers'

export function getContractCallInfo(transaction) {
  const { fromLinks = [], toLinks = [] } = transaction || {}

  let isContractCall = false
  let contractAddress

  const joined = [...fromLinks, ...toLinks]

  if (joined.length > 0) {
    const filtered = joined.find(({ rel }) => rel === 'contract')
    contractAddress = filtered?.display
    isContractCall = filtered?.rel === 'contract'
  }

  return {
    isContractCall,
    contractAddress,
  }
}

export function formatBigNumber(value) {
  if (value)
    return ethers.utils.formatUnits(BigNumber.from(`${value}`), value.length)
}

export function getTxParams(transaction) {
  if (transaction?.functionMeta?.params?.length > 0)
    return transaction.functionMeta.params
  if (transaction?.parameters?.length > 0) return transaction.parameters
  return []
}

export function displayAmount(parameters, defaultValue = '') {
  if (parameters) {
    const _valueParam = parameters.find(
      ({ name }) => name === '_value' || name === 'value',
    )
    if (_valueParam?.value) return formatBigNumber(_valueParam.value)
  }

  return defaultValue
}

export function displayToAddress(transaction) {
  if (transaction.address === transaction.to) return transaction.from

  return transaction?.to
}

export function displayAction(transaction) {
  const action = transaction.contractAddress ? 'Contract Call' : 'Transfer'

  let append =
    transaction.address === transaction.to ? ': deposit' : ': withdrawn'

  return `${action}${append}`
}
