import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import fileDownload from 'js-file-download'
import { AutoColumn } from 'components/Column'
import { ShadowCard } from 'components/Card'
import { SimpleGrid } from 'pages/Template/styles'
import { useNetworkState } from 'store/network/state'
import { useLocalState } from 'store/local/state'
import { useApplicationState } from 'store/application/state'
import { HISTORY_ACTION_CONFIRMATION } from 'store/application/types'
import { TYPE } from 'theme'
import { getExplorerAddressURL } from 'constants/explorer'
import { parseENSAddress } from 'utils/parseENSAddress'
import { ButtonPrimary, ButtonGray } from 'components/Button'

const CardSection = styled(AutoColumn)`
  grid-template-columns: 1fr;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: auto;
    grid-template-rows: auto;
  `};
`

const Table = styled.table`
  padding: 15px;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 6px;
  width: 100%;

  th,
  td {
    text-align: left;
    padding: 5px;
  }

  td .badge-container {
    display: flex;
    flex-flow: row wrap;
    gap: 8px;
  }

  td .badge {
    display: block;
    font-size: 11px;
    padding: 3px;
    background-color: ${({ theme }) => theme.bg4};
    border-radius: 6px;
    white-space: nowrap;
  }

  td a {
    display: block;
    text-decoration: none;
    color: ${({ theme }) => theme.blue1};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.text1};
    }
  }
`

const RemoveButton = styled.a`
  display: block;
  width: 20px;
  height: 20px;
  text-decoration: none;
  text-align: center;
  line-height: 10px;
  background-color: ${({ theme }) => theme.red1};
  color: ${({ theme }) => `${theme.white} !important`};
  font-size: 12px;
  padding: 5px;
  border-radius: 50%;
`

const HistoryPage = () => {
  const { t } = useTranslation()
  const { selectedNetwork } = useNetworkState()
  const { deployedTokens, removeContractHistory } = useLocalState()
  const { openPopup, closePopup } = useApplicationState()

  const filteredTokens = deployedTokens(selectedNetwork)

  function handleDownloadAbi(symbol, abi) {
    fileDownload(JSON.stringify(abi), `${symbol}-abi.json`)
  }

  function handleDownloadByteCode(symbol, bytecode) {
    fileDownload(bytecode, `${symbol}-bytecode.txt`)
  }

  function handleRemoveConfirmation(address) {
    openPopup(HISTORY_ACTION_CONFIRMATION, () => {
      return (
        <center style={{ paddingTop: '15px' }}>
          <TYPE.largeHeader>
            {t('Are you sure you want to remove this contract from history?')}
          </TYPE.largeHeader>
          <div style={{ display: 'flex', padding: '15px', gap: '15px' }}>
            <ButtonGray onClick={() => closePopup(HISTORY_ACTION_CONFIRMATION)}>
              {t('Cancel')}
            </ButtonGray>
            <ButtonPrimary
              onClick={() => {
                removeContractHistory(address)
                closePopup(HISTORY_ACTION_CONFIRMATION)
              }}
            >
              {t('Remove')}
            </ButtonPrimary>
          </div>
        </center>
      )
    })
  }

  return (
    <SimpleGrid>
      <CardSection>
        <ShadowCard>
          <TYPE.largeHeader style={{ padding: '15px' }}>
            {t(`Deployed tokens history`)}
          </TYPE.largeHeader>
          <div style={{ padding: '15px', width: '100%', overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <th>{t('Token')}</th>
                  <th>{t('Address')}</th>
                  <th>{t('Total Supply')}</th>
                  <th>{t('Contract features')}</th>
                  <th>{t('Download')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens?.length < 1 && (
                  <tr>
                    <td colSpan="5" align="center">
                      {t('No tokens deployed yet...')}
                    </td>
                  </tr>
                )}
                {filteredTokens?.map(
                  ({
                    address,
                    name,
                    symbol,
                    totalSupply,
                    mintable,
                    burnable,
                    pausable,
                    abi,
                    bytecode,
                  }) => {
                    return (
                      <tr key={address}>
                        <td>{`${name} (${symbol})`}</td>
                        <td>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={getExplorerAddressURL(
                              address,
                              selectedNetwork,
                            )}
                          >
                            {parseENSAddress(address)}
                          </a>
                        </td>
                        <td>{totalSupply?.toUpperCase && totalSupply}</td>
                        <td>
                          <div className="badge-container">
                            {<div className="badge">{t('DRC-20')}</div>}
                            {mintable && (
                              <div className="badge">{t('Mintable')}</div>
                            )}
                            {burnable && (
                              <div className="badge">{t('Burnable')}</div>
                            )}
                            {pausable && (
                              <div className="badge">{t('Pausable')}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px',
                            }}
                          >
                            <div>
                              <a
                                onClick={() => handleDownloadAbi(symbol, abi)}
                                href="#download-abi"
                              >
                                ABI
                              </a>
                              <a
                                onClick={() =>
                                  handleDownloadByteCode(symbol, bytecode)
                                }
                                href="#download-bytecode"
                              >
                                ByteCode
                              </a>
                            </div>
                            <RemoveButton
                              onClick={() => handleRemoveConfirmation(address)}
                              title={t('Remove from history')}
                            >
                              X
                            </RemoveButton>
                          </div>
                        </td>
                      </tr>
                    )
                  },
                )}
              </tbody>
            </Table>
          </div>
        </ShadowCard>
      </CardSection>
    </SimpleGrid>
  )
}

export default HistoryPage
