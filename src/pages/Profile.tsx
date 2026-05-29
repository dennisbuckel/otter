import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaTrophy, FaSignOutAlt, FaMedal, FaChartLine,
  FaImages, FaFire, FaStar, FaBolt
} from 'react-icons/fa';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../db/DatabaseContext';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl, getPhotoUrlWithFallback } from '../utils/assetUtils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  totalPoints: number; totalCompetitions: number;
  firstPlaces: number; secondPlaces: number; thirdPlaces: number;
  overallRank: number; totalUsers: number;
}

// ─── Styled Components ────────────────────────────────────────────────────────
const Wrap = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

// Hero-Banner
const HeroBanner = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 150px; height: 150px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -30px; left: -20px;
    width: 100px; height: 100px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
  }
`;

const HeroAvatar = styled.div<{ src: string }>`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 4px solid rgba(255,255,255,0.9);
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  position: relative;
  z-index: 1;
`;

const HeroName = styled.h2`
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  margin: 0;
  letter-spacing: 0.02em;
  position: relative; z-index: 1;
`;

const HeroUsername = styled.div`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.75);
  font-weight: 500;
  position: relative; z-index: 1;
`;

const HeroRank = styled.div`
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 4px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.04em;
  position: relative; z-index: 1;
`;

const LogoutBtn = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 2;
  &:hover { background: rgba(255,255,255,0.3); }
`;

// Stats-Grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatVal = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
`;

// Tabs
const TabBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 4px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const TabBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.textMuted ?? '#888'};
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  svg { font-size: 0.9rem; }

  &:hover:not([data-active="true"]) {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TabContent = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.md};
`;

// Podium-Medals Detail
const MedalRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MedalPill = styled.div<{ $color: string }>`
  flex: 1;
  background: ${({ $color }) => $color}18;
  border: 1.5px solid ${({ $color }) => $color}44;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const MedalCount = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const MedalLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
`;

// Efficiency Bar
const EffRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const EffLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const EffTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const EffPct = styled.span`
  font-size: 0.8rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const EffBar = styled.div`
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const EffFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 1s ease;
`;

// Achievements
const AchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AchCard = styled.div<{ $unlocked: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1.5px solid ${({ $unlocked, theme }) =>
    $unlocked ? `${theme.colors.primary}44` : theme.colors.border};
  background: ${({ $unlocked, theme }) =>
    $unlocked ? `${theme.colors.primary}08` : theme.colors.background};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  opacity: ${({ $unlocked }) => $unlocked ? 1 : 0.45};
`;

const AchIcon = styled.div<{ $unlocked: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ $unlocked, theme }) =>
    $unlocked ? theme.colors.primary : theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
`;

const AchText = styled.div``;
const AchTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;
const AchDesc = styled.div`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  margin-top: 1px;
`;

// Photos Grid
const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PhotoThumb = styled.div<{ src: string }>`
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.03); }
`;

const Empty = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  font-size: 0.85rem;
`;

