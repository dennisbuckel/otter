import { avatarDataUrls } from '../assets/avatarData';

// ─── Echte Fotos importieren ──────────────────────────────────────────────────
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import photo3 from '../assets/photo3.jpg';
import photo4 from '../assets/photo4.jpg';
import photo5 from '../assets/photo5.jpg';
import photo6 from '../assets/photo6.jpg';

// ─── Echte Avatare importieren (1–6, Paddy=7 hat noch kein Foto → SVG) ───────
import avatar1 from '../assets/avatars/avatar1.jpg';
import avatar2 from '../assets/avatars/avatar2.jpg';
import avatar3 from '../assets/avatars/avatar3.jpg';
import avatar4 from '../assets/avatars/avatar4.jpg';
import avatar5 from '../assets/avatars/avatar5.jpg';
import avatar6 from '../assets/avatars/avatar6.jpg';

// ─── Maps ─────────────────────────────────────────────────────────────────────
const photoMap: Record<string, string> = {
  'photo1.jpg': photo1,
  'photo2.jpg': photo2,
  'photo3.jpg': photo3,
  'photo4.jpg': photo4,
  'photo5.jpg': photo5,
  'photo6.jpg': photo6,
};

const avatarImages: Record<string, string> = {
  'avatar1.jpg': avatar1,
  'avatar2.jpg': avatar2,
  'avatar3.jpg': avatar3,
  'avatar4.jpg': avatar4,
  'avatar5.jpg': avatar5,
  'avatar6.jpg': avatar6,
  // avatar7.jpg (Paddy) existiert noch nicht → SVG-Fallback
};

// ─── Avatar-URL ───────────────────────────────────────────────────────────────
export const getAvatarUrl = (avatarFileName: string): string => {
  if (!avatarFileName) return '';

  // Echtes Bild bevorzugen
  if (avatarImages[avatarFileName]) return avatarImages[avatarFileName];

  // SVG-Fallback (z.B. avatar7.jpg = Paddy)
  const userId = parseInt(avatarFileName.replace(/\D/g, ''), 10);
  if (!isNaN(userId) && userId >= 1 && userId <= 7) {
    return avatarDataUrls[userId - 1];
  }

  return '';
};

// ─── Foto-URL ─────────────────────────────────────────────────────────────────
export const getPhotoUrl = (photoFileName: string): string => {
  if (!photoFileName) return '';
  return photoMap[photoFileName] || '';
};

// Foto-URL mit SVG-Fallback (falls kein echtes Bild vorhanden)
export const getPhotoUrlWithFallback = (photoFileName: string, photoId: number): string => {
  const url = getPhotoUrl(photoFileName);
  if (url) return url;

  // Farbiger SVG-Platzhalter
  const colors = ['#FF5722', '#2196F3', '#4CAF50', '#00BCD4', '#FFC107', '#607D8B'];
  const color  = colors[(photoId - 1) % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="${color}"/><text x="200" y="150" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Photo ${photoId}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
