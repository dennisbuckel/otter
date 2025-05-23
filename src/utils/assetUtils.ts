import { avatarDataUrls } from '../assets/avatarData';

// Import the photos directly
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import photo3 from '../assets/photo3.jpg';
import photo4 from '../assets/photo4.jpg';
import photo5 from '../assets/photo5.jpg';
import photo6 from '../assets/photo6.jpg';

// Import avatar images directly
import avatar1 from '../assets/avatars/avatar1.jpg';
import avatar2 from '../assets/avatars/avatar2.jpg';
import avatar3 from '../assets/avatars/avatar3.jpg';
import avatar4 from '../assets/avatars/avatar4.jpg';
import avatar5 from '../assets/avatars/avatar5.jpg';
import avatar6 from '../assets/avatars/avatar6.jpg';

// Map of photo filenames to their imported values
const photoMap: Record<string, string> = {
  'photo1.jpg': photo1,
  'photo2.jpg': photo2,
  'photo3.jpg': photo3,
  'photo4.jpg': photo4,
  'photo5.jpg': photo5,
  'photo6.jpg': photo6,
};

// Map of avatar filenames to their imported values
const avatarImages: Record<string, string> = {
  'avatar1.jpg': avatar1,
  'avatar2.jpg': avatar2,
  'avatar3.jpg': avatar3,
  'avatar4.jpg': avatar4,
  'avatar5.jpg': avatar5,
  'avatar6.jpg': avatar6
};

// Function to get the URL for an avatar
export const getAvatarUrl = (avatarFileName: string): string => {
  if (!avatarFileName) {
    return '';
  }
  
  // Extract user ID from avatar filename (e.g., "avatar1.jpg" -> 1)
  const userId = parseInt(avatarFileName.replace(/\D/g, ''), 10);
  
  if (isNaN(userId) || userId < 1 || userId > 6) {
    return '';
  }
  
  // Try to use the actual image file if available
  if (avatarImages[avatarFileName]) {
    return avatarImages[avatarFileName];
  }
  
  // Use the data URL fallback for avatars
  return avatarDataUrls[userId - 1];
};

// Function to get the URL for a photo
export const getPhotoUrl = (photoFileName: string): string => {
  if (!photoFileName) {
    return '';
  }
  
  // Return the imported photo if available
  return photoMap[photoFileName] || '';
};

// Sample photo data for the feed
export const samplePhotos = [
  {
    id: 1,
    url: 'photo1.jpg',
    description: 'Group photo from Otter Challenge',
    fallbackColor: '#FF5722'
  },
  {
    id: 2,
    url: 'photo2.jpg',
    description: 'Beach day with the crew',
    fallbackColor: '#2196F3'
  },
  {
    id: 3,
    url: 'photo3.jpg',
    description: 'Hiking trip',
    fallbackColor: '#4CAF50'
  },
  {
    id: 4,
    url: 'photo4.jpg',
    description: 'Game night',
    fallbackColor: '#00BCD4'
  },
  {
    id: 5,
    url: 'photo5.jpg',
    description: 'Holiday party',
    fallbackColor: '#FFC107'
  },
  {
    id: 6,
    url: 'photo6.jpg',
    description: 'Planning the next Otter Challenge',
    fallbackColor: '#607D8B'
  }
];

// Function to generate a placeholder for photos
export const generatePhotoPlaceholder = (id: number): string => {
  const photo = samplePhotos.find(p => p.id === id);
  const color = photo?.fallbackColor || '#cccccc';
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="${color}" />
      <text x="200" y="150" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Photo ${id}</text>
    </svg>
  `;
};

// Function to get a photo URL with fallback
export const getPhotoUrlWithFallback = (photoFileName: string, photoId: number): string => {
  try {
    // Try to load the actual image file
    return getPhotoUrl(photoFileName);
  } catch (error) {
    // Fallback to a colored placeholder
    const svgContent = generatePhotoPlaceholder(photoId);
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  }
};
