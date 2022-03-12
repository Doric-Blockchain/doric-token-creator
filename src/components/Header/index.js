import React from 'react'
import useScrollPosition from '@react-hook/window-scroll'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Moon, Sun } from 'react-feather'
import { darken } from 'polished'
import { ExternalLink } from '../../theme'
import Row, { RowFixed } from '../Row'
import { useLocalState } from 'store/local/state'
import DoricLogo from 'components/DoricLogo'
import { Web3StatusConnected } from 'components/Web3Status'
import { ACCOUNT_DETAILS } from 'store/application/types'
import { useApplicationState } from 'store/application/state'
import { useNetworkState } from 'store/network/state'
import { useAccountState } from 'store/account/state'
import AccountDetails from 'components/AccountDetails'
import { parseENSAddress } from 'utils/parseENSAddress'
import { ButtonOutlined } from 'components/Button'
import { Clock, Grid } from 'react-feather'
import { HideSmall, SmallOnly } from '../../theme'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) =>
    `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) =>
    showBackground ? '0 -100%' : '0 0'};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px
    ${({ theme, showBackground }) =>
      showBackground ? theme.bg2 : 'transparent;'};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 48px 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:  1rem;
    grid-template-columns: 36px 1fr;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top: 20px;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
  
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  position: relative;

  .mobile {
    display: none;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;

    .larger {
      display: none !important;
    }

    .mobile {
      display: block;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    top: -25px;
  `};
`

const HeaderLinks = styled(Row)`
  justify-self: center;
  background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: center;
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    bottom: 0; 
    right: 50%;
    transform: translate(50%,-50%);
    margin: 0 auto;
    background-color: ${({ theme }) => theme.bg0};
    border: 1px solid ${({ theme }) => theme.bg2};
    box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
`

const AccountElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg2)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const BuyDoricElement = styled.div`
  display: flex;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};

  :hover {
    cursor: pointer;
  }
`
const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  padding: 8px 12px;
  word-break: break-word;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg3};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const StyledMenuButton = styled(ExternalLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
    text-decoration: none;
  }
`

function Header() {
  const { isDarkMode, toggleDarkMode } = useLocalState()
  const { openPopup, closePopup } = useApplicationState()
  const { selectedNetwork, toggleNetwork } = useNetworkState()
  const { isLogged, address, balance } = useAccountState()

  const scrollY = useScrollPosition()

  const parseBalance = value => {
    if (value === 0) return '0.0'

    const [int, decimals] = value.split('.')
    return `${int}.${decimals.slice(0, 6)}`
  }

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <HeaderRow>
        <Title href=".">
          <DoricLogo width="80px" className="mobile" />
          <DoricLogo width="125px" className="larger" />
        </Title>
      </HeaderRow>
      {isLogged && (
        <HeaderLinks isDarkMode={isDarkMode}>
          <StyledNavLink id={`create-nav-link`} to={'/'} exact>
            <HideSmall>Create new token</HideSmall>

            <SmallOnly>
              <Grid />
            </SmallOnly>
          </StyledNavLink>

          <StyledNavLink id={`history-nav-link`} to={'/history'}>
            <HideSmall>History</HideSmall>
            <SmallOnly>
              <Clock />
            </SmallOnly>
          </StyledNavLink>
        </HeaderLinks>
      )}
      <HeaderControls>
        <HeaderElement>
          <BuyDoricElement>
            <ButtonOutlined onClick={toggleNetwork}>
              DRC: {selectedNetwork}
            </ButtonOutlined>
          </BuyDoricElement>
          {isLogged && (
            <AccountElement
              className="account"
              active
              style={{ pointerEvents: 'auto' }}
              onClick={() =>
                openPopup(ACCOUNT_DETAILS, () => (
                  <AccountDetails
                    toggleWalletModal={() => closePopup(ACCOUNT_DETAILS)}
                  />
                ))
              }
            >
              <BalanceText
                style={{ flexShrink: 0 }}
                pl="0.75rem"
                pr="0.5rem"
                fontWeight={500}
              >
                {parseBalance(balance)} DRC
              </BalanceText>
              <Web3StatusConnected id="web3-status-connected">
                <Text>{parseENSAddress(address)}</Text>
              </Web3StatusConnected>
            </AccountElement>
          )}
        </HeaderElement>

        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}

export default Header
