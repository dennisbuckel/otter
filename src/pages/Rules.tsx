import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaTrophy, FaChevronDown, FaChevronUp,
  FaCalculator, FaCrown, FaUsers, FaGavel, FaStar,
} from 'react-icons/fa';
import Layout from '../components/Layout';
import { useDatabase } from '../db/DatabaseContext';
import { getAvatarUrl } from '../utils/assetUtils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HallEntry {
  year: number;
  winner: string;
  points: number;
  organizer: string;
  avatar: string;
}

// ─── Static Regelwerk Data ────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 1,
    icon: '🦦',
    title: 'Allgemeines',
    content: [
      'Die Otter Challenge ist ein jährliches Freundesgruppen-Event, bei dem Teilnehmer in verschiedenen Challenges gegeneinander antreten.',
      'Der Gesamtsieger aller Challenges wird Otter Champion des Jahres und erhält den legendären Otter-Pokal.',
    ],
  },
  {
    id: 2,
    icon: '📋',
    title: 'Organisation',
    items: [
      {
        label: '2.1 Wer organisiert?',
        text: 'Der Vorjahressieger organisiert die nächste Otter Challenge – er trägt die volle Verantwortung für Challenges, Ablauf, Wertung und Streitentscheidungen.',
        highlight: true,
      },
      {
        label: '2.2 Teilnahme des Organisators',
        text: 'Der Organisator darf mitspielen und Punkte sammeln – er darf aber nicht in der Gesamtwertung gewinnen. Seine Punkte werden trotzdem in der Einzelwertung der Challenges geführt.',
      },
      {
        label: '2.3 Challenges festlegen',
        text: 'Der Organisator legt alle Challenges alleine fest – kein Veto der Teilnehmer. Art, Anzahl und Reihenfolge sind frei wählbar (Sport, Wissen, Geschicklichkeit, Glück).',
      },
    ],
  },
  {
    id: 3,
    icon: '🧮',
    title: 'Punktesystem',
    items: [
      {
        label: '3.1 Grundregel',
        text: 'Platz 1 erhält so viele Punkte wie Teilnehmer an der Challenge beteiligt sind. Jeder weitere Platz erhält einen Punkt weniger.',
        formula: true,
      },
      {
        label: '3.2 Gleichstand (Tie)',
        text: 'Enden zwei Teilnehmer auf demselben Platz, erhalten beide den Punktwert für diesen Platz. Der nächste Platz dahinter überspringt entsprechend.',
      },
      {
        label: '3.3 Nicht-Teilnahme',
        text: 'Wer eine Challenge nicht mitmacht oder verzichtet, erhält 0 Punkte. Verzicht ist erlaubt, beeinflusst aber die eigene Gesamtpunktzahl negativ.',
      },
      {
        label: '3.4 Spätstarter',
        text: 'Wer erst nach dem Start dazukommt, beginnt mit 0 Punkten. Fehlende Challenges können nicht nachgeholt werden. Ausgleichspunkte liegen im Ermessen des Organisators.',
      },
    ],
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Gesamtwertung',
    items: [
      {
        label: '4.1 Sieger',
        text: 'Der Teilnehmer mit den meisten Gesamtpunkten am Ende aller Challenges gewinnt die Otter Challenge.',
      },
      {
        label: '4.2 Gleichstand Gesamt',
        text: 'Bei Gleichstand entscheidet der Organisator: Anzahl gewonnener Challenges (1. Plätze), ein Stechen oder eine andere faire Methode.',
      },
      {
        label: '4.3 Ausschluss des Organisators',
        text: 'Der Organisator wird bei der Vergabe des Titels Otter Champion nicht berücksichtigt – auch wenn er die meisten Punkte hat. Titel und Pokal gehen an den besten nicht-organisierenden Teilnehmer.',
        highlight: true,
      },
    ],
  },
  {
    id: 5,
    icon: '🎁',
    title: 'Preise & Auszeichnungen',
    awards: [
      { icon: '🏆', name: 'Otter-Pokal', desc: 'Geht an den Gesamtsieger' },
      { icon: '👑', name: 'Organisationsrecht', desc: 'Der Sieger organisiert das nächste Jahr' },
    ],
  },
  {
    id: 6,
    icon: '👥',
    title: 'Teilnehmer',
    content: [
      'Jeder kann an der Otter Challenge teilnehmen, solange er eingeladen wird.',
      'Neue Teilnehmer werden vom Organisator zugelassen.',
      'Minimum: 2 Teilnehmer (exkl. Organisator).',
    ],
  },
  {
    id: 8,
    icon: '📌',
    title: 'Sonstiges',
    content: [
      'Das Regelwerk kann vom Organisator für sein Jahr angepasst werden, solange die Kernregeln (Punkte, Ausschluss Organisator, Pokal) erhalten bleiben.',
      'Bei Streitigkeiten entscheidet der Organisator final – seine Entscheidung ist bindend.',
      'Der Spaß steht über allem 🦦',
    ],
  },
];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; }`;

// ─── Styled Components ────────────────────────────────────────────────────────
const Wrap = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  animation: ${fadeIn} 0.4s ease;
`;

