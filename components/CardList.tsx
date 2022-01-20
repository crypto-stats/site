import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Text from 'components/Text'
import IconRound from 'components/IconRound'

const List = styled.ul`
  margin: 0 var(--spaces-6);
  padding: 0;
`

const ListItem = styled.li`
  margin: var(--spaces-4) 0;
  list-style: none;
`

const Card = styled.a<{icon?: string}>`
  background-color: var(--color-white);
  box-sizing: border-box;
  padding: var(--spaces-6);
  text-decoration: none;
  border-radius: var(--spaces-2);
  border: 1px solid var(--color-primary-800);
  box-shadow: var(--box-shadow-card);
  cursor: pointer;
  transition: var(--transition-fast);
  min-height: 240px;

  display: grid;
  ${({icon})=>icon ? 'grid-template-columns: 20% 80%;' : 'grid-template-columns: 100%;'}
  grid-gap: 0 var(--spaces-5);
  align-items: center;

  &:hover {
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }

  &:hover h3 {
    color: var(--color-primary);
  }
`

const CardIcon = styled(IconRound)`
  padding-right: var(--spaces-3);
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
  display: flex;
  flex-direction: column;
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

interface CardListProps {
  items: Item[]
}

const CardList: React.FC<CardListProps> = ({ items }) => {
  return (
    
    <List>
      {items.map((item: Item) => {
        return (
          <ListItem key={item.title}>
            <Link href={item.link} passHref>
              <Card icon={item.icon}>
                {item.icon && <CardIcon color={item.iconColor} icon={item.icon} />}
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

                  {item.metadata && (
                    <>
                      {item.metadata.map((val: string) => <Text tag="p" type="content" mt="16" key={val}>{val}</Text>)}
                    </>
                  )}
                </Content>
              </Card>
            </Link>
          </ListItem>
        )
      })}
    </List>
  )
}

export default CardList
