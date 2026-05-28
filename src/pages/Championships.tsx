import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaMedal, FaChevronDown, FaChevronUp, FaAward, FaCrown, FaStar } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useDatabase } from '../db/DatabaseContext';
import { getAvatarUrl } from '../utils/assetUtils';

interface User {
  id: number;
  username: string;
  display_name: string;
  avatar: string;
}

interface Competition {
  id: number;
  year: number;
  name: string;
  date: string;
}

interface Discipline {
  id: number;
  competition_id: number;
  name: string;
}

interface Result {
  id: number;
  discipline_id: number;
  user_id: number;
  position: number;
  points: number;
  discipline_name?: string;
  user_name?: string;
}

interface Standing {
  user_id: number;
  display_name: string;
  avatar: string;
  total_points: number;
  positions: Record<number, number>; // discipline_id -> position
  first_places: number;
  second_places: number;
  third_places: number;
  disciplines_participated: number;
}

const ChampionshipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  
  @media (min-width: 600px) {
    gap: ${({ theme }) => theme.spacing.lg};
    max-width: 800px;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: 600px) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
  
  @media (min-width: 600px) {
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const YearSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  
  @media (min-width: 600px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const CompetitionInfo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text}aa;
  font-size: 0.8rem;
  
  @media (min-width: 600px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: 0.9rem;
  }
`;

const StandingsCard = styled(Card)`
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.xs};
  
  @media (min-width: 600px) {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border-radius: ${({ theme }) => theme.borderRadius.large};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const StandingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: 1.2rem;
    
    svg {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
  
  @media (min-width: 600px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
    
    h2 {
      gap: ${({ theme }) => theme.spacing.sm};
      font-size: 1.5rem;
    }
  }
`;

const StandingsTable = styled.div`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  font-size: 0.8rem;
  
  @media (min-width: 600px) {
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-size: 1rem;
  }
`;

const StandingsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 50px 60px;
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background};
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (min-width: 600px) {
    grid-template-columns: 60px 1fr 80px 80px 80px 80px;
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const StandingsTableRow = styled.div<{ isChampion?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr 50px 60px;
  padding: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}33;
  transition: all 0.2s ease;
  background-color: ${({ isChampion, theme }) => 
    isChampion ? `${theme.colors.primary}11` : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background}aa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (min-width: 600px) {
    grid-template-columns: 60px 1fr 80px 80px 80px 80px;
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const RankCell = styled.div<{ position: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${({ position, theme }) => {
    if (position === 1) return theme.colors.accent;
    if (position === 2) return '#A0A0A0'; // Silver
    if (position === 3) return '#CD7F32'; // Bronze
    return theme.colors.text;
  }};
  position: relative;
  font-size: 0.9rem;
  
  @media (min-width: 600px) {
    font-size: 1rem;
  }
`;

const RankBadge = styled.div<{ position: number }>`
  position: absolute;
  top: -6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  color: ${({ position, theme }) => {
    if (position === 1) return theme.colors.accent;
    if (position === 2) return '#A0A0A0'; // Silver
    if (position === 3) return '#CD7F32'; // Bronze
    return 'transparent';
  }};
  opacity: ${({ position }) => (position <= 3 ? 1 : 0)};
  font-size: 0.8rem;
  
  @media (min-width: 600px) {
    top: -8px;
    font-size: 1rem;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  white-space: nowrap;
  
  @media (min-width: 600px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const UserAvatar = styled.div<{ src: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  
  @media (min-width: 600px) {
    width: 36px;
    height: 36px;
    border-width: 2px;
  }
`;

const UserName = styled.div`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PointsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const MedalsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: 599px) {
    display: none;
  }
`;

const MedalCount = styled.div<{ type: 'gold' | 'silver' | 'bronze' }>`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ type }) => {
    if (type === 'gold') return '#FFD700';
    if (type === 'silver') return '#A0A0A0';
    return '#CD7F32';
  }};
  font-weight: 600;
  font-size: 0.8rem;
  
  @media (min-width: 600px) {
    font-size: 0.9rem;
  }
`;

const MedalsSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.7rem;
  
  @media (min-width: 600px) {
    display: none;
  }
`;

const SectionTitle = styled.h2`
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 1.2rem;
  
  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
  
  @media (min-width: 600px) {
    margin-top: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 1.5rem;
  }
`;

const DisciplinesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: 600px) {
    gap: ${({ theme }) => theme.spacing.md};
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DisciplineCard = styled(Card)<{ isOpen: boolean }>`
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  @media (min-width: 600px) {
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.large};
    transform: ${({ isOpen }) => isOpen ? 'scale(1.02)' : 'scale(1)'};
    box-shadow: ${({ theme, isOpen }) => 
      isOpen ? theme.shadows.medium : theme.shadows.small};
      
    &:hover {
      transform: ${({ isOpen }) => isOpen ? 'scale(1.02)' : 'translateY(-2px)'};
    }
  }
`;

const DisciplineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (min-width: 600px) {
    padding-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const DisciplineTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (min-width: 600px) {
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 1.2rem;
  }
`;

const DisciplineIcon = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  
  @media (min-width: 600px) {
    width: 24px;
    height: 24px;
  }
`;

const ToggleIcon = styled.div`
  color: ${({ theme }) => theme.colors.text}aa;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DisciplineResults = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing.sm : '0')};
  border-top: ${({ isOpen, theme }) => (isOpen ? `1px solid ${theme.colors.border}` : 'none')};
  padding-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing.sm : '0')};
  
  @media (min-width: 600px) {
    margin-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing.md : '0')};
    padding-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing.md : '0')};
  }