// Hero
const Hero = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primary}cc);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  color: white;
  position: relative;
  overflow: hidden;
  &::before {
    content: '🦦';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 4rem;
    opacity: 0.25;
    pointer-events: none;
  }
`;

const HeroTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 900;
  margin: 0 0 4px;
  letter-spacing: 0.03em;
`;

const HeroSub = styled.p`
  font-size: 0.8rem;
  opacity: 0.85;
  margin: 0;
`;

// Key-Rule-Pills
const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Pill = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 5px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

// Accordion
const AccordionCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const AccHeader = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 14px ${({ theme }) => theme.spacing.md};
  background: ${({ $open, theme }) => $open ? `${theme.colors.primary}10` : 'none'};
  cursor: pointer;
  text-align: left;
  border-bottom: ${({ $open, theme }) => $open ? `2px solid ${theme.colors.primary}33` : '2px solid transparent'};
  transition: background 0.2s;
`;

const AccIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const AccTitle = styled.span`
  font-weight: 800;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const AccBody = styled.div<{ $open: boolean }>`
  max-height: ${({ $open }) => $open ? '600px' : '0'};
  overflow: hidden;
  transition: max-height 0.35s ease;
`;

const AccContent = styled.div`
  padding: 14px ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContentText = styled.p`
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  margin: 0;
`;

const SubItem = styled.div<{ $highlight?: boolean }>`
  border-left: 3px solid ${({ $highlight, theme }) => $highlight ? theme.colors.primary : theme.colors.border};
  padding: 8px 12px;
  border-radius: 0 ${({ theme }) => theme.borderRadius.small} ${({ theme }) => theme.borderRadius.small} 0;
  background: ${({ $highlight, theme }) => $highlight ? `${theme.colors.primary}08` : `${theme.colors.background}88`};
`;

const SubLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const SubText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.55;
  margin: 0;
`;

const FormulaBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 8px 14px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  margin-top: 4px;
`;

const AwardRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}33;
  &:last-child { border-bottom: none; }
`;

const AwardIcon = styled.span`
  font-size: 1.4rem;
  width: 32px;
  text-align: center;
`;

const AwardInfo = styled.div``;
const AwardName = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;
const AwardDesc = styled.div`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
`;

// ─── Live Calculator ──────────────────────────────────────────────────────────
const CalcCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const CalcHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 14px ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => `${theme.colors.primary}10`};
`;

const CalcTitle = styled.span`
  font-weight: 800;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const CalcBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const CalcBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SliderWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SliderLabelText = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 5px;
  svg { color: ${({ theme }) => theme.colors.primary}; }
`;

const SliderValue = styled.span`
  font-size: 1.2rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
`;

const Slider = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  height: 6px;
`;

const PointTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PointRow = styled.div<{ $pos: number }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ $pos, theme }) =>
    $pos === 1 ? `${theme.colors.primary}15` :
    $pos === 2 ? 'rgba(168,168,168,0.1)' :
    $pos === 3 ? 'rgba(205,127,50,0.08)' :
    `${theme.colors.background}88`};
