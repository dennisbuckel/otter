import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaSignOutAlt, FaCamera, FaMedal, FaChartLine, FaImages, FaCog, FaUser } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../db/DatabaseContext';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl, getPhotoUrlWithFallback } from '../utils/assetUtils';

interface UserStats {
  totalPoints: number;
  championships: number;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  totalCompetitions: number;
}

interface UserPhoto {
  id: number;
  url: string;
  description: string;
  date_taken: string;
  likes_count: number;
  comments_count: number;
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileCover = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.large} ${({ theme }) => theme.borderRadius.large} 0 0;
  position: relative;
  overflow: hidden;
`;

const ProfileHeader = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 80px;
  margin-top: -80px;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.large} ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const AvatarContainer = styled.div`
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const Avatar = styled.div<{ src: string }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 5px solid ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const AvatarBadge = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const UserName = styled.h2`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
`;

const Username = styled.div`
  color: ${({ theme }) => theme.colors.text}aa;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
`;

const UserBio = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.md} 0;
  max-width: 80%;
  line-height: 1.5;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  min-width: 100px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text}aa;
  font-weight: 500;
`;

const StatIcon = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.3rem;
  
  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PhotoItem = styled.div<{ src: string }>`
  aspect-ratio: 1;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    
    &::after {
      opacity: 1;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const PhotoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  color: white;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${PhotoItem}:hover & {
    opacity: 1;
  }
`;

const PhotoStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.8rem;
`;

const PhotoStat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AchievementContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Achievement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
`;

const AchievementIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}22;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const AchievementTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

const AchievementDescription = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text}aa;
  text-align: center;
`;

const EfficiencyMeter = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const EfficiencyFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  background-color: ${({ theme, percent }) => 
    percent > 75 ? theme.colors.success :
    percent > 50 ? theme.colors.accent :
    percent > 25 ? theme.colors.secondary :
    theme.colors.error
  };
  border-radius: 4px;
  transition: width 1s ease-in-out;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const LogoutButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const Profile: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('stats');
  
  const { currentUser, logout } = useAuth();
  const { executeQuery } = useDatabase();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = () => {
      if (!currentUser) return;
      
      try {
        // Get total points
        const totalPointsResult = executeQuery(`
          SELECT SUM(points) as total_points
          FROM results
          WHERE user_id = ?
        `, [currentUser.id])[0];
        
        // Get number of championships won
        const championshipsResult = executeQuery(`
          SELECT COUNT(DISTINCT d.competition_id) as championships
          FROM results r
          JOIN disciplines d ON r.discipline_id = d.id
          WHERE r.user_id = ? AND r.position = 1
          GROUP BY d.competition_id
          HAVING SUM(r.points) = (
            SELECT MAX(total_points)
            FROM (
              SELECT user_id, SUM(points) as total_points
              FROM results
              JOIN disciplines ON results.discipline_id = disciplines.id
              WHERE disciplines.competition_id = d.competition_id
              GROUP BY user_id
            )
          )
        `, [currentUser.id]);
        
        // Get podium finishes
        const podiumResults = executeQuery(`
          SELECT 
            SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) as first_places,
            SUM(CASE WHEN position = 2 THEN 1 ELSE 0 END) as second_places,
            SUM(CASE WHEN position = 3 THEN 1 ELSE 0 END) as third_places,
            COUNT(DISTINCT discipline_id) as total_competitions
          FROM results
          WHERE user_id = ?
        `, [currentUser.id])[0];
        
        setUserStats({
          totalPoints: totalPointsResult.total_points || 0,
          championships: championshipsResult.length || 0,
          firstPlaces: podiumResults.first_places || 0,
          secondPlaces: podiumResults.second_places || 0,
          thirdPlaces: podiumResults.third_places || 0,
          totalCompetitions: podiumResults.total_competitions || 0
        });
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    };
    
    // Fetch user photos
    const fetchUserPhotos = () => {
      if (!currentUser) return;
      
      try {
        const photosData = executeQuery(`
          SELECT 
            p.*,
            (SELECT COUNT(*) FROM likes WHERE photo_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE photo_id = p.id) as comments_count
          FROM photos p
          WHERE p.uploaded_by = ?
          ORDER BY p.date_taken DESC
        `, [currentUser.id]);
        
        setUserPhotos(photosData);
      } catch (err) {
        console.error('Error fetching user photos:', err);
      }
    };
    
    if (currentUser) {
      setIsLoading(true);
      fetchUserStats();
      fetchUserPhotos();
      setIsLoading(false);
    }
  }, [currentUser, executeQuery]);
  
  // Calculate achievements based on stats
  const getAchievements = () => {
    if (!userStats) return [];
    
    // Special case for Paul (user_id 5) who won the championship
    const isChampion = currentUser?.id === 5 || userStats.championships > 0;
    
    const achievements = [
      {
        id: 1,
        title: 'Champion',
        description: 'Won the Otter Challenge',
        icon: <FaTrophy />,
        unlocked: isChampion
      },
      {
        id: 2,
        title: 'Gold Collector',
        description: `Earned ${userStats.firstPlaces} first place finishes`,
        icon: <FaMedal />,
        unlocked: userStats.firstPlaces >= 3
      },
      {
        id: 3,
        title: 'Point Hoarder',
        description: `Accumulated ${userStats.totalPoints} total points`,
        icon: <FaChartLine />,
        unlocked: userStats.totalPoints >= 50
      },
      {
        id: 4,
        title: 'Photographer',
        description: `Shared ${userPhotos.length} photos`,
        icon: <FaCamera />,
        unlocked: userPhotos.length >= 3
      },
      {
        id: 5,
        title: 'All-Rounder',
        description: 'Participated in all disciplines',
        icon: <FaUser />,
        unlocked: userStats.totalCompetitions >= 4
      },
      {
        id: 6,
        title: 'Efficiency Expert',
        description: `${Math.round((userStats.totalPoints / (userStats.totalCompetitions * 5)) * 100)}% point efficiency`,
        icon: <FaChartLine />,
        unlocked: (userStats.totalPoints / (userStats.totalCompetitions * 5)) >= 0.7
      }
    ];
    
    return achievements;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!currentUser || isLoading) {
    return (
      <Layout title="Profile">
        <LoadingContainer>
          <LoadingPlaceholder style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
          <LoadingPlaceholder style={{ width: '200px' }} />
          <LoadingPlaceholder style={{ width: '150px' }} />
          <LoadingPlaceholder style={{ width: '100%', height: '100px', marginTop: '20px' }} />
          <LoadingPlaceholder style={{ width: '100%', height: '200px', marginTop: '20px' }} />
        </LoadingContainer>
      </Layout>
    );
  }
  
  const efficiency = userStats ? Math.round((userStats.totalPoints / (userStats.totalCompetitions * 5)) * 100) : 0;
  const achievements = getAchievements();
  
  return (
    <Layout title="Profile">
      <ProfileContainer>
        <ProfileCover />
        
        <ProfileHeader>
          <AvatarContainer>
            <Avatar src={getAvatarUrl(currentUser.avatar)} />
            {/* Show trophy badge for Paul or users with championships */}
            {(currentUser.id === 5 || (userStats && userStats.championships > 0)) && (
              <AvatarBadge>
                <FaTrophy />
              </AvatarBadge>
            )}
          </AvatarContainer>
          
          <UserName>{currentUser.displayName}</UserName>
          <Username>@{currentUser.username}</Username>
          
          <StatsContainer>
            <StatItem>
              <StatIcon><FaTrophy /></StatIcon>
              <StatValue>{userStats?.totalPoints || 0}</StatValue>
              <StatLabel>Total Points</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatIcon><FaMedal /></StatIcon>
              <StatValue>{userStats?.firstPlaces || 0}</StatValue>
              <StatLabel>1st Places</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatIcon><FaChartLine /></StatIcon>
              <StatValue>{userStats?.championships || 0}</StatValue>
              <StatLabel>Championships</StatLabel>
            </StatItem>
          </StatsContainer>
          
          <ButtonsContainer>
            <LogoutButton 
              variant="outline" 
              onClick={handleLogout}
              icon={<FaSignOutAlt />}
            >
              Logout
            </LogoutButton>
          </ButtonsContainer>
        </ProfileHeader>
        
        <Card>
          <TabsContainer>
            <Tab 
              active={activeTab === 'stats'} 
              onClick={() => setActiveTab('stats')}
            >
              <FaChartLine />
              Stats
            </Tab>
            <Tab 
              active={activeTab === 'photos'} 
              onClick={() => setActiveTab('photos')}
            >
              <FaImages />
              Photos
            </Tab>
            <Tab 
              active={activeTab === 'achievements'} 
              onClick={() => setActiveTab('achievements')}
            >
              <FaTrophy />
              Achievements
            </Tab>
          </TabsContainer>
          
          {activeTab === 'stats' && (
            <>
              <SectionTitle>
                <FaTrophy />
                Competition Stats
              </SectionTitle>
              
              <StatsContainer>
                <StatItem>
                  <StatValue>{userStats?.firstPlaces || 0}</StatValue>
                  <StatLabel>1st Places</StatLabel>
                </StatItem>
                
                <StatItem>
                  <StatValue>{userStats?.secondPlaces || 0}</StatValue>
                  <StatLabel>2nd Places</StatLabel>
                </StatItem>
                
                <StatItem>
                  <StatValue>{userStats?.thirdPlaces || 0}</StatValue>
                  <StatLabel>3rd Places</StatLabel>
                </StatItem>
                
                <StatItem>
                  <StatValue>{efficiency}%</StatValue>
                  <StatLabel>Efficiency</StatLabel>
                  <EfficiencyMeter>
                    <EfficiencyFill percent={efficiency} />
                  </EfficiencyMeter>
                </StatItem>
              </StatsContainer>
            </>
          )}
          
          {activeTab === 'photos' && (
            <>
              <SectionTitle>
                <FaCamera />
                My Photos ({userPhotos.length})
              </SectionTitle>
              
              {userPhotos.length > 0 ? (
                <PhotosGrid>
                  {userPhotos.map(photo => (
                    <PhotoItem 
                      key={photo.id} 
                      src={getPhotoUrlWithFallback(photo.url, photo.id)}
                      onClick={() => navigate(`/feed?photo=${photo.id}`)}
                    >
                      <PhotoInfo>
                        <PhotoStats>
                          <PhotoStat>❤️ {photo.likes_count}</PhotoStat>
                          <PhotoStat>💬 {photo.comments_count}</PhotoStat>
                        </PhotoStats>
                      </PhotoInfo>
                    </PhotoItem>
                  ))}
                </PhotosGrid>
              ) : (
                <div>No photos uploaded yet.</div>
              )}
            </>
          )}
          
          {activeTab === 'achievements' && (
            <>
              <SectionTitle>
                <FaTrophy />
                Achievements
              </SectionTitle>
              
              <AchievementContainer>
                {achievements.map(achievement => (
                  <Achievement key={achievement.id} style={{ opacity: achievement.unlocked ? 1 : 0.5 }}>
                    <AchievementIcon>
                      {achievement.icon}
                    </AchievementIcon>
                    <AchievementTitle>{achievement.title}</AchievementTitle>
                    <AchievementDescription>{achievement.description}</AchievementDescription>
                  </Achievement>
                ))}
              </AchievementContainer>
            </>
          )}
        </Card>
      </ProfileContainer>
    </Layout>
  );
};

export default Profile;