`;

const ResultItem = styled.div<{ position: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ position, theme }) => {
    if (position === 1) return `${theme.colors.accent}11`;
    if (position === 2) return 'rgba(160, 160, 160, 0.1)';
    if (position === 3) return 'rgba(205, 127, 50, 0.1)';
    return 'transparent';
  }};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 0.8rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (min-width: 600px) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: 1rem;
  }
`;

const ResultPosition = styled.div<{ position: number }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: 600;
  
  svg {
    color: ${({ position }) => {
      if (position === 1) return '#FFD700';
      if (position === 2) return '#A0A0A0';
      if (position === 3) return '#CD7F32';
      return 'transparent';
    }};
    font-size: 0.8rem;
    
    @media (min-width: 600px) {
      font-size: 1rem;
    }
  }
`;

const ResultPoints = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: 600px) {
    min-height: 300px;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  @media (min-width: 600px) {
    height: 20px;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text}aa;
  font-size: 0.9rem;
  
  @media (min-width: 600px) {
    padding: ${({ theme }) => theme.spacing.lg};
    font-size: 1rem;
  }
`;

const Championships: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDisciplineId, setOpenDisciplineId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { executeQuery } = useDatabase();
  
  // Fetch competitions
  useEffect(() => {
    const fetchCompetitions = () => {
      try {
        const competitionsData = executeQuery(`
          SELECT * FROM competitions
          ORDER BY year DESC
        `);
        
        setCompetitions(competitionsData);
        
        // Select the most recent competition by default
        if (competitionsData.length > 0) {
          setSelectedCompetition(competitionsData[0]);
        }
      } catch (err) {
        console.error('Error fetching competitions:', err);
      }
    };
    
    fetchCompetitions();
  }, [executeQuery]);
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = () => {
      try {
        const usersData = executeQuery(`
          SELECT id, username, display_name, avatar FROM users
        `);
        
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    
    fetchUsers();
  }, [executeQuery]);
  
  // Fetch disciplines and results for selected competition
  useEffect(() => {
    const fetchCompetitionData = async () => {
      if (!selectedCompetition) return;
      
      setIsLoading(true);
      
      try {
        // Fetch disciplines
        const disciplinesData = executeQuery(`
          SELECT * FROM disciplines
          WHERE competition_id = ?
          ORDER BY id
        `, [selectedCompetition.id]);
        
        setDisciplines(disciplinesData);
        
        // Fetch results
        const resultsData = executeQuery(`
          SELECT r.*, d.name as discipline_name, u.display_name as user_name
          FROM results r
          JOIN disciplines d ON r.discipline_id = d.id
          JOIN users u ON r.user_id = u.id
          WHERE d.competition_id = ?
          ORDER BY r.discipline_id, r.position
        `, [selectedCompetition.id]);
        
        setResults(resultsData);
        
        // Calculate standings
        calculateStandings(disciplinesData, resultsData);
      } catch (err) {
        console.error('Error fetching competition data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompetitionData();
  }, [selectedCompetition, executeQuery]);
  
  // Calculate standings from results
  const calculateStandings = (disciplines: Discipline[], results: Result[]) => {
    // Group results by user
    const userResults: Record<number, Result[]> = {};
    
    results.forEach(result => {
      if (!userResults[result.user_id]) {
        userResults[result.user_id] = [];
      }
      userResults[result.user_id].push(result);
    });
    
    // Calculate total points and positions for each user
    const calculatedStandings: Standing[] = users.map(user => {
      const userResultsList = userResults[user.id] || [];
      const totalPoints = userResultsList.reduce((sum, result) => sum + result.points, 0);
      
      // Create positions map (discipline_id -> position)
      const positions: Record<number, number> = {};
      userResultsList.forEach(result => {
        positions[result.discipline_id] = result.position;
      });
      
      // Count medal positions
      const firstPlaces = userResultsList.filter(r => r.position === 1).length;
      const secondPlaces = userResultsList.filter(r => r.position === 2).length;
      const thirdPlaces = userResultsList.filter(r => r.position === 3).length;
      
      return {
        user_id: user.id,
        display_name: user.display_name,
        avatar: user.avatar,
        total_points: totalPoints,
        positions,
        first_places: firstPlaces,
        second_places: secondPlaces,
        third_places: thirdPlaces,
        disciplines_participated: userResultsList.length
      };
    });
    
    // Sort by total points (descending)
    calculatedStandings.sort((a, b) => b.total_points - a.total_points);
    
    setStandings(calculatedStandings);
  };
  
  // Toggle discipline results visibility
  const toggleDiscipline = (disciplineId: number) => {
    if (openDisciplineId === disciplineId) {
      setOpenDisciplineId(null);
    } else {
      setOpenDisciplineId(disciplineId);
    }
  };
  
  // Get results for a specific discipline
  const getDisciplineResults = (disciplineId: number) => {
    return results
      .filter(result => result.discipline_id === disciplineId)
      .sort((a, b) => a.position - b.position);
  };
  
  // Get medal icon based on position
  const getMedalIcon = (position: number) => {
    if (position === 1) return <FaCrown />;
    if (position === 2) return <FaMedal />;
    if (position === 3) return <FaMedal />;
    return null;
  };
  
  // Get discipline icon
  const getDisciplineIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('geoguessr')) return <FaAward />;
    if (lowerName.includes('lieder')) return <FaStar />;
    if (lowerName.includes('baseball')) return <FaStar />;
    if (lowerName.includes('wakeboard')) return <FaStar />;
    return <FaTrophy />;
  };
  
  if (isLoading && !selectedCompetition) {
    return (
      <Layout title="Championships">
        <LoadingContainer>
          <LoadingPlaceholder style={{ width: '150px', height: '30px' }} />
          <LoadingPlaceholder style={{ width: '100%', height: '150px' }} />
          <LoadingPlaceholder style={{ width: '100%', height: '80px' }} />
          <LoadingPlaceholder style={{ width: '100%', height: '80px' }} />
        </LoadingContainer>
      </Layout>
    );
  }
  
  return (
    <Layout title="Championships">
      <ChampionshipsContainer>
        <PageHeader>
          <PageTitle>
            <FaTrophy />
            Championships
          </PageTitle>
          
          {/* Year selector */}
          <YearSelector>
            {competitions.map(competition => (
              <Button
                key={competition.id}
                variant={selectedCompetition?.id === competition.id ? 'primary' : 'outline'}
                size="small"
                onClick={() => setSelectedCompetition(competition)}
              >
                {/* Display 2024 instead of 2025 for the Otter Challenge */}
                {competition.id === 1 ? 2024 : competition.year}
              </Button>
            ))}
          </YearSelector>
          
          {selectedCompetition && (
            <CompetitionInfo>
              {selectedCompetition.name} 
              {/* Display 2024 instead of 2025 for the Otter Challenge */}
              {selectedCompetition.id === 1 ? ' 2024' : ` ${selectedCompetition.year}`}
            </CompetitionInfo>
          )}
        </PageHeader>
        
        {/* Overall standings */}
        <StandingsCard>
          <StandingsHeader>
            <h2>
              <FaTrophy />
              Overall Standings
            </h2>
          </StandingsHeader>
          
          {standings.length > 0 ? (
            <StandingsTable>
              <StandingsTableHeader>
                <div>Rank</div>
                <div>User</div>
                <div>Pts</div>
                <div>Medals</div>
                <div>1st</div>
                <div>2nd</div>
                <div>3rd</div>
              </StandingsTableHeader>
              
              {standings.map((standing, index) => (
                <StandingsTableRow 
                  key={standing.user_id}
                  isChampion={index === 0}
                >
                  <RankCell position={index + 1}>
                    <RankBadge position={index + 1}>
                      {index === 0 ? <FaCrown /> : <FaMedal />}
                    </RankBadge>
                    {index + 1}
                  </RankCell>
                  
                  <UserCell>
                    <UserAvatar src={getAvatarUrl(standing.avatar)} />
                    <UserName>{standing.display_name}</UserName>
                  </UserCell>
                  
                  <PointsCell>{standing.total_points}</PointsCell>
                  
                  <MedalsSummary>
                    <MedalCount type="gold">{standing.first_places}</MedalCount>
                    <MedalCount type="silver">{standing.second_places}</MedalCount>
                    <MedalCount type="bronze">{standing.third_places}</MedalCount>
                  </MedalsSummary>
                  
                  <MedalsCell>
                    <MedalCount type="gold">{standing.first_places}</MedalCount>
                  </MedalsCell>
                  
                  <MedalsCell>
                    <MedalCount type="silver">{standing.second_places}</MedalCount>
                  </MedalsCell>
                  
                  <MedalsCell>
                    <MedalCount type="bronze">{standing.third_places}</MedalCount>
                  </MedalsCell>
                </StandingsTableRow>
              ))}
            </StandingsTable>
          ) : (
            <NoDataMessage>No standings data available</NoDataMessage>
          )}
        </StandingsCard>
        
        {/* Disciplines */}
        <SectionTitle>
          <FaAward />
          Disciplines
        </SectionTitle>
        
        {disciplines.length > 0 ? (
          <DisciplinesList>
            {disciplines.map(discipline => (
              <DisciplineCard 
                key={discipline.id} 
                onClick={() => toggleDiscipline(discipline.id)}
                isOpen={openDisciplineId === discipline.id}
              >
                <DisciplineHeader>
                  <DisciplineTitle>
                    <DisciplineIcon>
                      {getDisciplineIcon(discipline.name)}
                    </DisciplineIcon>
                    {discipline.name}
                  </DisciplineTitle>
                  
                  <ToggleIcon>
                    {openDisciplineId === discipline.id ? <FaChevronUp /> : <FaChevronDown />}
                  </ToggleIcon>
                </DisciplineHeader>
                
                <DisciplineResults isOpen={openDisciplineId === discipline.id}>
                  {getDisciplineResults(discipline.id).map(result => (
                    <ResultItem key={result.id} position={result.position}>
                      <UserCell>
                        <ResultPosition position={result.position}>
                          {getMedalIcon(result.position)}
                          {result.position}
                        </ResultPosition>
                        <UserAvatar 
                          src={getAvatarUrl(`avatar${result.user_id}.jpg`)}
                        />
                        {result.user_name}
                      </UserCell>
                      <ResultPoints>{result.points} pts</ResultPoints>
                    </ResultItem>
                  ))}
                </DisciplineResults>
              </DisciplineCard>
            ))}
          </DisciplinesList>
        ) : (
          <NoDataMessage>No disciplines available for this competition</NoDataMessage>
        )}
      </ChampionshipsContainer>
    </Layout>
  );
};

export default Championships;
