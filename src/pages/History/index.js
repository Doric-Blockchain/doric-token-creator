import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import fileDownload from 'js-file-download'
import { AutoColumn } from 'components/Column'
import { ShadowCard } from 'components/Card'
import { SimpleGrid } from 'pages/Template/styles'
import { useNetworkState } from 'store/network/state'
import { useLocalState } from 'store/local/state'
import { TYPE } from 'theme'
import { getExplorerAddressURL } from 'constants/explorer'
import { parseENSAddress } from 'utils/parseENSAddress'

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

  th {
    text-align: left;
  }

  td > span {
    font-size: 11px;
    padding: 3px;
    background-color: ${({ theme }) => theme.bg4};
    margin-right: 10px;
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
  text-decoration: none;
  color: ${({ theme }) => theme.blue1};
  position: relative;
  font-size: 12px;

  span {
    opacity: 0;
    padding: 0px 5px;
    font-size: 0px;
    position: absolute;
    background-color: ${({ theme }) => theme.bg2};
  }

  &:hover {
    span {
      opacity: 1;
      font-size: 12px;
    }
  }
`

const HistoryPage = () => {
  const { t } = useTranslation()
  const { selectedNetwork } = useNetworkState()
  const { deployedTokens, removeContractHistory } = useLocalState()

  const filteredTokens = deployedTokens(selectedNetwork)

  function handleDownloadAbi(symbol, abi) {
    fileDownload(JSON.stringify(abi), `${symbol}-abi.json`)
  }

  function handleDownloadByteCode(symbol, bytecode) {
    fileDownload(bytecode, `${symbol}-bytecode.txt`)
  }

  return (
    <SimpleGrid>
      <CardSection>
        <ShadowCard>
          <TYPE.largeHeader style={{ padding: '15px' }}>
            {t(`Deployed tokens history`)}
          </TYPE.largeHeader>
          <div style={{ padding: '15px' }}>
            <Table width="100%">
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
                            rel="noreferrer"
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
                          {<span>{t('DRC-20')}</span>}
                          {mintable && <span>{t('Mintable')}</span>}
                          {burnable && <span>{t('Burnable')}</span>}
                          {pausable && <span>{t('Pausable')}</span>}
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
                              <a onClick={() => handleDownloadAbi(symbol, abi)}>
                                ABI
                              </a>
                              <a
                                onClick={() =>
                                  handleDownloadByteCode(symbol, bytecode)
                                }
                              >
                                ByteCode
                              </a>
                            </div>
                            <RemoveButton
                              onClick={() => removeContractHistory(address)}
                            >
                              X<span>Remove</span>
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
