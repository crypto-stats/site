import React from 'react';
import styled from 'styled-components';

const TagElement = styled.div<{ type?: string }>`
  font-weight: 400;
  margin: 0;
  padding: 0;

  ${({type}) => type === "display" && `
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    color: #272727;

    @media (min-width: 1024px) { 
      font-size: 52px;
      line-height: 56px;
      letter-spacing: -1.5px;
    }
  `}
  ${({type}) => type === "title" && `
    font-weight: 600;
    font-size: 36px;
    color: #002750;
  `}
  ${({type}) => type === "subtitle" && `
    font-weight: 600;
    font-size: 24px;
    color: #002750;
    letter-spacing: 0.1px;
  `}
  ${({type}) => type === "label" &&  `
    font-size: 12px;
    color: #838383;
    letter-spacing: 1.5px;  
    text-transform: uppercase;
  `}
  ${({type}) => type === "description" && `
    font-size: 16px;
    color: #717D8A;
    line-height: 24px;
  `}
  ${({type}) => type === "content" && `
    font-size: 16px;
    color: #002750;
    line-height: 21px;
  `}
  ${({type}) => type === "pre" && `
    font-size: 16px;
    color: #002750;
    line-height: 21px;
    white-space: break-spaces;
  `}
`

interface TextProps {
  tag: React.ElementType
  type?: string
  className?: string
}

const Text: React.FC<TextProps> = ({ tag, type, className, children }) => {
  return (
    <TagElement as={tag} className={className} type={type}>
      {children}
    </TagElement>
  )
}

export default Text;