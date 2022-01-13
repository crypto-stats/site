import React from 'react';
import styled from 'styled-components';

const TagElement = styled.div<{ type?: string, mt?:string, mb?:string, color?: string, align?: string }>`
  font-family: "Inter";
  font-weight: 400;
  margin: 0;
  margin-top: ${({mt})=>mt ? mt : '0'}px;
  margin-bottom: ${({mb})=>mb ? mb : '0'}px;
  padding: 0;

  ${({align}) => align && `text-align: ${align};`}

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

  ${({type}) => type === "title_highlight" && `
    font-size: 24px;
    color: #0477F4;
    letter-spacing: 0.1px;
  `}

  ${({type}) => type === "h3" && `
    font-weight: 700;
    font-size: 22px;
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
  
  ${({type}) => type === "content_big" && `
    font-size: 18px;
    color: #002750;
    line-height: 24px;
  `}

  ${({type}) => type === "content_display" && `
    font-weight: 400;
    font-size: 24px;
    color: #002750;
    line-height: 37px;
  `}

  ${({type}) => type === "pre" && `
    font-family: monospace;
    font-size: 16px;
    color: #002750;
    line-height: 21px;
    white-space: break-spaces;
  `}

  ${({color})=>color && `color: var(--color-${color});`}
`

interface TextProps {
  tag?: React.ElementType | "div"
  mt?: string | "0"
  mb?: string | "0"
  type?: string
  className?: string
  color?: string
  align?: string
}

const Text: React.FC<TextProps> = ({ tag, type, className, children, mt, mb, color, align }) => {
  return (
    <TagElement as={tag} className={className} type={type} mt={mt} mb={mb} color={color} align={align}>
      {children}
    </TagElement>
  )
}

export default Text;