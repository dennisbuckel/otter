import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  noPadding?: boolean;
}

const CardContainer = styled.div<{ hoverable?: boolean; noPadding?: boolean }>`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: ${({ theme, noPadding }) => (noPadding ? '0' : theme.spacing.md)};
  
  ${({ hoverable, theme }) =>
    hoverable &&
    `
    cursor: pointer;
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.large};
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h3`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const CardSubtitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text}aa;
  font-weight: 400;
  font-size: 0.9rem;
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
`;

const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className,
  onClick,
  hoverable = false,
  noPadding = false,
}) => {
  return (
    <CardContainer
      className={className}
      onClick={onClick}
      hoverable={hoverable}
      noPadding={noPadding}
    >
      {(title || subtitle) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};

export default Card;
