import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaFire, FaWater } from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 ${({ theme }) => theme.spacing.md};
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const AppName = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 6px;

  span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    display: inline-block;
    margin-bottom: 2px;
  }
`;

const PageTitle = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: 0.02em;
`;

const RightSlot = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ThemeBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: 80px; /* Platz für mobile Nav */

  @media (min-width: 768px) {
    padding-bottom: ${({ theme }) => theme.spacing.md};
    padding-top: 70px; /* Platz für Desktop-Nav */
  }
`;

const Layout: React.FC<LayoutProps> = ({ children, title = 'OTTER' }) => {
  const { toggleTheme, themeType } = useTheme();

  const getThemeIcon = () => {
    switch (themeType) {
      case 'light': return <FaMoon />;
      case 'dark':  return <FaSun />;
      case 'fun':   return <FaFire />;
      case 'ocean': return <FaWater />;
      default:      return <FaSun />;
    }
  };

  const isHome = title === 'OTTER';

  return (
    <LayoutContainer>
      <Header>
        {isHome ? (
          <AppName>OTTER<span className="dot" /></AppName>
        ) : (
          <>
            <AppName>OTTER</AppName>
            <PageTitle>{title}</PageTitle>
          </>
        )}
        <RightSlot>
          <ThemeBtn onClick={toggleTheme} aria-label="Theme wechseln">
            {getThemeIcon()}
          </ThemeBtn>
        </RightSlot>
      </Header>

      <Main>{children}</Main>

      <Navigation />
    </LayoutContainer>
  );
};

export default Layout;
