import React from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import { ExternalLink as LinkIcon } from 'react-feather'

import CopyText from '../CopyText'
import { ExternalLink, TYPE } from '../../theme'
import { parseENSAddress } from 'utils/parseENSAddress'
import { useAccountState } from 'store/account/state'
import { useNetworkState } from 'store/network/state'
import { getExplorerBaseUrl } from 'constants/explorer'
import { parseBalance } from 'utils/balance'

const Content = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props =>
    props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit'};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: center;
  align-items: flex-start;
  font-weight: 400;
  flex-direction: column;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 0rem 1rem;
  ${({ theme }) =>
    theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;
  flex-flow: row wrap;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column !important;
    white-space: nowrap;
    gap: 15px;
  `};
`

const AddressLink = styled(ExternalLink)`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: block;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

function AccountDetails() {
  const { address, balance } = useAccountState()
  const { selectedNetwork } = useNetworkState()

  return (
    <Content>
      <UpperSection>
        <HeaderRow>
          <TYPE.largeHeader>
            <Trans>Account</Trans>
          </TYPE.largeHeader>
        </HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                Connected to MetaMask <b>{parseENSAddress(address)}</b>
              </AccountGroupingRow>
              <AccountGroupingRow>
                Balance: <b>{parseBalance(balance)}</b>
              </AccountGroupingRow>
              <AccountGroupingRow>
                <>
                  <AccountControl>
                    <CopyText toCopy={address}>
                      <span style={{ marginLeft: '4px' }}>
                        <Trans>Copy Address</Trans>
                      </span>
                    </CopyText>

                    <AddressLink href={getExplorerBaseUrl(selectedNetwork)}>
                      <LinkIcon size={16} />
                      <span style={{ marginLeft: '4px' }}>
                        <Trans>View on Explorer</Trans>
                      </span>
                    </AddressLink>
                  </AccountControl>
                </>
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
    </Content>
  )
}

export default AccountDetails
