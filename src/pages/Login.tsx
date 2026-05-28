import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy } from 'react-icons/fa';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/assetUtils';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.background}ee);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.heading};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Tagline = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text}aa;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const UserButton = styled.button<{ isLoading?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: ${({ isLoading }) => (isLoading ? 'wait' : 'pointer')};
  transition: all 0.3s ease;
  opacity: ${({ isLoading }) => (isLoading ? 0.7 : 1)};
  
  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const UserAvatar = styled.div<{ src: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border: 3px solid ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.3s ease;
  
  ${UserButton}:hover & {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 500px) {
    width: 70px;
    height: 70px;
  }
`;

const UserName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;
  
  ${UserButton}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ChampionBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text}aa;
`;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  // Predefined users for login
  const users = [
    { id: 1, username: 'russo', password: 'fartblaster', displayName: 'Russo', avatar: 'avatar1.jpg', isChampion: false },
    { id: 2, username: 'stacho', password: 'stinkbomb', displayName: 'Stacho', avatar: 'avatar2.jpg', isChampion: false },
    { id: 3, username: 'tim', password: 'toottoot', displayName: 'Tim', avatar: 'avatar3.jpg', isChampion: false },
    { id: 4, username: 'lucas', password: 'windbreaker', displayName: 'Lucas', avatar: 'avatar4.jpg', isChampion: false },
    { id: 5, username: 'paul', password: 'gasattack', displayName: 'Paul', avatar: 'avatar5.jpg', isChampion: true },
    { id: 6, username: 'dennis', password: 'organizer', displayName: 'Dennis', avatar: 'avatar6.jpg', isChampion: false },
  ];
  
  const handleLogin = async (user: typeof users[0]) => {
    setIsLoading(true);
    setSelectedUser(user.id);
    
    try {
      const success = await login(user.username, user.password);
      if (success) {
        navigate('/feed');
      }
    } finally {
      setIsLoading(false);
      setSelectedUser(null);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <FaTrophy />
          OTTER
        </Logo>
        <Tagline>Die soziale Plattform für eure Wettkämpfe</Tagline>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <UserGrid>
          {users.map((user) => (
            <UserButton
              key={user.id}
              onClick={() => handleLogin(user)}
              disabled={isLoading}
              isLoading={isLoading && selectedUser === user.id}
            >
              <AvatarContainer>
                <UserAvatar src={getAvatarUrl(user.avatar)} />
                {user.isChampion && (
                  <ChampionBadge>
                    <FaTrophy />
                  </ChampionBadge>
                )}
              </AvatarContainer>
              <UserName>{user.displayName}</UserName>
            </UserButton>
          ))}
        </UserGrid>
        
        <Footer>
          Wähle deinen Namen, um dich einzuloggen
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
