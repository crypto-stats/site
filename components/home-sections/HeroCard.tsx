import React from "react"
import styled from "styled-components"
import { Positionable, Position } from "./Positionable"
import Icon from "components/Icon"

const CardContainer = styled(Positionable)<{ position?: Position }>`
  border-radius: 10px;
  box-shadow: 0 10px 35px 16px rgba(0, 36, 75, 0.05), 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #ddd;
  background-color: #fff;

  ${({ position }) =>
    position
      ? `
    width: 70%;
  `
      : ""}
`

const CardHeader = styled.div`
  border-bottom: solid 1px #ddd;
  display: flex;
  height: 53px;
  color: #0477f4;
  font-size: 14px;
  font-weight: 700;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`

const CardIcoName = styled.div`
  display: flex;
  align-items: center;
`

const SubtitleChip = styled.div`
  border-radius: 8px;
  background: #eef1f7;
  height: 30px;
  line-height: 30px;
  padding: 0 16px;
  font-size: 12px;
  color: #4e4e4e;
`

const CardBody = styled.div`
  margin: 18px;
`

interface HeroCardProps {
  title: string
  subtitle: string
  position?: Position
  icon?: string
}

const HeroCard: React.FC<HeroCardProps> = ({ title, subtitle, children, position, icon }) => {
  return (
    <CardContainer position={position}>
      <CardHeader>
        <CardIcoName>
          <Icon type={icon} size='small' />
          {title}
        </CardIcoName>
        <SubtitleChip>{subtitle}</SubtitleChip>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </CardContainer>
  )
}

export default HeroCard
