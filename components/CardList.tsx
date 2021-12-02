import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  margin: 2px 0;
`

const List = styled.ul`
  margin: 0;
  padding: 0;
`

const ListItem = styled.li`
  margin: 12px 0;
  list-style: none;
`

const Card = styled.a`
  display: block;
  box-sizing: border-box;
  padding: 40px;
  text-decoration: none;
  height: 244px;
  border-radius: 5px;
  border: solid 1px #ddd;
  background-color: #ffffff;
  color: #002750;

  &:hover {
    color: #0477f4;
    border: solid 1px #0477f4;
  }

  &:hover h2 {
    color: #0477f4;
  }
`

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #002750;
`

const Subtitle = styled.div`
  color: #717d8a;
  font-size: 18px;
`

const IconList = styled.ul`
  margin: 4px 0;
  padding: 0;
  display: flex;
`

const IconListIcon = styled.li`
  height: 44px;
  width: 44px;
  list-style: none;
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: white;
  box-shadow: 1px 2px 4px #0000003d;
  border-radius: 22px;
  margin-left: -8px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
`

const Description = styled.p`
  color: #717d8a;
`

const Metadata = styled.span`
  font-size: 16px;
  color: #717d8a;
`

export interface Item {
  title: string
  subtitle?: string | null
  description?: string
  metadata?: string[]
  iconlist?: { path: string, title: string }[]
  link: string
}

interface CardListProps {
  items: Item[]
}

const CardList: React.FC<CardListProps> = ({ items }) => {
  return (
    <Container>
      <List>
        {items.map((item: Item) => {
          return (
            <ListItem key={item.title}>
              <Link href={item.link} passHref>
                <Card>
                  <div />
                  <Content>
                    <Title>{item.title}</Title>
                    
                    {item.subtitle && <Subtitle>{item.subtitle}</Subtitle>}

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

                    {item.description && <Description>{item.description}</Description>}

                    {item.metadata && (
                      <div>
                        {item.metadata.map((val: string) => <Metadata key={val}>{val}</Metadata>)}
                      </div>
                    )}
                  </Content>
                </Card>
              </Link>
            </ListItem>
          )
        })}
      </List>
    </Container>
  )
}

export default CardList
