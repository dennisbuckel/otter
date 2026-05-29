import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaTrophy, FaLock, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/assetUtils';

// ─── Animationen ──────────────────────────────────────────────────────────────
const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  15%  { transform: translateX(-8px); }
  30%  { transform: translateX(8px); }
  45%  { transform: translateX(-6px); }
  60%  { transform: translateX(6px); }
  75%  { transform: translateX(-3px); }
  90%  { transform: translateX(3px); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  overflow: hidden;
  animation: ${slideUp} 0.4s ease;
`;

const CardHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const Logo = styled.div`
  font-size: 2.4rem;
  font-weight: 900;
  color: white;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  svg { font-size: 2rem; }
`;

const Tagline = styled.p`
  color: rgba(255,255,255,0.8);
  margin-top: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
`;

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
`;

const SectionLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 360px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const UserBtn = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ $selected, theme }) =>
    $selected ? `${theme.colors.primary}15` : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}10`};
    transform: translateY(-2px);
  }

  &:active { transform: translateY(0); }
`;

const Avatar = styled.div<{ src: string; $selected: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : 'transparent'};
  box-shadow: ${({ $selected, theme }) =>
    $selected ? `0 0 0 3px ${theme.colors.primary}40` : 'none'};
  transition: all 0.2s ease;

  @media (max-width: 360px) {
    width: 44px;
    height: 44px;
  }
`;

const UserName = styled.span<{ $selected: boolean }>`
  font-size: 0.7rem;
  font-weight: ${({ $selected }) => $selected ? '700' : '500'};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.text};
  transition: all 0.2s ease;
`;

const PasswordSection = styled.div<{ $visible: boolean; $shake: boolean }>`
  animation: ${({ $shake }) => $shake ? shake : 'none'} 0.5s ease;
  display: ${({ $visible }) => $visible ? 'block' : 'none'};
`;

const PasswordLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  margin-bottom: 8px;

  svg { font-size: 0.75rem; }
`;

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PasswordInput = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted ?? '#aaa'}; }
`;

const LoginBtn = styled.button<{ $loading?: boolean }>`
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: ${({ $loading }) => $loading ? 'wait' : 'pointer'};
  opacity: ${({ $loading }) => $loading ? 0.7 : 1};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-1px);
  }
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// ─── User-Daten ──────────────────────────────────────────────────────────────
const USERS = [
  { id: 1, username: 'russo',  password: 'fartblaster', displayName: 'Russo',  avatar: 'avatar1.jpg' },
  { id: 2, username: 'stacho', password: 'stinkbomb',   displayName: 'Stacho', avatar: 'avatar2.jpg' },
  { id: 3, username: 'tim',    password: 'toottoot',    displayName: 'Tim',    avatar: 'avatar3.jpg' },
  { id: 4, username: 'lucas',  password: 'windbreaker', displayName: 'Lucas',  avatar: 'avatar4.jpg' },
  { id: 5, username: 'paul',   password: 'gasattack',   displayName: 'Paul',   avatar: 'avatar5.jpg' },
  { id: 6, username: 'dennis', password: 'organizer',   displayName: 'Dennis', avatar: 'avatar6.jpg' },
  { id: 7, username: 'paddy',  password: 'paddyfart',   displayName: 'Paddy',  avatar: 'avatar7.jpg' },
];

// ─── Komponente ───────────────────────────────────────────────────────────────
const Login: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [password, setPassword]     = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const [doShake, setDoShake]       = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const navigate  = useNavigate();

  // Passwort-Input fokussieren wenn User ausgewählt
  useEffect(() => {
    if (selectedId !== null) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    setPassword('');
    setErrorMsg('');
  }, [selectedId]);

  const handleSelect = (id: number) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedId || !password.trim()) return;

    const user = USERS.find(u => u.id === selectedId)!;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const ok = await login(user.username, password.trim());
      if (ok) {
        navigate('/championships');
      } else {
        setErrorMsg("Falsches Passwort – versuch's nochmal 🙈");
        triggerShake();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setDoShake(true);
    setTimeout(() => setDoShake(false), 600);
  };

  const selectedUser = USERS.find(u => u.id === selectedId);

  return (
    <Page>
      <Card>
        <CardHeader>
          <Logo>
            <FaTrophy />
            OTTER
          </Logo>
          <Tagline>OTTER CHALLENGE · DEIN WETTKAMPF</Tagline>
        </CardHeader>

        <CardBody>
          <SectionLabel>Wer bist du?</SectionLabel>

          <UserGrid>
            {USERS.map(user => (
              <UserBtn
                key={user.id}
                $selected={selectedId === user.id}
                onClick={() => handleSelect(user.id)}
                type="button"
              >
                <Avatar
                  src={getAvatarUrl(user.avatar)}
                  $selected={selectedId === user.id}
                />
                <UserName $selected={selectedId === user.id}>
                  {user.displayName}
                </UserName>
              </UserBtn>
            ))}
          </UserGrid>

          {/* Passwort-Bereich – erscheint wenn User ausgewählt */}
          <PasswordSection
            $visible={selectedId !== null}
            $shake={doShake}
            as="form"
            onSubmit={handleLogin}
          >
            <PasswordLabel htmlFor="pw-input">
              <FaLock />
              Passwort für {selectedUser?.displayName}
            </PasswordLabel>

            <InputRow>
              <PasswordInput
                id="pw-input"
                ref={inputRef}
                type="password"
                placeholder="Passwort eingeben…"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrorMsg(''); }}
                autoComplete="current-password"
              />
              <LoginBtn
                type="submit"
                $loading={isLoading}
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? '…' : <><FaChevronRight /></>}
              </LoginBtn>
            </InputRow>

            {errorMsg && <ErrorMsg>❌ {errorMsg}</ErrorMsg>}
          </PasswordSection>

          <Footer>
            {selectedId ? 'Passwort eingeben und Enter drücken' : 'Tippe auf deinen Avatar'}
          </Footer>
        </CardBody>
      </Card>
    </Page>
  );
};

export default Login;
