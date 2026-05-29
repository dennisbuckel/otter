import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaImages, FaUser, FaCog, FaBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/assetUtils';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.card};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));

  @media (min-width: 768px) {
    top: 56px;
    bottom: auto;
    border-top: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 0;
  }
`;

const NavItems = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  max-width: 500px;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 600px;
    height: 56px;
  }
`;

const NavItem = styled.li`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textMuted ?? '#888'};
  font-size: 0.65rem;
  font-weight: ${({ $active }) => $active ? '700' : '500'};
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;

  svg {
    font-size: 1.3rem;
    transition: transform 0.2s ease;
  }

  ${({ $active, theme }) => $active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      border-radius: 2px;
      background: ${theme.colors.primary};
    }
  `}

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    svg { transform: scale(1.1); }
  }
`;

const AvatarIcon = styled.div<{ src: string }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 2px solid currentColor;
`;

const Navigation: React.FC = () => {
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <NavContainer>
      <NavItems>
        <NavItem>
          <NavLink to="/championships" $active={isActive('/championships')}>
            <FaTrophy />
            <span>Ranking</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/feed" $active={isActive('/feed')}>
            <FaImages />
            <span>Feed</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/rules" $active={isActive('/rules')}>
            <FaBook />
            <span>Regeln</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/profile" $active={isActive('/profile')}>
            {isAuthenticated && currentUser?.avatar ? (
              <AvatarIcon src={getAvatarUrl(currentUser.avatar)} />
            ) : (
              <FaUser />
            )}
            <span>Profil</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/settings" $active={isActive('/settings')}>
            <FaCog />
            <span>Settings</span>
          </NavLink>
        </NavItem>
      </NavItems>
    </NavContainer>
  );
};

export default Navigation;