// ─── Komponente ───────────────────────────────────────────────────────────────
const Profile: React.FC = () => {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [photos, setPhotos]     = useState<any[]>([]);
  const [activeTab, setTab]     = useState<'stats' | 'achievements' | 'photos'>('stats');

  const { currentUser, logout } = useAuth();
  const { executeQuery }        = useDatabase();
  const navigate                = useNavigate();

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }

    try {
      // Gesamtpunkte
      const pts = executeQuery(
        'SELECT COALESCE(SUM(points),0) as tp FROM results WHERE user_id = ?',
        [currentUser.id]
      )[0]?.tp ?? 0;

      // Podium
      const pod = executeQuery(`
        SELECT
          SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) as fp,
          SUM(CASE WHEN position = 2 THEN 1 ELSE 0 END) as sp,
          SUM(CASE WHEN position = 3 THEN 1 ELSE 0 END) as tp,
          COUNT(DISTINCT discipline_id) as tc
        FROM results WHERE user_id = ?
      `, [currentUser.id])[0];

      // Gesamtrang (alle Teilnehmer mit Punkten)
      const allRanks = executeQuery(`
        SELECT user_id, SUM(points) as total
        FROM results GROUP BY user_id ORDER BY total DESC
      `);
      const myRankIdx = allRanks.findIndex((r: any) => r.user_id === currentUser.id);

      setStats({
        totalPoints:      pts,
        totalCompetitions: pod?.tc ?? 0,
        firstPlaces:      pod?.fp ?? 0,
        secondPlaces:     pod?.sp ?? 0,
        thirdPlaces:      pod?.tp ?? 0,
        overallRank:      myRankIdx >= 0 ? myRankIdx + 1 : allRanks.length + 1,
        totalUsers:       allRanks.length,
      });

      // Fotos
      const p = executeQuery(
        'SELECT * FROM photos WHERE uploaded_by = ? ORDER BY date_taken DESC',
        [currentUser.id]
      );
      setPhotos(p);
    } catch (e) { console.error(e); }
  }, [currentUser, executeQuery, navigate]);

  if (!currentUser || !stats) {
    return <Layout title="Profil"><Empty>Lade…</Empty></Layout>;
  }

  const maxPossible = stats.totalCompetitions * 5;
  const efficiency  = maxPossible > 0 ? Math.round((stats.totalPoints / maxPossible) * 100) : 0;

  const achievements = [
    {
      id: 1, icon: <FaTrophy />, title: 'Sieger',
      desc: 'Otter Challenge gewonnen',
      unlocked: stats.overallRank === 1,
    },
    {
      id: 2, icon: <FaMedal />, title: 'Gold-Sammler',
      desc: `${stats.firstPlaces}× Platz 1`,
      unlocked: stats.firstPlaces >= 2,
    },
    {
      id: 3, icon: <FaFire />, title: 'On Fire',
      desc: `${stats.totalPoints} Gesamtpunkte`,
      unlocked: stats.totalPoints >= 25,
    },
    {
      id: 4, icon: <FaStar />, title: 'Allrounder',
      desc: `${stats.totalCompetitions} Challenges`,
      unlocked: stats.totalCompetitions >= 8,
    },
    {
      id: 5, icon: <FaBolt />, title: 'Effizienz',
      desc: `${efficiency}% Punkteeffizienz`,
      unlocked: efficiency >= 60,
    },
    {
      id: 6, icon: <FaImages />, title: 'Fotograf',
      desc: `${photos.length} Fotos geteilt`,
      unlocked: photos.length >= 1,
    },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Layout title="Profil">
      <Wrap>
        {/* ── Hero ──────────────────────────────────────── */}
        <HeroBanner>
          <LogoutBtn onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </LogoutBtn>
          <HeroAvatar src={getAvatarUrl(currentUser.avatar)} />
          <HeroName>{currentUser.displayName}</HeroName>
          <HeroUsername>@{currentUser.username}</HeroUsername>
          <HeroRank>
            {stats.overallRank <= stats.totalUsers
              ? `🏆 Platz ${stats.overallRank} von ${stats.totalUsers}`
              : 'Noch keine Teilnahme'}
          </HeroRank>
        </HeroBanner>

        {/* ── Kurzstatistik ─────────────────────────────── */}
        <StatsGrid>
          <StatCard>
            <StatIcon><FaChartLine /></StatIcon>
            <StatVal>{stats.totalPoints}</StatVal>
            <StatLabel>Punkte</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><FaMedal /></StatIcon>
            <StatVal>{stats.firstPlaces}</StatVal>
            <StatLabel>Siege</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><FaTrophy /></StatIcon>
            <StatVal>#{stats.overallRank}</StatVal>
            <StatLabel>Rang</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* ── Tabs ──────────────────────────────────────── */}
        <TabBar>
          <TabBtn $active={activeTab === 'stats'} onClick={() => setTab('stats')}>
            <FaChartLine /> Stats
          </TabBtn>
          <TabBtn $active={activeTab === 'achievements'} onClick={() => setTab('achievements')}>
            <FaTrophy /> Awards
          </TabBtn>
          <TabBtn $active={activeTab === 'photos'} onClick={() => setTab('photos')}>
            <FaImages /> Fotos
          </TabBtn>
        </TabBar>

        {/* ── Tab-Inhalte ───────────────────────────────── */}
        <TabContent>
          {activeTab === 'stats' && (
            <>
              <MedalRow>
                <MedalPill $color="#FC4C02">
                  <MedalCount>{stats.firstPlaces}</MedalCount>
                  <MedalLabel>🥇 Gold</MedalLabel>
                </MedalPill>
                <MedalPill $color="#A8A8A8">
                  <MedalCount>{stats.secondPlaces}</MedalCount>
                  <MedalLabel>🥈 Silber</MedalLabel>
                </MedalPill>
                <MedalPill $color="#CD7F32">
                  <MedalCount>{stats.thirdPlaces}</MedalCount>
                  <MedalLabel>🥉 Bronze</MedalLabel>
                </MedalPill>
              </MedalRow>

              <EffRow>
                <EffLabel>
                  <EffTitle>Punkteeffizienz</EffTitle>
                  <EffPct>{efficiency}%</EffPct>
                </EffLabel>
                <EffBar><EffFill $pct={efficiency} /></EffBar>
              </EffRow>

              <EffRow style={{ marginTop: 12 }}>
                <EffLabel>
                  <EffTitle>Challenges gespielt</EffTitle>
                  <EffPct>{stats.totalCompetitions}</EffPct>
                </EffLabel>
                <EffBar>
                  <EffFill $pct={Math.round((stats.totalCompetitions / 13) * 100)} />
                </EffBar>
              </EffRow>
            </>
          )}

          {activeTab === 'achievements' && (
            <AchGrid>
              {achievements.map(a => (
                <AchCard key={a.id} $unlocked={a.unlocked}>
                  <AchIcon $unlocked={a.unlocked}>{a.icon}</AchIcon>
                  <AchText>
                    <AchTitle>{a.title}</AchTitle>
                    <AchDesc>{a.desc}</AchDesc>
                  </AchText>
                </AchCard>
              ))}
            </AchGrid>
          )}

          {activeTab === 'photos' && (
            photos.length > 0 ? (
              <PhotoGrid>
                {photos.map((p: any) => (
                  <PhotoThumb
                    key={p.id}
                    src={getPhotoUrlWithFallback(p.url, p.id)}
                    onClick={() => navigate('/feed')}
                  />
                ))}
              </PhotoGrid>
            ) : (
              <Empty>Noch keine Fotos hochgeladen.</Empty>
            )
          )}
        </TabContent>
      </Wrap>
    </Layout>
  );
};

export default Profile;
