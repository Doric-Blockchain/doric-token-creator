import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ethers } from 'ethers'
import fileDownload from 'js-file-download'
import { AutoColumn } from 'components/Column'
import { ShadowCard } from 'components/Card'
import { SimpleGrid } from 'pages/Template/styles'
import { useNetworkState } from 'store/network/state'
import { useLocalState } from 'store/local/state'
import { TYPE } from 'theme'
import { getExplorerTXURL } from 'constants/explorer'

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

  td span {
    font-size: 11px;
    padding: 3px;
    background-color: ${({ theme }) => theme.bg4};
    margin-right: 10px;
    border-radius: 6px;
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

const HistoryPage = () => {
  const { t } = useTranslation()
  const { selectedNetwork } = useNetworkState()
  const { deployedTokens } = useLocalState()

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
                {deployedTokens?.length < 1 && (
                  <tr>
                    <td colSpan="5">{t('No tokens deployed yet.')}</td>
                  </tr>
                )}
                {deployedTokens?.map(
                  ({
                    address,
                    hash,
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
                      <tr key={hash}>
                        <td>{`${name} (${symbol})`}</td>
                        <td>
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={getExplorerTXURL(hash, selectedNetwork)}
                          >
                            {address}
                          </a>
                        </td>
                        <td>
                          {ethers.utils.commify(
                            ethers.utils.formatEther(totalSupply),
                          )}
                        </td>
                        <td>
                          {<span>{t('DRC-20')}</span>}
                          {mintable && <span>{t('Mintable')}</span>}
                          {burnable && <span>{t('Burnable')}</span>}
                          {pausable && <span>{t('Pausable')}</span>}
                        </td>
                        <td>
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
