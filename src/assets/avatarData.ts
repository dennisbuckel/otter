// This file contains base64-encoded avatar images for the 6 users
// These can be used as fallbacks if the actual image files are not available

export const avatarColors = [
  '#FF5722', // Russo - Orange
  '#2196F3', // Stacho - Blue
  '#4CAF50', // Tim - Green
  '#00BCD4', // Lucas - Cyan
  '#FFC107', // Paul - Yellow
  '#607D8B'  // Dennis - Blue Grey
];

// User initials
export const userInitials = ['R', 'S', 'T', 'L', 'P', 'D'];
export const userNames = ['Russo', 'Stacho', 'Tim', 'Lucas', 'Paul', 'Dennis'];

// Function to generate a simple avatar SVG with the user's initial
export const generateAvatarSvg = (userId: number, initial: string, color: string): string => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="100" fill="${color}" />
      <text x="100" y="125" font-family="Arial" font-size="90" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
    </svg>
  `;
};

// Generate base64-encoded data URLs for each avatar
export const avatarDataUrls = [
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(1, userInitials[0], avatarColors[0]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(2, userInitials[1], avatarColors[1]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(3, userInitials[2], avatarColors[2]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(4, userInitials[3], avatarColors[3]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(5, userInitials[4], avatarColors[4]))}`,
  `data:image/svg+xml;base64,${btoa(generateAvatarSvg(6, userInitials[5], avatarColors[5]))}`
];

// Function to get avatar URL for a user
// This will return the data URL if the avatar file is not available
export const getAvatarUrl = (userId: number): string => {
  // Try to use the actual image file first
  const avatarFile = `avatar${userId}.jpg`;
  
  // Return the data URL as a fallback
  return avatarDataUrls[userId - 1];
};

// Export avatar data for each user
export const avatars = [
  { id: 1, initial: userInitials[0], name: userNames[0], color: avatarColors[0], dataUrl: avatarDataUrls[0] },
  { id: 2, initial: userInitials[1], name: userNames[1], color: avatarColors[1], dataUrl: avatarDataUrls[1] },
  { id: 3, initial: userInitials[2], name: userNames[2], color: avatarColors[2], dataUrl: avatarDataUrls[2] },
  { id: 4, initial: userInitials[3], name: userNames[3], color: avatarColors[3], dataUrl: avatarDataUrls[3] },
  { id: 5, initial: userInitials[4], name: userNames[4], color: avatarColors[4], dataUrl: avatarDataUrls[4] },
  { id: 6, initial: userInitials[5], name: userNames[5], color: avatarColors[5], dataUrl: avatarDataUrls[5] }
];

export default avatars;
