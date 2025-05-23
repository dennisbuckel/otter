import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';

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
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: 70px; /* Space for mobile navigation */
  
  @media (min-width: 768px) {
    padding-bottom: ${({ theme }) => theme.spacing.md};
    padding-top: 70px; /* Space for desktop navigation */
  }
`;

const Layout: React.FC<LayoutProps> = ({ children, title = 'OTTER' }) => {
  const { toggleTheme, themeType } = useTheme();
  
  const getThemeIcon = () => {
    switch (themeType) {
      case 'light':
        return <FaMoon />;
      case 'dark':
        return <FaPalette />;
      case 'fun':
        return <FaSun />;
      default:
        return <FaSun />;
    }
  };
  
  return (
    <LayoutContainer>
      <Header>
        <Title>{title}</Title>
        <ThemeToggleButton onClick={toggleTheme} aria-label="Toggle theme">
          {getThemeIcon()}
        </ThemeToggleButton>
      </Header>
      
      <Main>{children}</Main>
      
      <Navigation />
    </LayoutContainer>
  );
};

export default Layout;
