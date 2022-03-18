import React from "react"
import styled from "styled-components"
import Link from "next/link"
import Text from "components/Text"
import IconRound from "components/IconRound"

const List = styled.ul`
  padding: 0;

  @media (min-width: 768px) {
    margin: 0 var(--spaces-7);
  }
`

const ListItem = styled.li`
  list-style: none;

  & + & {
    margin-top: var(--spaces-4);
  }
`

const Card = styled.a<{ icon?: string }>`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0 var(--spaces-5);
  min-height: 240px;
  padding: var(--spaces-6);
  background-color: var(--color-white);
  box-sizing: border-box;
  text-decoration: none;
  border-radius: var(--spaces-2);
  border: 1px solid var(--color-primary-800);
  box-shadow: var(--box-shadow-card);
  transition: var(--transition-fast);
  align-items: center;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }

  &:hover h3 {
    color: var(--color-primary);
  }

  @media (min-width: 768px) {
    ${({ icon }) => (icon ? "grid-template-columns: auto 1fr;" : "grid-template-columns: 100%;")}
  }
`

const CardIcon = styled(IconRound)`
  padding-right: var(--spaces-3);
  margin-bottom: 32px;

  @media (min-width: 768px) {
    margin-bottom: 0px;
  }
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
  margin-top: 32px;

  @media (min-width: 768px) {
    margin-top: 0px;
  }
`

export interface Item {
  title: string
  subtitle?: string | null
  description?: string | null
  icon?: string
  iconColor?: string
  metadata?: string[]
  iconlist?: { path: string; title: string }[]
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
                  <Text tag='h3' type='h3'>
                    {item.title}
                  </Text>

                  {item.description && (
                    <Text tag='p' type='description' mt='16' mb='16'>
                      {item.description}
                    </Text>
                  )}

                  {item.iconlist && (
                    <IconList>
                      {item.iconlist.map((icon: { path: string; title: string }, i: number) => (
                        <IconListIcon key={i} style={{ backgroundImage: `url(${icon.path})` }} />
                      ))}
                    </IconList>
                  )}

                  {item.metadata && (
                    <>
                      {item.metadata.map((val: string) => (
                        <Text tag='p' type='content' mt='16' key={val}>
                          {val}
                        </Text>
                      ))}
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
