import React from 'react'
import styled from 'styled-components'
import { newModule } from 'hooks/local-adapters'
import { feeAdapter, apyAdapter } from 'resources/templates'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const TemplateSection = styled.div`
  display: flex;
  flex-direction: column;
`

const SectionLabel = styled.div``

const TemplateList = styled.ul`
  flex: 1;
  max-height: 250px;
  overflow: auto;
  margin: 0;
  padding: 0;
`

const Template = styled.li`
  list-style: none;
  margin: 8px;
  padding: 16px;
  border-radius: 5px;
  border: solid 1px #6d6d6d;
  cursor: pointer;

  &:hover {
    background: #3b3b3b;
  }
`

const TemplateTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`


interface EmptyStateProps {
  onAdapterSelection: (fileName: string) => void
}

const NewAdapterForm: React.FC<EmptyStateProps> = ({ onAdapterSelection }) => {
  const createTemplateClickListener = (code: string) => () => onAdapterSelection(newModule(code))

  return (
    <Container>
      <TemplateSection>
        <SectionLabel>From a template</SectionLabel>
        <TemplateList>
          <Template onClick={createTemplateClickListener(feeAdapter)}>
            <TemplateTitle>Fee Revenue Adapter</TemplateTitle>
            <div>Create a basic adapter for querying fee revenue from a subgraph.</div>
          </Template>
          <Template onClick={createTemplateClickListener(apyAdapter)}>
            <TemplateTitle>APY Adapter</TemplateTitle>
            <div>Adapter for calculating the APY of an asset by comparing the exchange rate on 2 dates.</div>
          </Template>
        </TemplateList>
      </TemplateSection>
    </Container>
  )
}

export default NewAdapterForm
