import { ShadowCard } from 'components/Card'
import PageTitle from 'components/Titles/Page'
import TokensList from 'components/TokensList'
import { SimpleGrid } from 'pages/Template/styles'
import React from 'react'
import { Card } from 'rebass'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const LeftCard = styled(Card)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-between;

  * {
    color: ${({ theme }) => theme.text1};
    text-decoration: none !important;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   padding: 1rem;
  `};
`

const Tokens = () => {
  const { t } = useTranslation()

  return (
    <ShadowCard>
      <LeftCard>
        <SimpleGrid>
          <PageTitle>{t(`Holdings`)}</PageTitle>

          <TokensList />
        </SimpleGrid>
      </LeftCard>
    </ShadowCard>
  )
}

export default Tokens
