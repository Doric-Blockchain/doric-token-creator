import React, { Suspense, useEffect } from 'react'
import { HashRouter as Router, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import Header from 'components/Header'
import ModalProvider from 'components/ModalProvider'
import SimpleLoader from 'components/SimpleLoader'
import { AutoColumn } from 'components/Column'
import { routes } from './routes'
import ProtectedRoute from 'components/ProtectedRoute'
import { useAccountState } from 'store/account/state'
import { useApplicationState } from 'store/application/state'
import { LOADING_DETAILS } from 'store/application/types'
import {
  getProvider,
  metamaskParams,
  CHAIN_ID,
  isDoricNetworkChainId,
} from 'constants/provider'

const provider = getProvider()

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5rem 1rem;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 5rem 1rem;
  `};
`

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;
  justify-items: center;
  padding: ${({ padding }) => padding};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`

function App() {
  const {
    isLogged,
    setLogged,
    address,
    setAddress,
    setBalance,
    startLoading,
    stopLoading,
  } = useAccountState()
  const { openPopup } = useApplicationState()

  async function updateBalance() {
    const newBalance = await provider.getBalance(address)
    setBalance(ethers.utils.formatEther(newBalance))
  }

  useEffect(() => {
    if (address && isLogged) {
      updateBalance()

      provider.on('block', () => {
        updateBalance()
      })
    }
  }, [address, isLogged])

  const showNotification = ({ content }) => {
    openPopup(LOADING_DETAILS, () => <div>{content}</div>)
  }

  async function setSigner() {
    const signer = provider.getSigner()
    const newAddress = await signer.getAddress()
    if (newAddress) {
      setAddress(newAddress)
      setLogged(true)
      stopLoading()
    }
  }

  function noMetaMask() {
    showNotification({
      content: (
        <center>
          <h4>No MetaMask detected</h4>
          <p>Please install MetaMask wallet</p>
          <h5>How to install MetaMask on your device?</h5>
          <a href="https://metamask.io/download.html" target="_blank">
            https://metamask.io/download.html
          </a>
        </center>
      ),
    })
  }

  async function requestMetaMask() {
    const { ethereum } = window
    if (ethereum) {
      try {
        await ethereum.enable()

        const currentChainId = await provider.send('eth_chainId')
        if (!isDoricNetworkChainId(currentChainId)) {
          showNotification({
            content: (
              <center>
                <h4>Wrong network detected</h4>
                <p>Please switch to the Doric network</p>
                <SimpleLoader />
              </center>
            ),
          })
        }

        await provider.send('eth_requestAccounts', [])
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: metamaskParams,
        })

        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID }],
        })

        ethereum.on('accountsChanged', () => {
          window.location.reload()
        })

        setSigner()
      } catch (error) {
        showNotification({
          content: (
            <center>
              <h4>Waiting MetaMask connection...</h4>
              <SimpleLoader />
            </center>
          ),
        })
      }
    } else {
      noMetaMask()
    }
  }

  useEffect(() => {
    startLoading()

    async function start() {
      if (provider) {
        provider.on('network', (newNetwork, oldNetwork) => {
          requestMetaMask()

          if (oldNetwork) window.location.reload()
        })
      } else {
        noMetaMask()
      }
    }

    start()
    // eslint-disable-next-line
  }, [])

  return (
    <Suspense fallback={null}>
      <Router>
        <AppWrapper>
          <ModalProvider />
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper gap="lg" justify="center">
            <PageWrapper>
              <Switch>
                {routes.map(({ path, component, authRequired, exact }) => {
                  return (
                    <ProtectedRoute
                      key={path}
                      path={path}
                      component={component}
                      authRequired={authRequired}
                      exact={exact}
                    />
                  )
                })}
              </Switch>
            </PageWrapper>
          </BodyWrapper>
        </AppWrapper>
      </Router>
    </Suspense>
  )
}

export default App
