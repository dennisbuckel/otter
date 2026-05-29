import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

interface GlobalStyleProps {
  theme: Theme;
}

const GlobalStyles = createGlobalStyle<GlobalStyleProps>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: ${({ theme }) => theme.colors.secondary}; }
  }

  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.main};
    border: none;
    background: none;
    &:disabled { cursor: not-allowed; opacity: 0.6; }
  }

  input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.main};
    font-size: 1rem;
  }

  /* Scrollbar */
  ::-webkit-scrollbar        { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track  { background: transparent; }
  ::-webkit-scrollbar-thumb  { background: ${({ theme }) => theme.colors.border}; border-radius: 3px; }

  /* ─── Animations ─────────────────────────────────────────────────────────── */
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(16px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  @keyframes slideDown {
    from { transform: translateY(-16px); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }

  @keyframes pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15%  { transform: translateX(-8px); }
    30%  { transform: translateX(8px); }
    45%  { transform: translateX(-6px); }
    60%  { transform: translateX(6px); }
    75%  { transform: translateX(-3px); }
    90%  { transform: translateX(3px); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .fade-in  { animation: fadeIn  0.4s ease forwards; }
  .slide-up { animation: slideUp 0.4s ease forwards; }
  .shake    { animation: shake   0.5s ease; }
`;

export default GlobalStyles;
