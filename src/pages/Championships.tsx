import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaMedal, FaCrown, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useDatabase } from '../db/DatabaseContext';
import { getAvatarUrl } from '../utils/assetUtils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface User     { id: number; username: string; display_name: string; avatar: string; }
interface Competition { id: number; year: number; name: string; date: string; }
interface Discipline  { id: number; competition_id: number; name: string; }
interface Result {
  id: number; discipline_id: number; user_id: number;
  position: number; points: number;
  discipline_name?: string; user_name?: string;
}
interface Standing {
  user_id: number; display_name: string; avatar: string;
  total_points: number; first_places: number; second_places: number; third_places: number;
  disciplines_participated: number;
}

// ─── Styled Components ────────────────────────────────────────────────────────
const Wrap = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

// Jahr-Selektor
const YearRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const YearBtn = styled.button<{ $active: boolean }>`
  padding: 6px 18px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.card};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.text};
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

// Top-3 Podium
const PodiumRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.md};
`;

const PodiumItem = styled.div<{ $rank: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  max-width: 120px;
`;

const PodiumBlock = styled.div<{ $rank: number }>`
  width: 100%;
  background: ${({ $rank, theme }) =>
    $rank === 1 ? theme.colors.primary :
    $rank === 2 ? '#A8A8A8' : '#CD7F32'};
  border-radius: ${({ theme }) => theme.borderRadius.medium} ${({ theme }) => theme.borderRadius.medium} 0 0;
  height: ${({ $rank }) => $rank === 1 ? '70px' : $rank === 2 ? '50px' : '35px'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
`;

const PodiumAvatar = styled.div<{ src: string; $rank: number }>`
  width: ${({ $rank }) => $rank === 1 ? '68px' : '54px'};
  height: ${({ $rank }) => $rank === 1 ? '68px' : '54px'};
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 3px solid ${({ $rank, theme }) =>
    $rank === 1 ? theme.colors.primary :
    $rank === 2 ? '#A8A8A8' : '#CD7F32'};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const PodiumName = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const PodiumPts = styled.div`
  font-size: 1.1rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
`;

// Tabelle (Platz 4+)
const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 56px 56px;
  padding: 10px ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableRow = styled.div<{ $highlight?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr 56px 56px;
  padding: 10px ${({ theme }) => theme.spacing.md};
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}33;
  background: ${({ $highlight, theme }) =>
    $highlight ? `${theme.colors.primary}08` : 'transparent'};
  transition: background 0.15s ease;
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.background}; }
`;

const RankNum = styled.div<{ $rank: number }>`
  font-size: 0.95rem;
  font-weight: 800;
  color: ${({ $rank, theme }) =>
    $rank === 1 ? theme.colors.primary :
    $rank === 2 ? '#A8A8A8' :
    $rank === 3 ? '#CD7F32' : theme.colors.textMuted ?? '#888'};
  text-align: center;
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const SmallAvatar = styled.div<{ src: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserDisplayName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PtsNum = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const ProgressBar = styled.div<{ $pct: number }>`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.border};
  position: relative;
  margin-top: 3px;
  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0;
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.6s ease;
  }
`;

const MedalCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  flex-direction: column;
`;

// Disziplinen-Sektion
const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  svg { color: ${({ theme }) => theme.colors.primary}; }
`;

const DiscGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DiscCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
`;

const DiscHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px ${({ theme }) => theme.spacing.md};
  background: none;
  cursor: pointer;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DiscName = styled.span`
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const DiscMeta = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  white-space: nowrap;
`;

const DiscResults = styled.div<{ $open: boolean }>`
  max-height: ${({ $open }) => $open ? '400px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  border-top: ${({ $open, theme }) => $open ? `1px solid ${theme.colors.border}` : 'none'};
`;

const DiscResultRow = styled.div<{ $pos: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px ${({ theme }) => theme.spacing.md};
  background: ${({ $pos, theme }) =>
    $pos === 1 ? `${theme.colors.primary}08` :
    $pos === 2 ? 'rgba(168,168,168,0.06)' :
    $pos === 3 ? 'rgba(205,127,50,0.06)' : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}22;
  &:last-child { border-bottom: none; }
`;

const DiscPos = styled.span<{ $pos: number }>`
  font-size: 0.8rem;
  font-weight: 800;
  width: 24px;
  text-align: center;
  color: ${({ $pos, theme }) =>
    $pos === 1 ? theme.colors.primary :
    $pos === 2 ? '#A8A8A8' :
    $pos === 3 ? '#CD7F32' : theme.colors.textMuted ?? '#888'};
`;

const DiscUser = styled.div`
  display: flex; align-items: center; gap: 8px; flex: 1;
`;

const DiscPts = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const NoData = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  font-size: 0.9rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

// ─── Komponente ───────────────────────────────────────────────────────────────
const Championships: React.FC = () => {
  const [competitions, setCompetitions]       = useState<Competition[]>([]);
  const [selected, setSelected]               = useState<Competition | null>(null);
  const [disciplines, setDisciplines]         = useState<Discipline[]>([]);
  const [results, setResults]                 = useState<Result[]>([]);
  const [standings, setStandings]             = useState<Standing[]>([]);
  const [users, setUsers]                     = useState<User[]>([]);
  const [openDisc, setOpenDisc]               = useState<number | null>(null);
  const [isLoading, setIsLoading]             = useState(true);

  const { executeQuery } = useDatabase();

  // Competitions laden
  useEffect(() => {
    try {
      const data = executeQuery('SELECT * FROM competitions ORDER BY year DESC') as Competition[];
      setCompetitions(data);
      if (data.length > 0) setSelected(data[0]);
    } catch (e) { console.error(e); }
  }, [executeQuery]);

  // User laden
  useEffect(() => {
    try {
      const data = executeQuery('SELECT id, username, display_name, avatar FROM users') as User[];
      setUsers(data);
    } catch (e) { console.error(e); }
  }, [executeQuery]);

  // Disziplinen + Ergebnisse für gewählte Competition
  useEffect(() => {
    if (!selected) return;
    setIsLoading(true);
    try {
      const discs = executeQuery(
        'SELECT * FROM disciplines WHERE competition_id = ? ORDER BY id',
        [selected.id]
      ) as Discipline[];
      setDisciplines(discs);

      const res = executeQuery(`
        SELECT r.*, d.name as discipline_name, u.display_name as user_name
        FROM results r
        JOIN disciplines d ON r.discipline_id = d.id
        JOIN users u ON r.user_id = u.id
        WHERE d.competition_id = ?
        ORDER BY r.discipline_id, r.position
      `, [selected.id]) as Result[];
      setResults(res);

      calculateStandings(discs, res);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, executeQuery]);

  const calculateStandings = (discs: Discipline[], res: Result[]) => {
    if (users.length === 0) return;

    const byUser: Record<number, Result[]> = {};
    res.forEach(r => {
      if (!byUser[r.user_id]) byUser[r.user_id] = [];
      byUser[r.user_id].push(r);
    });

    const list: Standing[] = users
      .map(u => {
        const myRes = byUser[u.id] || [];
        return {
          user_id:                 u.id,
          display_name:            u.display_name,
          avatar:                  u.avatar,
          total_points:            myRes.reduce((s, r) => s + r.points, 0),
          first_places:            myRes.filter(r => r.position === 1).length,
          second_places:           myRes.filter(r => r.position === 2).length,
          third_places:            myRes.filter(r => r.position === 3).length,
          disciplines_participated: myRes.length,
        };
      })
      // Nur Teilnehmer anzeigen (Paul ist Organisator in Jahr 2 → 0 Teilnahmen)
      .filter(s => s.disciplines_participated > 0)
      .sort((a, b) => b.total_points - a.total_points);

    setStandings(list);
  };

  useEffect(() => {
    if (users.length > 0 && results.length > 0) {
      calculateStandings(disciplines, results);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const getDiscResults = (discId: number) =>
    results.filter(r => r.discipline_id === discId).sort((a, b) => a.position - b.position);

  const maxPts = standings[0]?.total_points || 1;
  const top3   = standings.slice(0, 3);

  // Podium-Reihenfolge: 2. – 1. – 3.
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumRanks = [2, 1, 3];

  return (
    <Layout title="Ranking">
      <Wrap>
        {/* Jahr-Wahl */}
        <YearRow>
          {competitions.map(c => (
            <YearBtn
              key={c.id}
              $active={selected?.id === c.id}
              onClick={() => setSelected(c)}
            >
              {c.year}
            </YearBtn>
          ))}
        </YearRow>

        {isLoading ? (
          <NoData>Lade Daten…</NoData>
        ) : standings.length === 0 ? (
          <NoData>
            <FaTrophy style={{ fontSize: '2rem', marginBottom: 8, opacity: 0.3 }} /><br />
            Keine Daten für {selected?.year}
          </NoData>
        ) : (
          <>
            {/* ── Podium Top 3 ──────────────────────────── */}
            {top3.length >= 1 && (
              <PodiumRow>
                {podiumOrder.map((s, i) => {
                  const rank = podiumRanks[i];
                  return (
                    <PodiumItem key={s.user_id} $rank={rank}>
                      {rank === 1 && <FaCrown style={{ color: '#FC4C02', fontSize: '1.3rem' }} />}
                      <PodiumAvatar src={getAvatarUrl(s.avatar)} $rank={rank} />
                      <PodiumName>{s.display_name}</PodiumName>
                      <PodiumPts>{s.total_points} P</PodiumPts>
                      <PodiumBlock $rank={rank}>{rank}</PodiumBlock>
                    </PodiumItem>
                  );
                })}
              </PodiumRow>
            )}

            {/* ── Gesamttabelle ─────────────────────────── */}
            <TableCard>
              <TableHeader>
                <div>#</div>
                <div>Athlet</div>
                <div style={{ textAlign: 'center' }}>Pts</div>
                <div style={{ textAlign: 'center' }}>🥇</div>
              </TableHeader>

              {standings.map((s, i) => (
                <TableRow key={s.user_id} $highlight={i === 0}>
                  <RankNum $rank={i + 1}>{i + 1}</RankNum>

                  <UserCell>
                    <SmallAvatar src={getAvatarUrl(s.avatar)} />
                    <div style={{ minWidth: 0 }}>
                      <UserDisplayName>{s.display_name}</UserDisplayName>
                      <ProgressBar $pct={Math.round((s.total_points / maxPts) * 100)} />
                    </div>
                  </UserCell>

                  <PtsNum>{s.total_points}</PtsNum>

                  <MedalCell>
                    <span style={{ color: '#FC4C02' }}>{s.first_places}×🥇</span>
                  </MedalCell>
                </TableRow>
              ))}
            </TableCard>

            {/* ── Disziplinen ───────────────────────────── */}
            <SectionTitle>
              <FaMedal />
              Challenges
            </SectionTitle>

            <DiscGrid>
              {disciplines
                .filter(d => d.name !== 'Russo Einstieg')
                .map(d => {
                  const dRes = getDiscResults(d.id);
                  const winner = dRes[0];
                  return (
                    <DiscCard key={d.id}>
                      <DiscHeader onClick={() => setOpenDisc(prev => prev === d.id ? null : d.id)}>
                        <DiscName>{d.name}</DiscName>
                        {winner && (
                          <DiscMeta>
                            🏆 {winner.user_name} ({winner.points} P)
                          </DiscMeta>
                        )}
                        {openDisc === d.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                      </DiscHeader>

                      <DiscResults $open={openDisc === d.id}>
                        {dRes.map(r => (
                          <DiscResultRow key={r.id} $pos={r.position}>
                            <DiscPos $pos={r.position}>{r.position}</DiscPos>
                            <DiscUser>
                              <SmallAvatar
                                src={getAvatarUrl(`avatar${r.user_id}.jpg`)}
                                style={{ width: 24, height: 24 }}
                              />
                              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                {r.user_name}
                              </span>
                            </DiscUser>
                            <DiscPts>{r.points} P</DiscPts>
                          </DiscResultRow>
                        ))}
                      </DiscResults>
                    </DiscCard>
                  );
                })}
            </DiscGrid>
          </>
        )}
      </Wrap>
    </Layout>
  );
};

export default Championships;
