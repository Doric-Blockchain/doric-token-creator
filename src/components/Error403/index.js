import { ButtonPrimary } from 'components/Button'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useAccountState } from 'store/account/state'
import { TYPE } from 'theme'

const Box = styled.div`
  color: ${({ theme }) => theme.text1};
  padding: 50px;
  text-align: center;
`

const Description = styled.div`
  color: ${({ theme }) => theme.text1};
  padding: 15px;
`

const Error403 = () => {
  const history = useHistory()
  const { isLoading } = useAccountState()

  return (
    <Box>
      {!isLoading && (
        <>
          <TYPE.mediumHeader>Error 403 - Limited Access</TYPE.mediumHeader>
          <Description>Connect your wallet to have full access.</Description>
          <ButtonPrimary onClick={() => history.push('/welcome')}>
            Go back to home
          </ButtonPrimary>
        </>
      )}
    </Box>
  )
}

export default Error403
