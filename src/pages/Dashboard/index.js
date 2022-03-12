import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { ethers, ContractFactory } from 'ethers'
import { TYPE } from 'theme'
import { Box } from 'rebass/styled-components'

import { AutoRow, RowBetween } from 'components/Row'
import Card from 'components/Card'
import { ButtonPrimary } from 'components/Button'
import { useNetworkState } from 'store/network/state'
import { SimpleInput, FormInputRow } from 'components/Forms/inputs'
import { provider } from 'constants/provider'
import StandardERC20 from '../../truffle/build/contracts/StandardERC20.json'

const flexContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: '15px',
}

const flexItem = { flex: '1 1 auto' }

const Dashboard = () => {
  const [contractForm, setContractForm] = useState({
    name: '',
    symbol: '',
    totalSupply: 100000000,
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

  const handleDeployToken = async () => {
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    if (address) {
      console.log({ StandardERC20 })
      const factory = new ContractFactory(
        StandardERC20.abi,
        StandardERC20.bytecode,
        signer,
      )
      console.log({ contractForm })
      console.log({ factory })

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

export default withRouter(Dashboard)
