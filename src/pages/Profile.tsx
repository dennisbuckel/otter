import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaSignOutAlt, FaCamera } from 'react-icons/fa';
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
  max-width: 600px;
  margin: 0 auto;
`;

const ProfileHeader = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.div<{ src: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 4px solid ${({ theme }) => theme.colors.primary};
`;

const UserName = styled.h2`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const Username = styled.div`
  color: ${({ theme }) => theme.colors.text}aa;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text}aa;
`;

const SectionTitle = styled.h3`
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PhotoItem = styled.div<{ src: string }>`
  aspect-ratio: 1;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoutButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Profile: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
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
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!currentUser || isLoading) {
    return (
      <Layout title="Profile">
        <div>Loading...</div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Profile">
      <ProfileContainer>
        <ProfileHeader>
          <AvatarContainer>
            <Avatar src={getAvatarUrl(currentUser.avatar)} />
          </AvatarContainer>
          
          <UserName>{currentUser.displayName}</UserName>
          <Username>@{currentUser.username}</Username>
          
          <StatsContainer>
            <StatItem>
              <StatValue>{userStats?.totalPoints || 0}</StatValue>
              <StatLabel>Total Points</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>{userStats?.firstPlaces || 0}</StatValue>
              <StatLabel>1st Places</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatValue>{userStats?.championships || 0}</StatValue>
              <StatLabel>Championships</StatLabel>
            </StatItem>
          </StatsContainer>
          
          <LogoutButton 
            variant="outline" 
            onClick={handleLogout}
            icon={<FaSignOutAlt />}
          >
            Logout
          </LogoutButton>
        </ProfileHeader>
        
        <Card>
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
              <StatValue>
                {userStats ? Math.round((userStats.totalPoints / (userStats.totalCompetitions * 5)) * 100) : 0}%
              </StatValue>
              <StatLabel>Efficiency</StatLabel>
            </StatItem>
          </StatsContainer>
        </Card>
        
        <Card>
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
                />
              ))}
            </PhotosGrid>
          ) : (
            <div>No photos uploaded yet.</div>
          )}
        </Card>
      </ProfileContainer>
    </Layout>
  );
};

export default Profile;