`;

const PointPos = styled.span<{ $pos: number }>`
  width: 28px;
  font-size: 0.85rem;
  font-weight: 800;
  text-align: center;
  color: ${({ $pos, theme }) =>
    $pos === 1 ? theme.colors.primary :
    $pos === 2 ? '#A8A8A8' :
    $pos === 3 ? '#CD7F32' : theme.colors.textMuted ?? '#888'};
`;

const PointMedal = styled.span`
  font-size: 1rem;
  width: 20px;
  text-align: center;
`;

const PointBar = styled.div<{ $pct: number }>`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0; height: 100%;
    width: ${({ $pct }) => $pct}%;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.4s ease;
  }
`;

const PointValue = styled.span`
  font-size: 0.85rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  min-width: 32px;
  text-align: right;
`;

// Hall of Fame
const HofCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const HofHeader = styled.div`
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

const HofEntry = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 14px ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}33;
  &:last-child { border-bottom: none; }
`;

const HofYear = styled.div`
  font-size: 1.1rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  min-width: 48px;
`;

const HofAvatar = styled.div<{ src: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const HofInfo = styled.div`
  flex: 1;
`;

const HofName = styled.div`
  font-weight: 800;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HofMeta = styled.div`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  margin-top: 2px;
`;

const HofPoints = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

