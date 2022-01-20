import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Text from 'components/Text'


const ListHead = styled.div`
  
`

const List = styled.ul`
  margin: 0;
  padding: 0;
`

const ListItem = styled.li`
  margin: var(--spaces-4) 0;
  list-style: none;
`

const Card = styled.a`
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  /* align-items: center; */
 
`

const IconList = styled.ul`
  margin: 4px 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`

const IconListIcon = styled.li`
  height: 44px;
  width: 44px;
  list-style: none;
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 22px;
  margin-left: -8px;
`

const Content = styled.div`
  transition: var(--transition-fast);
  border-radius: var(--spaces-2);
  padding: var(--spaces-6);
  border: 1px solid var(--color-primary-800);
  box-shadow: var(--box-shadow-card);

  &:hover {
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
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
      <Text tag="h3" type="subtitle" mt="32">Data is pulled from this adapters</Text>
      <ListHead>

      </ListHead>
      <List>
        {items.map((item: Item) => {
          return (
            <ListItem key={item.title}>
              <Link href={item.link} passHref>
                <Card>
                  <Content>
                    <Text tag="h3" type="h3">{item.title}</Text>

                    {item.description && <Text tag="p" type="description" mt="16" mb="16">{item.description}</Text>}

                    {item.iconlist && (
                      <IconList>
                        {item.iconlist.map((icon: { path: string, title: string }, i: number) => (
                          <IconListIcon
                            key={i}
                            style={{ backgroundImage: `url(${icon.path})` }}
                          />
                        ))}
                      </IconList>
                    )}
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
