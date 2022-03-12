import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ethers, ContractFactory } from 'ethers'
import { TYPE } from 'theme'
import { Box } from 'rebass/styled-components'
import { withTheme } from 'styled-components'

import { AutoRow, RowBetween } from 'components/Row'
import Card from 'components/Card'
import { ButtonPrimary } from 'components/Button'
import { useNetworkState } from 'store/network/state'
import { SimpleInput, FormInputRow } from 'components/Forms/inputs'
import { provider } from 'constants/provider'
import StandardERC20 from '../../truffle/build/contracts/StandardERC20.json'
import PausableERC20 from '../../truffle/build/contracts/PausableERC20.json'
import BurnableERC20 from '../../truffle/build/contracts/BurnableERC20.json'
import BurnablePausableERC20 from '../../truffle/build/contracts/BurnablePausableERC20.json'
import MintableERC20 from '../../truffle/build/contracts/MintableERC20.json'
import MintablePausableERC20 from '../../truffle/build/contracts/MintablePausableERC20.json'
import { Switch } from 'theme-ui'

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

  const handleDeployToken = async () => {
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    if (address) {
      const contractData = switchContractFactory(contractForm)
      console.log({ contractData })
      const factory = new ContractFactory(
        contractData.abi,
        contractData.bytecode,
        signer,
      )

      const finalSupply = ethers.utils.parseEther(
        Number(contractForm.totalSupply).toString(),
      )

      const contract = await factory.deploy(
        contractForm.name,
        contractForm.symbol,
        finalSupply,
      )
      console.log({ contract })
      console.log(contract.address)
      console.log(contract.deployTransaction.hash)
      await contract.deployed()
    }
  }

  const mintOrBurnSupport = contractForm.mintable || contractForm.burnable
  const switchStyles = {
    'input:checked ~ &': {
      backgroundColor: theme.primary1,
    },
  }

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
              <Switch checked sx={switchStyles} />
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
          onClick={handleDeployToken}
        >
          <TYPE.white ml="10px">
            {t(`Deploy token to ${selectedNetwork}`)}
          </TYPE.white>
        </ButtonPrimary>
      </RowBetween>
    </Card>
  )
}

export default withTheme(Dashboard)
