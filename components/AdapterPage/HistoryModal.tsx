import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const List = styled.ul`
  margin: 20px;
  padding: 0;
  min-width: 300px;
`

const LinkItem = styled.a`
  background: white;
  display: flex;
  padding: 10px;
  text-decoration: none;
  font-family: 'Inter';
  font-size: 16px;
  color: #717d8a;

  &:hover {
    background: var(--color-primary-300);
  }
`

const MainLinkItem = styled(LinkItem)`
  flex: 1;
  font-size: 16px;
  color: #002750;
  font-weight: 500;
`

const Item = styled.li`
  height: 42px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid var(--color-primary-800);
  transition: var(--transition-fast);

  & + & {
    border-top: none;
  }
`

export interface HistoricalVersion {
  cid: string
  version: string | null
}

interface AdapterHistoryProps {
  historicalVersions: HistoricalVersion[]
  currentCID: string
}

const AdapterHistory: React.FC<AdapterHistoryProps> = ({ historicalVersions, currentCID }) => {
  const router = useRouter()

  return (
    <div>
      <List>
        {historicalVersions.map((version: HistoricalVersion, i: number) => (
          <Item key={version.cid}>
            <Link href={`/discover/${router.query.listId}/${version.cid}`} passHref>
              <MainLinkItem>{version.version || 'Unversioned'}</MainLinkItem>
            </Link>

            {i > 0 && (
              <Link href={`/discover/diff/${version.cid}/${currentCID}`} passHref>
                <LinkItem>Diff</LinkItem>
              </Link>
            )}

            {i < historicalVersions.length - 1 && (
              <Link
                href={`/discover/diff/${historicalVersions[i + 1].cid}/${version.cid}`}
                passHref
              >
                <LinkItem>Prev</LinkItem>
              </Link>
            )}
          </Item>
        ))}
      </List>
    </div>
  )
}

export default AdapterHistory
