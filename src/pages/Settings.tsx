import React from 'react';
import styled from 'styled-components';
import { FaPalette, FaInfoCircle, FaDatabase, FaQuestionCircle } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ThemeType } from '../styles/theme';

// ─── Styled Components ────────────────────────────────────────────────────────
const Wrap = styled.div`
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 14px ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};

  svg { color: ${({ theme }) => theme.colors.primary}; font-size: 1rem; }
`;

const SettingRow = styled.div`
  padding: 14px ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}55;
  &:last-child { border-bottom: none; }
`;

const RowLabel = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3px;
`;

const RowDesc = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  line-height: 1.4;
`;

// Theme-Picker
const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ThemeTile = styled.button<{ $bg: string; $active: boolean }>`
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ $bg }) => $bg};
  border: 3px solid ${({ $active, theme }) => $active ? theme.colors.text : 'transparent'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover { transform: scale(1.05); }
`;

const TileName = styled.span`
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  text-transform: uppercase;
`;

const TileCheck = styled.span`
  font-size: 0.9rem;
`;

// Version-Badge
const VersionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 3px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  margin-top: 8px;
`;

// ─── Theme-Konfiguration ──────────────────────────────────────────────────────
const THEMES: { id: ThemeType; name: string; bg: string; emoji: string }[] = [
  { id: 'light', name: 'Sport',  bg: '#FC4C02', emoji: '🏃' },
  { id: 'dark',  name: 'Dark',   bg: '#0D0D0D', emoji: '🌙' },
  { id: 'fun',   name: 'Amber',  bg: '#F59E0B', emoji: '🔥' },
  { id: 'ocean', name: 'Ocean',  bg: '#0EA5E9', emoji: '🌊' },
];

// ─── Komponente ───────────────────────────────────────────────────────────────
const Settings: React.FC = () => {
  const { themeType, setTheme } = useTheme();
  const { currentUser }         = useAuth();

  return (
    <Layout title="Settings">
      <Wrap>
        {/* ── Appearance ────────────────────────────── */}
        <Section>
          <SectionHeader><FaPalette /> Erscheinungsbild</SectionHeader>
          <SettingRow>
            <RowLabel>Theme</RowLabel>
            <RowDesc>Wähle dein Look &amp; Feel</RowDesc>
            <ThemeGrid>
              {THEMES.map(t => (
                <ThemeTile
                  key={t.id}
                  $bg={t.bg}
                  $active={themeType === t.id}
                  onClick={() => setTheme(t.id)}
                >
                  <TileCheck>{themeType === t.id ? '✓' : t.emoji}</TileCheck>
                  <TileName>{t.name}</TileName>
                </ThemeTile>
              ))}
            </ThemeGrid>
          </SettingRow>
        </Section>

        {/* ── Daten ─────────────────────────────────── */}
        <Section>
          <SectionHeader><FaDatabase /> Daten</SectionHeader>
          <SettingRow>
            <RowLabel>Datenspeicherung</RowLabel>
            <RowDesc>
              Alle Daten werden lokal in deinem Browser gespeichert (SQL.js).
              Keine Daten werden an externe Server übermittelt.
            </RowDesc>
          </SettingRow>
          {currentUser && (
            <SettingRow>
              <RowLabel>Eingeloggt als</RowLabel>
              <RowDesc>
                {currentUser.displayName} · @{currentUser.username}
              </RowDesc>
            </SettingRow>
          )}
        </Section>

        {/* ── About ─────────────────────────────────── */}
        <Section>
          <SectionHeader><FaInfoCircle /> Über OTTER</SectionHeader>
          <SettingRow>
            <RowLabel>OTTER Challenge App</RowLabel>
            <RowDesc>
              Privates Wettkampf-Tracking und Social-Network für die Otter Challenge Gruppe.
              Entstanden als persönliches Projekt – not for public use.
            </RowDesc>
            <VersionBadge>Version 2.0.0 · Jahr 2</VersionBadge>
          </SettingRow>
        </Section>

        {/* ── Hilfe ─────────────────────────────────── */}
        <Section>
          <SectionHeader><FaQuestionCircle /> Hilfe</SectionHeader>
          <SettingRow>
            <RowLabel>🏆 Ranking</RowLabel>
            <RowDesc>Gesamtpunkte aller Challenges. Podium für Top 3. Jede Challenge aufklappbar.</RowDesc>
          </SettingRow>
          <SettingRow>
            <RowLabel>📸 Feed</RowLabel>
            <RowDesc>Fotos liken und kommentieren. Tippe auf das Herz oder die Sprechblase.</RowDesc>
          </SettingRow>
          <SettingRow>
            <RowLabel>👤 Profil</RowLabel>
            <RowDesc>Deine Stats, Achievements und Fotos auf einen Blick.</RowDesc>
          </SettingRow>
          <SettingRow>
            <RowLabel>🔑 Login</RowLabel>
            <RowDesc>Avatar antippen, Passwort eingeben, Enter drücken – fertig.</RowDesc>
          </SettingRow>
        </Section>
      </Wrap>
    </Layout>
  );
};

export default Settings;
