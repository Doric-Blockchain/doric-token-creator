import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useApplicationState } from 'store/application/state'
import { parseENSAddress } from 'utils/parseENSAddress'
import DepositIcon from '../SVG/Deposit'
import WithdrawnIcon from '../SVG/Withdrawn'
import {
  TransactionDisplay,
  Date,
  ActionIcon,
  ActionDetails,
  ActionInfo,
  ArrowIcon,
} from './styles'
import TransactionDetails from './TransactionDetails'
import { TRANSACTION_DETAILS } from 'store/application/types'
import { HideSmall, TYPE } from '../../theme'
import {
  getTxParams,
  displayAction,
  displayToAddress,
  displayAmount,
  getContractCallInfo,
  formatBigNumber,
} from '../../utils/transactions'

const Transaction = ({ transaction, address, simpleLayout }) => {
  const { t } = useTranslation()
  const { openPopup } = useApplicationState()

  const isDirectionIn = address === transaction.to ? true : false
  const parameters = getTxParams(transaction)
  const { isContractCall, contractAddress } = getContractCallInfo(transaction)
  const txAction = displayAction({ ...transaction, address }, contractAddress)
  const txToAddress = displayToAddress({ ...transaction, address })
  const addressAction = t(isDirectionIn ? 'fromAddress' : 'toAddress', {
    address: parseENSAddress(txToAddress),
  })
  const parsedAddress = parseENSAddress(contractAddress)

  return (
    <TransactionDisplay
      simpleLayout={simpleLayout}
      onClick={() =>
        openPopup(TRANSACTION_DETAILS, () => (
          <TransactionDetails
            address={txToAddress}
            action={txAction}
            addressAction={addressAction}
            isContractCall={isContractCall}
            contractAddress={parsedAddress}
            hash={transaction.hash}
          />
        ))
      }
    >
      <Date simpleLayout={simpleLayout}>
        <span>
          {moment.unix(parseInt(transaction?.timeStamp)).format('MMM/yy')}
        </span>
        <span className="day">
          {moment.unix(parseInt(transaction?.timeStamp)).format('D')}
        </span>
      </Date>

      <HideSmall>
        <ActionIcon simpleLayout={simpleLayout}>
          {isDirectionIn ? <DepositIcon /> : <WithdrawnIcon />}
        </ActionIcon>
      </HideSmall>

      <ActionDetails simpleLayout={simpleLayout}>
        <span className="token-detail">{txAction}</span>

        <span className="address">
          {isContractCall && (
            <div>
              {t('interactedToAddress', {
                address: parsedAddress,
              })}
            </div>
          )}
          {addressAction}
        </span>
      </ActionDetails>

      <ActionInfo>
        <TYPE.subHeader style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {`${isDirectionIn ? '' : '-'}${displayAmount(
            parameters,
            formatBigNumber(transaction.value),
          )} ${transaction.tokenName ?? 'Doric'}`}
        </TYPE.subHeader>

        <div style={{ padding: '0px 10px' }}>
          <ArrowIcon />
        </div>
      </ActionInfo>
    </TransactionDisplay>
  )
}

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  simpleLayout: PropTypes.bool,
}

Transaction.defaultProps = {
  simpleLayout: false,
}

export default Transaction
