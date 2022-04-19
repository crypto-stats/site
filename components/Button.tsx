import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Edit } from 'react-feather'

const ForkIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7Z" />
    <path d="M8 21C9.10457 21 10 20.1046 10 19C10 17.8954 9.10457 17 8 17C6.89543 17 6 17.8954 6 19C6 20.1046 6.89543 21 8 21Z" />
    <path d="M17 10C18.1046 10 19 9.10457 19 8C19 6.89543 18.1046 6 17 6C15.8954 6 15 6.89543 15 8C15 9.10457 15.8954 10 17 10Z" />
    <path d="M8 7V17" />
    <path d="M17 11V12.8C17 13.1183 16.7893 13.4235 16.4142 13.6485C16.0391 13.8736 15.5304 14 15 14H8" />
  </svg>
)

const DiscordIcon: React.FC = () => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.468-2.14-1.404-2.14-1.404s.134.066.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4.466.202 1.065.403 1.8.536.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.936-2.205 1.404.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334.002-.74.573-1.338 1.27-1.338zm-4.543 0c.7 0 1.266.6 1.266 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334 0-.74.57-1.338 1.27-1.338z" />
  </svg>
)

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
    opacity: 0.5;
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

  ${({ size }) =>
    size &&
    size === 'large' &&
    `
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
    }
  `}
`

const Icon = styled.i`
  width: var(--spaces-3);
  height: var(--spaces-3);
  display: inline-block;
  margin-right: var(--spaces-2);
`

interface ButtonProps {
  onClick?: () => void
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
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
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
}) => {
  let svgIcon: React.ReactNode | null = null

  if (icon) {
    switch (icon) {
      case 'Edit':
        svgIcon = <Edit size="16" />
        break
      case 'Fork':
        svgIcon = <ForkIcon />
        break
      case 'Discord':
        svgIcon = <DiscordIcon />
        break
    }
  }

  return (
    <ButtonElement
      onClick={onClick}
      loading={loading}
      disabled={disabled || loading}
      className={className}
      width={width}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      centered={centered}
      title={title}>
      {icon && <Icon>{svgIcon}</Icon>}
      <span>{children}</span>
    </ButtonElement>
  )
}

Button.defaultProps = {
  className: 'primary',
}

export default Button
