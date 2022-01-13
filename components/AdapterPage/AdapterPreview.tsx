import React, { useState } from 'react'
import styled from 'styled-components'
import type { Adapter } from '@cryptostats/sdk'
import QueryForm from './QueryForm'
import Text from 'components/Text'

const AttributeContainer = styled.dl`
  & + & {
    margin-top: var(--spaces-5);
  }
`

// TODO: use existing Attribute component with dark/bright colors
const Attribute: React.FC<{ name: string }> = ({ name, children }) => {
  return (
    <>
      <Text tag="dt" type="label" mb="8">{name}</Text>
      <Text tag="dd" type="pre" mb="24">{children}</Text>
    </>
  )
}

const AdapterTitle = styled.div<{ open?: boolean}>`
  background: white;
  height: 42px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid var(--color-primary-800);
  transition: var(--transition-fast);

  &:hover {
    background: var(--color-primary-300);

    > h3 {
      color: var(--color-dark-400);
    }
  }

  & + & {
    border-top: none;
  }

  ${({open}) => open ? `
    background-color: var(--color-primary-300);

    > h3 {
      color: var(--color-dark-400);
    }
  ` : `` }
`

const AdapterIcon = styled.div`
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin: 16px;
`

const Row = styled.div`
  display: flex;
  border: solid 1px #ddd;
  background: #ffffff;
  border-top: none;
`

const Col = styled.div`
  flex: 1 0 0;
  overflow: hidden;
  border-left: solid 1px #dddddd;
  padding: 24px;

  &:first-child {
    border-left: none;
  }
`

const ColTest = styled(Col)`
  background-color: var(--color-primary-400);
`

const Icon = styled.img`
  max-width: 50px;
  max-height: 50px;
`

interface AdapterPreviewProps {
  details: any
  adapter: Adapter | null
  openByDefault?: boolean
}

const AdapterPreview: React.FC<AdapterPreviewProps> = ({ details, adapter, openByDefault }) => {
  const [open, setOpen] = useState(!!openByDefault)

  const title = details.metadata.name
    ? `${details.metadata.name}${details.metadata.subtitle ? ' - ' + details.metadata.subtitle : ''} (${details.id})`
    : details.id

  return (
    <>
      <AdapterTitle onClick={() => setOpen(!open)} open={open}>
        <AdapterIcon style={{ backgroundImage: `url('${details.metadata.icon}')` }} />
        <Text tag="h3" type="label">{title}</Text>
      </AdapterTitle>

      {open && (
        <Row>
          <Col>
            <Text tag="p" type="label" mb="24">Metadata</Text>
            <AttributeContainer>
              {Object.entries(details.metadata).map(([key, val]: [string, any]) => (
                <Attribute name={key} key={key}>
                  {typeof val === 'string' && val.indexOf('data:') === 0 ? (
                    <>
                      <Icon src={val} />
                    </>
                  ) : (
                    <Text tag="pre" type="pre">{JSON.stringify(val, null, 2)}</Text>
                  )}
                </Attribute>
              ))}
            </AttributeContainer>
          </Col>

          <ColTest>
            <Text tag="p" type="label" mb="24">Queries</Text>
            {adapter && Object.entries(adapter.queries).map(([id, fn]: [string, any], _id: number, list: any[]) => {
              return (
                <QueryForm
                  key={id}
                  id={id}
                  fn={fn}
                  adapter={adapter.id}
                  openByDefault={list.length === 1}
                />
              )
            })}
          </ColTest>
        </Row>
      )}
    </>
  )
}

export default AdapterPreview
