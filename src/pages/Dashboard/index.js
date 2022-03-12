import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ethers, ContractFactory } from 'ethers'
import { TYPE } from 'theme'
import { Box } from 'rebass/styled-components'
import { withTheme } from 'styled-components'
import { Switch } from 'theme-ui'

import { AutoRow, RowBetween } from 'components/Row'
import Card from 'components/Card'
import { ButtonPrimary } from 'components/Button'
import { useNetworkState } from 'store/network/state'
import { SimpleInput, FormInputRow } from 'components/Forms/inputs'
import SimpleLoader from 'components/SimpleLoader'
import TransactionDetails from 'components/Transaction/TransactionDetails'
import { getProvider } from 'constants/provider'
import StandardERC20 from '../../truffle/build/contracts/StandardERC20.json'
import PausableERC20 from '../../truffle/build/contracts/PausableERC20.json'
import BurnableERC20 from '../../truffle/build/contracts/BurnableERC20.json'
import BurnablePausableERC20 from '../../truffle/build/contracts/BurnablePausableERC20.json'
import MintableERC20 from '../../truffle/build/contracts/MintableERC20.json'
import MintablePausableERC20 from '../../truffle/build/contracts/MintablePausableERC20.json'
import { useApplicationState } from 'store/application/state'
import { useLocalState } from 'store/local/state'
import { TRANSACTION_DETAILS } from 'store/application/types'
import { parseENSAddress } from 'utils/parseENSAddress'

const provider = getProvider()

const flexContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: '15px',
}

const flexItem = { flex: '1 1 auto' }

