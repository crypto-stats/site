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

  :hover {
    color: #0477f4;
    border: solid 1px #0477f4;
  }
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
  description?: string
  metadata?: string[]
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
            <ListItem>
              <Link href={item.link} passHref>
                <Card>
                  <div />
                  <Content>
                    <h2>{item.title}</h2>
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
