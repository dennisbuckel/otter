import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

// Button styling based on variant
const getButtonVariantStyles = (theme: Theme, variant: ButtonVariant = 'primary') => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}dd;
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary}dd;
        }
      `;
    case 'accent':
      return css`
        background-color: ${theme.colors.accent};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.accent}dd;
        }
      `;
    case 'success':
      return css`
        background-color: ${theme.colors.success};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.success}dd;
        }
      `;
    case 'error':
      return css`
        background-color: ${theme.colors.error};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.error}dd;
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}11;
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}11;
        }
      `;
    default:
      return css`
        background-color: ${theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}dd;
        }
      `;
  }
};

// Button sizing
const getButtonSizeStyles = (theme: Theme, size: ButtonSize = 'medium') => {
  switch (size) {
    case 'small':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: 0.875rem;
      `;
    case 'medium':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: 1rem;
      `;
    case 'large':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: 1.125rem;
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: 1rem;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  
  ${({ theme, variant }) => getButtonVariantStyles(theme, variant)}
  ${({ theme, size }) => getButtonSizeStyles(theme, size)}
  
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Loading state */
  position: relative;
  
  ${({ isLoading }) =>
    isLoading &&
    css`
      color: transparent;
      
      &::after {
        content: '';
        position: absolute;
        width: 1em;
        height: 1em;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  icon,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {icon && !isLoading && icon}
      {children}
    </StyledButton>
  );
};

export default Button;