const Dashboard = ({ theme }) => {
  const [contractForm, setContractForm] = useState({
    name: '',
    symbol: '',
    totalSupply: 100000000,
    mintable: false,
    burnable: false,
    pausable: false,
  })
  const { t } = useTranslation()
  const { selectedNetwork } = useNetworkState()
  const { openPopup } = useApplicationState()
  const { addDeployedToken } = useLocalState()

  function setFormField(field, newValue) {
    setContractForm(current => {
      return {
        ...current,
        [field]: newValue,
      }
    })
  }

  const switchContractFactory = ({ mintable, burnable, pausable }) => {
    if (burnable && pausable) return BurnablePausableERC20
    if (burnable) return BurnableERC20
    if (mintable && pausable) return MintablePausableERC20
    if (mintable) return MintableERC20
    if (pausable) return PausableERC20
    return StandardERC20
  }

  const showNotification = ({ content }) => {
    openPopup(TRANSACTION_DETAILS, () => <Box>{content}</Box>)
  }

  const handleDeployToken = async () => {
    showNotification({
      content: (
        <center>
          <h3>Waiting MetaMask confirmation</h3>
          <SimpleLoader />
        </center>
      ),
    })

    try {
      const signer = provider.getSigner()
      const address = await signer.getAddress()

      if (address) {
        const contractData = switchContractFactory(contractForm)
        const factory = new ContractFactory(
          contractData.abi,
          contractData.bytecode,
          signer,
        )
        const formattedSupply = ethers.utils.parseEther(
          Number(contractForm.totalSupply).toString(),
        )

        addDeployedToken({
          address: 'contract.address',
          hash: 'contract.hash',
          name: contractForm.name,
          symbol: contractForm.symbol,
          totalSupply: formattedSupply.toString(),
          mintable: contractForm.mintable,
          burnable: contractForm.burnable,
          pausable: contractForm.pausable,
          abi: contractData.abi,
          bytecode: contractData.bytecode,
        })

        const contract = await factory.deploy(
          contractForm.name,
          contractForm.symbol,
          formattedSupply,
        )

        addDeployedToken({
          address: contract.address,
          hash: contract.hash,
          name: contractForm.name,
          symbol: contractForm.symbol,
          totalSupply: formattedSupply,
          mintable: contractForm.mintable,
          burnable: contractForm.burnable,
          pausable: contractForm.pausable,
          abi: contractData.abi,
          bytecode: contractData.bytecode,
        })

        showNotification({
          content: (
            <center>
              <h3>Deploying contract to {selectedNetwork}</h3>
              <SimpleLoader />
            </center>
          ),
        })

        await contract.deployed()

        showNotification({
          content: (
            <TransactionDetails
              action="Contract deployed"
              address={address}
              addressAction={t('fromAddress', {
                address: parseENSAddress(address),
              })}
              hash={contract.deployTransaction.hash}
            />
          ),
        })
      }
    } catch (err) {
      showNotification({
        content: (
          <center>
            <h3>An error occurred</h3>
            <p>{err?.message}</p>
          </center>
        ),
      })
    }
  }

  const mintOrBurnSupport = contractForm.mintable || contractForm.burnable
  const switchStyles = {
    'input:checked ~ &': {
      backgroundColor: theme.primary1,
    },
  }

  const isInvalid = contractForm.name === '' || contractForm.symbol === ''

  return (
    <Card>
      <Box mb="3">
        <AutoRow>
          <TYPE.largeHeader>{t('Doric Token Builder')}</TYPE.largeHeader>
        </AutoRow>
      </Box>

      <Box mb="3">
        <AutoRow>
          <TYPE.blue>
            {t(
              'Choose the options to customize your token and get it ready to deploy!',
            )}
          </TYPE.blue>
        </AutoRow>
      </Box>

      <div style={flexContainer}>
        <div style={flexItem}>
          <FormInputRow>
            <TYPE.label>Token Name</TYPE.label>
            <SimpleInput
              onChange={e => setFormField('name', e.target.value)}
              value={contractForm.name}
              type="text"
              placeholder={t(`My Token Name`)}
              margin="15px 0px"
            />
            <TYPE.italic>A name for your token.</TYPE.italic>
          </FormInputRow>
        </div>
        <div style={flexItem}>
          <FormInputRow>
            <TYPE.label>Token Symbol</TYPE.label>
            <SimpleInput
              onChange={e => setFormField('symbol', e.target.value)}
              value={contractForm.symbol}
              type="text"
              placeholder={t(`SYMBOL`)}
              margin="15px 0px"
            />
            <TYPE.italic>Symbol for your token, alphanumeric only.</TYPE.italic>
          </FormInputRow>
        </div>
      </div>
      <div>
        <div style={flexContainer}>
          <div style={flexItem}>
            <FormInputRow>
              <TYPE.label>Initial Supply</TYPE.label>
              <SimpleInput
                onChange={e => setFormField('totalSupply', e.target.value)}
                value={contractForm.totalSupply}
                type="text"
                placeholder={t(`Initial Supply`)}
                margin="15px 0px"
              />
              <TYPE.italic>
                Starting number of supply of your token, will be placed in your
                wallet.
              </TYPE.italic>
            </FormInputRow>
          </div>
        </div>
      </div>
      <div>
        <div style={flexContainer}>
          <div style={flexItem}>
            <FormInputRow>
              <TYPE.label>Basic DRC-20 features</TYPE.label>
              <Switch checked onChange={() => {}} sx={switchStyles} />
            </FormInputRow>
            <FormInputRow>
              <TYPE.label>Unlimited mint support</TYPE.label>
              <Switch
                checked={mintOrBurnSupport}
                onChange={e => setFormField('mintable', e.target.checked)}
                sx={switchStyles}
              />
            </FormInputRow>
            <FormInputRow>
              <TYPE.label>Burn token support</TYPE.label>
              <Switch
                checked={contractForm.burnable}
                onChange={e => setFormField('burnable', e.target.checked)}
                sx={switchStyles}
              />
            </FormInputRow>
            <FormInputRow>
              <TYPE.label>Pausable support</TYPE.label>
              <Switch
                checked={contractForm.pausable}
                onChange={e => setFormField('pausable', e.target.checked)}
                sx={switchStyles}
              />
            </FormInputRow>
          </div>
        </div>
      </div>
      <RowBetween>
        <ButtonPrimary
          padding="2"
          data-cy="createTokenBtn"
          onClick={isInvalid ? () => {} : handleDeployToken}
          disabled={isInvalid}
        >
          <TYPE.primaryContrast ml="10px">
            {t(`Deploy token to ${selectedNetwork}`)}
          </TYPE.primaryContrast>
        </ButtonPrimary>
      </RowBetween>
    </Card>
  )
}

export default withTheme(Dashboard)