// ─── Komponente ───────────────────────────────────────────────────────────────
const Rules: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(3); // Punktesystem offen by default
  const [participants, setParticipants] = useState(6);
  const [hofData, setHofData] = useState<HallEntry[]>([]);
  const { executeQuery } = useDatabase();

  // Hall of Fame aus DB laden
  useEffect(() => {
    try {
      const rows = executeQuery(`
        SELECT
          c.year,
          c.winner_display_name,
          c.winner_points,
          c.organizer_display_name,
          c.winner_avatar
        FROM (
          SELECT
            comp.year,
            u.display_name  AS winner_display_name,
            u.avatar        AS winner_avatar,
            SUM(r.points)   AS winner_points,
            (
              SELECT u2.display_name
              FROM users u2
              WHERE u2.username = CASE comp.id
                WHEN 1 THEN 'paul'     -- 2024 kein Org, Paul ist Sieger
                WHEN 2 THEN 'paul'     -- 2025 Paul ist Organisator
                ELSE ''
              END
            ) AS organizer_display_name,
            ROW_NUMBER() OVER (PARTITION BY comp.id ORDER BY SUM(r.points) DESC) AS rn
          FROM competitions comp
          JOIN disciplines d ON d.competition_id = comp.id
          JOIN results r     ON r.discipline_id  = d.id
          JOIN users u       ON u.id             = r.user_id
          WHERE d.name != 'Russo Einstieg'
          GROUP BY comp.id, u.id
        ) sub
        WHERE rn = 1
        ORDER BY year DESC
      `) as any[];

      if (rows.length > 0) {
        setHofData(rows.map(r => ({
          year: r.year,
          winner: r.winner_display_name,
          points: r.winner_points,
          organizer: r.organizer_display_name || '–',
          avatar: r.winner_avatar,
        })));
      }
    } catch {
      // Fallback: hardcoded historical data
      setHofData([
        { year: 2025, winner: 'Lucas', points: 40, organizer: 'Paul', avatar: 'avatar4.jpg' },
        { year: 2024, winner: 'Paul',  points: 15, organizer: '–',    avatar: 'avatar5.jpg' },
      ]);
    }
  }, [executeQuery]);

  const pointsForPos = (pos: number) => Math.max(0, participants - (pos - 1));

  const toggle = (id: number) => setOpenSection(prev => prev === id ? null : id);

  return (
    <Layout title="Regelwerk">
      <Wrap>
        {/* ── Hero ─────────────────────────────────── */}
        <Hero>
          <HeroTitle>Offizielles Regelwerk</HeroTitle>
          <HeroSub>Stand: Mai 2026 · Gültig ab Otter Challenge 2026</HeroSub>
        </Hero>

        {/* ── Key-Rules-Pills ──────────────────────── */}
        <PillRow>
          <Pill><FaCrown style={{ color: '#FC4C02' }} /> Sieger = nächster Organisator</Pill>
          <Pill><FaGavel style={{ color: '#FC4C02' }} /> Org darf nicht gewinnen</Pill>
          <Pill><FaStar style={{ color: '#FC4C02' }} /> Punkte = Teilnehmer − (Platz − 1)</Pill>
          <Pill><FaUsers style={{ color: '#FC4C02' }} /> Mind. 2 Teilnehmer</Pill>
        </PillRow>

        {/* ── Live Punkte-Kalkulator ────────────────── */}
        <CalcCard>
          <CalcHeader>
            <FaCalculator style={{ color: '#FC4C02', fontSize: '1rem' }} />
            <CalcTitle>Live Punkte-Kalkulator</CalcTitle>
            <CalcBadge>Interaktiv</CalcBadge>
          </CalcHeader>
          <CalcBody>
            <SliderWrap>
              <SliderLabel>
                <SliderLabelText>
                  <FaUsers /> Teilnehmer
                </SliderLabelText>
                <SliderValue>{participants}</SliderValue>
              </SliderLabel>
              <Slider
                type="range"
                min={2}
                max={10}
                value={participants}
                onChange={e => setParticipants(Number(e.target.value))}
              />
            </SliderWrap>

            <PointTable>
              {Array.from({ length: participants }, (_, i) => i + 1).map(pos => {
                const pts = pointsForPos(pos);
                return (
                  <PointRow key={pos} $pos={pos}>
                    <PointPos $pos={pos}>{pos}.</PointPos>
                    <PointMedal>{MEDALS[pos] || '  '}</PointMedal>
                    <PointBar $pct={Math.round((pts / participants) * 100)} />
                    <PointValue>{pts} P</PointValue>
                  </PointRow>
                );
              })}
            </PointTable>
          </CalcBody>
        </CalcCard>

        {/* ── Hall of Fame ──────────────────────────── */}
        {hofData.length > 0 && (
          <HofCard>
            <HofHeader>
              <FaTrophy /> Hall of Fame
            </HofHeader>
            {hofData.map(e => (
              <HofEntry key={e.year}>
                <HofYear>{e.year}</HofYear>
                <HofAvatar src={getAvatarUrl(e.avatar)} />
                <HofInfo>
                  <HofName>
                    {e.winner} <FaCrown style={{ color: '#FC4C02', fontSize: '0.85rem' }} />
                  </HofName>
                  <HofMeta>Org: {e.organizer}</HofMeta>
                </HofInfo>
                <HofPoints>{e.points} P</HofPoints>
              </HofEntry>
            ))}
          </HofCard>
        )}

        {/* ── Akkordeon-Sektionen ───────────────────── */}
        {SECTIONS.map(sec => (
          <AccordionCard key={sec.id}>
            <AccHeader $open={openSection === sec.id} onClick={() => toggle(sec.id)}>
              <AccIcon>{sec.icon}</AccIcon>
              <AccTitle>{sec.title}</AccTitle>
              {openSection === sec.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </AccHeader>

            <AccBody $open={openSection === sec.id}>
              <AccContent>
                {/* Plain text content */}
                {sec.content?.map((c, i) => <ContentText key={i}>{c}</ContentText>)}

                {/* Sub-items */}
                {sec.items?.map((item, i) => (
                  <SubItem key={i} $highlight={(item as any).highlight}>
                    <SubLabel>{item.label}</SubLabel>
                    <SubText>{item.text}</SubText>
                    {(item as any).formula && (
                      <FormulaBox>Punkte = Anzahl Teilnehmer − (Platz − 1)</FormulaBox>
                    )}
                  </SubItem>
                ))}

                {/* Awards */}
                {sec.awards?.map((a, i) => (
                  <AwardRow key={i}>
                    <AwardIcon>{a.icon}</AwardIcon>
                    <AwardInfo>
                      <AwardName>{a.name}</AwardName>
                      <AwardDesc>{a.desc}</AwardDesc>
                    </AwardInfo>
                  </AwardRow>
                ))}
              </AccContent>
            </AccBody>
          </AccordionCard>
        ))}
      </Wrap>
    </Layout>
  );
};

export default Rules;
