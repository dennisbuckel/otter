import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPalette, FaInfoCircle, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const SettingItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.div`
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SettingDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text}aa;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ThemeOptions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const ThemeOption = styled.div<{ isActive: boolean; themeColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ themeColor }) => themeColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'transparent'};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const ThemeName = styled.div`
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const AboutSection = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Version = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text}aa;
`;

const Settings: React.FC = () => {
  const { themeType, setTheme } = useTheme();
  const { currentUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  
  return (
    <Layout title="Settings">
      <SettingsContainer>
        <Card>
          <SectionTitle>
            <FaPalette />
            Appearance
          </SectionTitle>
          
          <SettingItem>
            <SettingLabel>Theme</SettingLabel>
            <SettingDescription>
              Choose a theme for the application
            </SettingDescription>
            
            <ThemeOptions>
              <ThemeOption 
                isActive={themeType === 'light'} 
                themeColor="#3F51B5"
                onClick={() => setTheme('light')}
              >
                <ThemeName>Light</ThemeName>
              </ThemeOption>
              
              <ThemeOption 
                isActive={themeType === 'dark'} 
                themeColor="#1A202C"
                onClick={() => setTheme('dark')}
              >
                <ThemeName>Dark</ThemeName>
              </ThemeOption>
              
              <ThemeOption 
                isActive={themeType === 'fun'} 
                themeColor="#F59E0B"
                onClick={() => setTheme('fun')}
              >
                <ThemeName>Amber</ThemeName>
              </ThemeOption>
              
              <ThemeOption 
                isActive={themeType === 'ocean'} 
                themeColor="#0EA5E9"
                onClick={() => setTheme('ocean')}
              >
                <ThemeName>Ocean</ThemeName>
              </ThemeOption>
            </ThemeOptions>
          </SettingItem>
        </Card>
        
        <Card>
          <SectionTitle>
            <FaShieldAlt />
            Privacy
          </SectionTitle>
          
          <SettingItem>
            <SettingLabel>Notifications</SettingLabel>
            <SettingDescription>
              Enable or disable notifications
            </SettingDescription>
            
            <Button
              variant={notificationsEnabled ? 'primary' : 'outline'}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>Data Usage</SettingLabel>
            <SettingDescription>
              This app stores data locally on your device. No data is sent to external servers.
            </SettingDescription>
          </SettingItem>
        </Card>
        
        <Card>
          <SectionTitle>
            <FaInfoCircle />
            About
          </SectionTitle>
          
          <AboutSection>
            <p>
              OTTER is a private social network for a group of 6 friends to track their championship stats and share memories through photos.
            </p>
            
            <p>
              This application was created as a personal project and is not intended for public use.
            </p>
            
            <Version>Version 1.0.0</Version>
          </AboutSection>
        </Card>
        
        <Card>
          <SectionTitle>
            <FaQuestionCircle />
            Help
          </SectionTitle>
          
          <SettingItem>
            <SettingLabel>How to use</SettingLabel>
            <SettingDescription>
              Navigate between the Championships, Feed, and Profile sections using the navigation bar at the bottom of the screen.
            </SettingDescription>
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>Championships</SettingLabel>
            <SettingDescription>
              View competition results, standings, and discipline details.
            </SettingDescription>
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>Feed</SettingLabel>
            <SettingDescription>
              Browse photos, like and comment on them.
            </SettingDescription>
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>Profile</SettingLabel>
            <SettingDescription>
              View your stats, achievements, and uploaded photos.
            </SettingDescription>
          </SettingItem>
        </Card>
      </SettingsContainer>
    </Layout>
  );
};

export default Settings;
