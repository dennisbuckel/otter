import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock } from 'react-icons/fa';
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
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  padding-left: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text}aa;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const UserList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserAvatar = styled.div<{ src: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UserName = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  // Predefined users for quick login
  const users = [
    { id: 1, username: 'russo', password: 'fartblaster', displayName: 'Russo', avatar: 'avatar1.jpg' },
    { id: 2, username: 'stacho', password: 'stinkbomb', displayName: 'Stacho', avatar: 'avatar2.jpg' },
    { id: 3, username: 'tim', password: 'toottoot', displayName: 'Tim', avatar: 'avatar3.jpg' },
    { id: 4, username: 'lucas', password: 'windbreaker', displayName: 'Lucas', avatar: 'avatar4.jpg' },
    { id: 5, username: 'paul', password: 'gasattack', displayName: 'Paul', avatar: 'avatar5.jpg' },
    { id: 6, username: 'dennis', password: 'organizer', displayName: 'Dennis', avatar: 'avatar6.jpg' },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/feed');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickLogin = async (user: typeof users[0]) => {
    setIsLoading(true);
    
    try {
      const success = await login(user.username, user.password);
      if (success) {
        navigate('/feed');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <Logo>OTTER</Logo>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" fullWidth isLoading={isLoading}>
            Login
          </Button>
        </Form>
        
        <UserList>
          {users.map((user) => (
            <UserButton
              key={user.id}
              onClick={() => handleQuickLogin(user)}
              disabled={isLoading}
            >
              <UserAvatar src={getAvatarUrl(user.avatar)} />
              <UserName>{user.displayName}</UserName>
            </UserButton>
          ))}
        </UserList>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
