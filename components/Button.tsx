import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Edit, ExternalLink, Loader2 } from 'lucide-react'
import DiscordIcon from './icons/Discord'
import ForkIcon from './icons/Fork'

interface ButtonElementProps {
  variant?: string
  width?: string
  size?: string
  fullWidth?: boolean
  centered?: boolean
  loading?: boolean
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const spinnerSize = 24

const loadingMixin = css`
  cursor: default;

  &:before {
    content: '';
    width: ${spinnerSize}px;
    height: ${spinnerSize}px;
    border-radius: ${spinnerSize}px;
    border: 4px solid #aaa;
    border-color: #aaa transparent #aaa transparent;
    animation: ${spin} 1.2s linear infinite;
    position: absolute;
    left: calc(50% - ${spinnerSize / 2}px);
    top: calc(50% - ${spinnerSize / 2}px);
    box-sizing: border-box;
  }
`

const ButtonElement = styled.button<ButtonElementProps>`
  font-family: 'Inter';
  display: flex;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  min-width: ${({ width }) => (width === 'auto' ? `auto` : `160px`)};
  border: none;
  border-radius: 4px;
  box-shadow: none;
  background: none;
  cursor: pointer;
  outline: none;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 17px;
  transition: 150ms ease;
  padding: var(--spaces-2) var(--spaces-3);
  position: relative;
  text-decoration: none;

  // Primary styling
  background-color: var(--color-primary);
  color: var(--color-white);

  &:hover {
    background-color: var(--color-primary);
    color: var(--color-white) !important;
  }

  &:disabled,
  &:hover:disabled {
    border-color: #999 !important;
    background-color: #999 !important;
    cursor: not-allowed;
    color: var(--color-dark-600) !important;
  }

  ${({ loading }) => (loading ? loadingMixin : '')}

  ${({ variant }) =>
    variant === 'outline' &&
    `
      background-color: var(--color-white);
      color: var(--color-primary);
      border: 1px solid var(--color-primary);

      &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
  `}

  ${({ variant }) =>
    variant === 'secondary' &&
    `
      background-color: var(--color-primary-200);
      color: #0477F4;
      border: 1px solid transparent;

      &:hover {
        background-color: #0477F4;
        color: #FFF;
      }
  `}

  ${({ centered }) =>
    centered &&
    `
    margin: 0 auto;
  `}

  ${({ size, width }) => {
    if (size === 'large')
      return `
    padding: var(--spaces-3) var(--spaces-5);

    & > i {
      width: 24px;
      height: 24px;
      margin-right: 24px;
    }

    &:hover {
      i > svg {
        fill: white;
      }
    }`

    if (size === 'small')
      return `
      padding: var(--spaces-1) var(--spaces-1);
      ${width ? '' : 'min-width: 70px;'}
    `

    return ''
  }}
`

const Icon = styled.i<{ $spin?: boolean }>`
  width: var(--spaces-3);
  height: var(--spaces-3);
  display: inline-block;
  margin-right: var(--spaces-2);

  ${({ $spin }) => ($spin ? 'animation: spin 2s linear infinite;' : null)}

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }
`

interface ButtonProps {
  onClick?: () => void
  href?: string
  target?: string
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  icon?: string
  width?: string
  variant?: string
  size?: string
  centered?: boolean
  title?: string
  rel?: string
}

const Button: React.FC<ButtonProps> = props => {
  const {
    children,
    onClick,
    href,
    target,
    disabled,
    className,
    variant,
    icon,
    width,
    size,
    fullWidth,
    centered,
    loading,
    title = '',
    rel,
  } = props
  let svgIcon: React.ReactNode | null = null
  let shouldSpin: boolean = false

  if (icon) {
    switch (icon) {
      case 'External':
        svgIcon = <ExternalLink size="16" />
        break
      case 'Edit':
        svgIcon = <Edit size="16" />
        break
      case 'Fork':
        svgIcon = <ForkIcon />
        break
      case 'Discord':
        svgIcon = <DiscordIcon />
        break
      case 'Loading':
        svgIcon = <Loader2 size="16" />
        shouldSpin = true
        break
    }
  }

  const buttonProps = {
    loading,
    centered,
    fullWidth,
    size,
    title,
    variant,
    width,
    className,
  }

  const isDisabled = disabled || loading

  if (href) {
    return (
      <ButtonElement as="a" href={href} target={target} rel={rel} {...buttonProps}>
        {icon && <Icon $spin={shouldSpin}>{svgIcon}</Icon>}
        <span>{children}</span>
      </ButtonElement>
    )
  }

  return (
    <ButtonElement {...buttonProps} {...(disabled ? { disabled: isDisabled } : { onClick })}>
      {icon && <Icon $spin={shouldSpin}>{svgIcon}</Icon>}
      <span>{children}</span>
    </ButtonElement>
  )
}

Button.defaultProps = {
  className: 'primary',
}

export default Button
