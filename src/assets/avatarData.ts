// Avatar-Konfiguration für alle 7 User

export const avatarColors = [
  '#FF5722', // Russo  – Orange
  '#2196F3', // Stacho – Blue
  '#4CAF50', // Tim    – Green
  '#00BCD4', // Lucas  – Cyan
  '#FFC107', // Paul   – Yellow
  '#607D8B', // Dennis – Blue Grey
  '#E91E63', // Paddy  – Pink
];

export const userInitials = ['R', 'S', 'T', 'L', 'P', 'D', 'Pa'];
export const userNames    = ['Russo', 'Stacho', 'Tim', 'Lucas', 'Paul', 'Dennis', 'Paddy'];

// Generiert ein einfaches SVG-Avatar mit Initial und Farbe
export const generateAvatarSvg = (userId: number, initial: string, color: string): string => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100" fill="${color}"/><text x="100" y="125" font-family="Inter,Arial,sans-serif" font-size="80" font-weight="700" fill="white" text-anchor="middle">${initial}</text></svg>`;
};

// Base64-kodierte Data-URLs für jeden Avatar
export const avatarDataUrls = [
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(1, 'R',  avatarColors[0]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(2, 'S',  avatarColors[1]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(3, 'T',  avatarColors[2]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(4, 'L',  avatarColors[3]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(5, 'P',  avatarColors[4]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(6, 'D',  avatarColors[5]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(7, 'Pa', avatarColors[6]))}`,
];

// Gibt die Avatar-URL für einen User zurück (data-URL als Fallback)
export const getAvatarUrl = (userId: number): string => {
  if (userId < 1 || userId > 7) return '';
  return avatarDataUrls[userId - 1];
};

// Export aller Avatar-Daten
export const avatars = userNames.map((name, i) => ({
  id:      i + 1,
  initial: userInitials[i],
  name,
  color:   avatarColors[i],
  dataUrl: avatarDataUrls[i],
}));

export default avatars;
