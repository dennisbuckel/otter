import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaImages, FaUser, FaCog } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/assetUtils';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.card};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  
  @media (min-width: 768px) {
    top: 0;
    bottom: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavItems = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 600px;
  margin: 0 auto;
`;

const NavItem = styled.li<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : theme.colors.text};
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    transition: all 0.2s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    
    svg {
      font-size: 1.5rem;
      margin-bottom: ${({ theme }) => theme.spacing.xs};
    }
  }
`;

const UserAvatar = styled.div<{ src: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  
  svg {
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const Navigation: React.FC = () => {
  const location = useLocation();
  const { toggleTheme, themeType } = useTheme();
  const { currentUser, isAuthenticated } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <NavContainer>
      <NavItems>
        <NavItem isActive={isActive('/championships')}>
          <Link to="/championships">
            <FaTrophy />
            <span>Championships</span>
          </Link>
        </NavItem>
        
        <NavItem isActive={isActive('/feed')}>
          <Link to="/feed">
            <FaImages />
            <span>Feed</span>
          </Link>
        </NavItem>
        
        <NavItem isActive={isActive('/profile')}>
          <Link to="/profile">
            {isAuthenticated && currentUser?.avatar ? (
              <UserAvatar src={getAvatarUrl(currentUser.avatar)} />
            ) : (
              <FaUser />
            )}
            <span>Profile</span>
          </Link>
        </NavItem>
        
        <NavItem isActive={isActive('/settings')}>
          <Link to="/settings">
            <FaCog />
            <span>Settings</span>
          </Link>
        </NavItem>
      </NavItems>
    </NavContainer>
  );
};

export default Navigation;
