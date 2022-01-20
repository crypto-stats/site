import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Text from 'components/Text'
import { ArrowRight } from 'react-feather'



const ListHead = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 22px 24px;
  display: grid;
  grid-template-columns: 4fr 3fr 1fr 1fr;
  column-gap: 32px;
  align-items: center;
`

const ListHeadName = styled(Text)``
const ListHeadIcons = styled(Text)``
const ListHeadVersion = styled(Text)``
const ListHeadCta = styled(Text)``

const CtaAffordance = styled.div`
  width: 32px;
  height: 32px;
  background-color: white;
  border: 1px solid #ddd;
  justify-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  font-size: 16px;

  & > svg {
    color: var(--color-primary);
    height: 16px;
  }
`

const List = styled.ul`
  margin: 0;
  padding: 0;
`

const ListItem = styled.li`
  list-style: none;
`

const Card = styled.a`
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
`

const IconList = styled.ul`
  margin: 4px 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const IconListIcon = styled.li`
  height: 32px;
  width: 32px;
  list-style: none;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 100%;
  margin-left: 8px;
`

const MoreIcons = styled(Text)`
  background-color: white;
  border-radius: 100%;
  border: 1px solid #ddd;
  padding: 4px 6px;
  margin-left: 8px;
`

const Content = styled(ListHead)`
  padding: var(--spaces-2) var(--spaces-4);
  background-color: transparent;
  border: 1px solid var(--color-primary-800);
  border-radius: 0;
  border-top-color: transparent;
  transition: var(--transition-fast);

  &:hover {
    color: var(--color-primary);
    background-color: var(--color-primary-300);
  }

  &:hover h3 {
    color: var(--color-primary);
  }
`

export interface Item {
  title: string
  subtitle?: string | null
  description?: string | null
  icon?: string
  iconColor?: string 
  metadata?: string[]
  iconlist?: { path: string, title: string }[]
  link: string
}

interface AdapterCardListProps {
  items: Item[]
}

const AdapterCardList: React.FC<AdapterCardListProps> = ({ items }) => {
  return (
    <>
      <Text tag="h3" type="subtitle" weight="400" mt="32" mb="24">Data is pulled from this adapters</Text>
      <ListHead>
        <ListHeadName tag="span" type="label">Adapter name</ListHeadName>
        <ListHeadIcons tag="span" type="label">Protocols/Networks</ListHeadIcons>
        <ListHeadVersion tag="span" type="label">Version</ListHeadVersion>
        <ListHeadCta tag="span" type="label"></ListHeadCta>
      </ListHead>
      <List>
        {items.map((item: Item) => {
          return (
            <ListItem key={item.title}>
              <Link href={item.link} passHref>
                <Card>
                  <Content>
                    <div>
                      <Text tag="h3" type="content" weight="600">{item.title}</Text>
                      {/* {item.description && <Text tag="p" type="description" mt="8">{item.description}</Text>} */}
                    </div>

                    {item.iconlist && (
                      <IconList>
                        {item.iconlist.map((icon: { path: string, title: string }, i: number) => {
                          
                          if(i < 5 ) {
                            return (
                              <IconListIcon
                                key={i}
                                style={{ backgroundImage: `url(${icon.path})` }}
                              />
                            )
                          }
                        }
                        )}
                        {
                          item.iconlist.length > 5 && <MoreIcons tag="span" type="description">+{item.iconlist.length - 5}</MoreIcons>
                        }
                      </IconList>
                    )}
                    <Text>0.1.0</Text>

                    <CtaAffordance>
                      <ArrowRight />
                    </CtaAffordance>
                  </Content>
                </Card>
              </Link>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default AdapterCardList
