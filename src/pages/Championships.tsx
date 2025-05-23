import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaMedal, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
}

const ChampionshipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const YearSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StandingsCard = styled(Card)`
  overflow: hidden;
`;

const StandingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    
    svg {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

const StandingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm};
    text-align: left;
    
    &:last-child {
      text-align: right;
    }
  }
  
  th {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  tr:hover {
    background-color: ${({ theme }) => theme.colors.background}dd;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserAvatar = styled.div<{ src: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
`;

const Position = styled.span<{ position: number }>`
  font-weight: 600;
  color: ${({ position, theme }) => {
    if (position === 1) return theme.colors.accent;
    if (position === 2) return '#A0A0A0'; // Silver
    if (position === 3) return '#CD7F32'; // Bronze
    return theme.colors.text;
  }};
`;

const Points = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const DisciplinesList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DisciplineCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const DisciplineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DisciplineTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DisciplineResults = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing.md : '0')};
  border-top: ${({ isOpen, theme }) => (isOpen ? `1px solid ${theme.colors.border}` : 'none')};
  padding-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing.md : '0')};
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}33;
  }
`;

const ResultPosition = styled.div<{ position: number }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ position, theme }) => {
      if (position === 1) return theme.colors.accent;
      if (position === 2) return '#A0A0A0'; // Silver
      if (position === 3) return '#CD7F32'; // Bronze
      return 'transparent';
    }};
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
      
      return {
        user_id: user.id,
        display_name: user.display_name,
        avatar: user.avatar,
        total_points: totalPoints,
        positions
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
    if (position === 1) return <FaTrophy />;
    if (position === 2 || position === 3) return <FaMedal />;
    return null;
  };
  
  if (isLoading && !selectedCompetition) {
    return (
      <Layout title="Championships">
        <div>Loading...</div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Championships">
      <ChampionshipsContainer>
        {/* Year selector */}
        <YearSelector>
          {competitions.map(competition => (
            <Button
              key={competition.id}
              variant={selectedCompetition?.id === competition.id ? 'primary' : 'outline'}
              size="small"
              onClick={() => setSelectedCompetition(competition)}
            >
              {competition.year}
            </Button>
          ))}
        </YearSelector>
        
        {/* Overall standings */}
        <StandingsCard>
          <StandingsHeader>
            <h2>
              <FaTrophy />
              Overall Standings
            </h2>
            {selectedCompetition && (
              <div>{selectedCompetition.name}</div>
            )}
          </StandingsHeader>
          
          <StandingsTable>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => (
                <tr key={standing.user_id}>
                  <td>
                    <Position position={index + 1}>{index + 1}</Position>
                  </td>
                  <td>
                    <UserCell>
                      <UserAvatar src={getAvatarUrl(standing.avatar)} />
                      {standing.display_name}
                    </UserCell>
                  </td>
                  <td>
                    <Points>{standing.total_points}</Points>
                  </td>
                </tr>
              ))}
            </tbody>
          </StandingsTable>
        </StandingsCard>
        
        {/* Disciplines */}
        <h2>Disciplines</h2>
        <DisciplinesList>
          {disciplines.map(discipline => (
            <DisciplineCard key={discipline.id} onClick={() => toggleDiscipline(discipline.id)}>
              <DisciplineHeader>
                <DisciplineTitle>{discipline.name}</DisciplineTitle>
                {openDisciplineId === discipline.id ? <FaChevronUp /> : <FaChevronDown />}
              </DisciplineHeader>
              
              <DisciplineResults isOpen={openDisciplineId === discipline.id}>
                {getDisciplineResults(discipline.id).map(result => (
                  <ResultItem key={result.id}>
                    <UserCell>
                      <ResultPosition position={result.position}>
                        {getMedalIcon(result.position)}
                        {result.position}.
                      </ResultPosition>
                      <UserAvatar 
                        src={getAvatarUrl(`avatar${result.user_id}.jpg`)} 
                      />
                      {result.user_name}
                    </UserCell>
                    <Points>{result.points} pts</Points>
                  </ResultItem>
                ))}
              </DisciplineResults>
            </DisciplineCard>
          ))}
        </DisciplinesList>
      </ChampionshipsContainer>
    </Layout>
  );
};

export default Championships;
