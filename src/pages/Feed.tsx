import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaComment, FaRegComment, FaPaperPlane } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useDatabase } from '../db/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getPhotoUrlWithFallback } from '../utils/assetUtils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Photo {
  id: number; url: string; description: string;
  date_taken: string; uploaded_by: number; created_at: string;
  uploader_name?: string; likes_count?: number;
  comments_count?: number; is_liked?: boolean;
}
interface Comment {
  id: number; photo_id: number; user_id: number;
  content: string; created_at: string;
  username?: string; display_name?: string;
}

// ─── Styled Components ────────────────────────────────────────────────────────
const FeedWrap = styled.div`
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PostCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: 10px;
`;

const PostAvatar = styled.div<{ src: string }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const PostMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostUser = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PostDate = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  margin-top: 1px;
`;

const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
`;

const PostBody = styled.div`
  padding: 10px ${({ theme }) => theme.spacing.md};
`;

const PostCaption = styled.p`
  font-size: 0.9rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 8px ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border}44;
`;

const ActionBtn = styled.button<{ $liked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $liked, theme }) => $liked ? theme.colors.error : theme.colors.textMuted ?? '#888'};
  transition: color 0.15s ease, transform 0.15s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;

  svg { font-size: 1.1rem; }

  &:hover {
    color: ${({ $liked, theme }) => $liked ? theme.colors.error : theme.colors.text};
    transform: scale(1.05);
  }
`;

const CommentSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border}44;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;

const CommentItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CommentAvatar = styled.div<{ src: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const CommentBubble = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 6px 10px;
  flex: 1;
  min-width: 0;
`;

const CommentAuthor = styled.span`
  font-weight: 700;
  font-size: 0.8rem;
  margin-right: 6px;
  color: ${({ theme }) => theme.colors.text};
`;

const CommentText = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text};
`;

const CommentForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const CommentInput = styled.input`
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted ?? '#aaa'}; }
`;

const SendBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.85rem;
  transition: background 0.2s, transform 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.secondary}; transform: scale(1.05); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const EmptyFeed = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted ?? '#888'};
  font-size: 0.9rem;
`;

// ─── Hilfsfunktion ────────────────────────────────────────────────────────────
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });

// ─── Komponente ───────────────────────────────────────────────────────────────
const Feed: React.FC = () => {
  const [photos, setPhotos]                   = useState<Photo[]>([]);
  const [comments, setComments]               = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment]           = useState('');
  const [activePhotoId, setActivePhotoId]     = useState<number | null>(null);
  const [isLoading, setIsLoading]             = useState(true);

  const { executeQuery } = useDatabase();
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      const raw = executeQuery(`
        SELECT p.*, u.display_name as uploader_name
        FROM photos p LEFT JOIN users u ON p.uploaded_by = u.id
        ORDER BY p.date_taken DESC
      `) as Photo[];

      const enriched = raw.map(p => {
        const likesCount = executeQuery(
          'SELECT COUNT(*) as c FROM likes WHERE photo_id = ?', [p.id]
        )[0]?.c ?? 0;
        const commentsCount = executeQuery(
          'SELECT COUNT(*) as c FROM comments WHERE photo_id = ?', [p.id]
        )[0]?.c ?? 0;
        let isLiked = false;
        if (currentUser) {
          isLiked = executeQuery(
            'SELECT 1 FROM likes WHERE photo_id = ? AND user_id = ?',
            [p.id, currentUser.id]
          ).length > 0;
        }
        return { ...p, likes_count: likesCount, comments_count: commentsCount, is_liked: isLiked };
      });
      setPhotos(enriched);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [executeQuery, currentUser]);

  const toggleLike = (photoId: number) => {
    if (!currentUser) return;
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;
      if (photo.is_liked) {
        executeQuery('DELETE FROM likes WHERE photo_id = ? AND user_id = ?', [photoId, currentUser.id]);
        setPhotos(prev => prev.map(p =>
          p.id === photoId ? { ...p, is_liked: false, likes_count: (p.likes_count ?? 0) - 1 } : p
        ));
      } else {
        executeQuery('INSERT INTO likes (photo_id, user_id) VALUES (?, ?)', [photoId, currentUser.id]);
        setPhotos(prev => prev.map(p =>
          p.id === photoId ? { ...p, is_liked: true, likes_count: (p.likes_count ?? 0) + 1 } : p
        ));
      }
    } catch (e) { console.error(e); }
  };

  const toggleComments = (photoId: number) => {
    if (activePhotoId === photoId) { setActivePhotoId(null); return; }
    setActivePhotoId(photoId);
    if (!comments[photoId]) {
      try {
        const data = executeQuery(`
          SELECT c.*, u.username, u.display_name
          FROM comments c JOIN users u ON c.user_id = u.id
          WHERE c.photo_id = ? ORDER BY c.created_at ASC
        `, [photoId]) as Comment[];
        setComments(prev => ({ ...prev, [photoId]: data }));
      } catch (e) { console.error(e); }
    }
  };

  const addComment = (e: React.FormEvent, photoId: number) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;
    try {
      executeQuery(
        'INSERT INTO comments (photo_id, user_id, content) VALUES (?, ?, ?)',
        [photoId, currentUser.id, newComment.trim()]
      );
      const created = executeQuery(`
        SELECT c.*, u.username, u.display_name
        FROM comments c JOIN users u ON c.user_id = u.id
        WHERE c.photo_id = ? AND c.user_id = ? ORDER BY c.id DESC LIMIT 1
      `, [photoId, currentUser.id])[0] as Comment;

      setComments(prev => ({ ...prev, [photoId]: [...(prev[photoId] || []), created] }));
      setPhotos(prev => prev.map(p =>
        p.id === photoId ? { ...p, comments_count: (p.comments_count ?? 0) + 1 } : p
      ));
      setNewComment('');
    } catch (e) { console.error(e); }
  };

  if (isLoading) return <Layout title="Feed"><EmptyFeed>Lade Feed…</EmptyFeed></Layout>;

  return (
    <Layout title="Feed">
      <FeedWrap>
        {photos.length === 0 && <EmptyFeed>Noch keine Fotos vorhanden.</EmptyFeed>}

        {photos.map(photo => (
          <PostCard key={photo.id}>
            <PostHeader>
              <PostAvatar src={getAvatarUrl(`avatar${photo.uploaded_by}.jpg`)} />
              <PostMeta>
                <PostUser>{photo.uploader_name}</PostUser>
                <PostDate>{formatDate(photo.date_taken)}</PostDate>
              </PostMeta>
            </PostHeader>

            <PostImage
              src={getPhotoUrlWithFallback(photo.url, photo.id)}
              alt={photo.description}
              loading="lazy"
            />

            {photo.description && (
              <PostBody>
                <PostCaption>{photo.description}</PostCaption>
              </PostBody>
            )}

            <PostActions>
              <ActionBtn $liked={photo.is_liked} onClick={() => toggleLike(photo.id)}>
                {photo.is_liked ? <FaHeart /> : <FaRegHeart />}
                {photo.likes_count ?? 0}
              </ActionBtn>
              <ActionBtn onClick={() => toggleComments(photo.id)}>
                {activePhotoId === photo.id ? <FaComment /> : <FaRegComment />}
                {photo.comments_count ?? 0}
              </ActionBtn>
            </PostActions>

            {activePhotoId === photo.id && (
              <CommentSection>
                {(comments[photo.id] || []).map(c => (
                  <CommentItem key={c.id}>
                    <CommentAvatar src={getAvatarUrl(`avatar${c.user_id}.jpg`)} />
                    <CommentBubble>
                      <CommentAuthor>{c.display_name}</CommentAuthor>
                      <CommentText>{c.content}</CommentText>
                    </CommentBubble>
                  </CommentItem>
                ))}

                {isAuthenticated && (
                  <CommentForm onSubmit={e => addComment(e, photo.id)}>
                    <CommentAvatar src={getAvatarUrl(`avatar${currentUser?.id}.jpg`)} />
                    <CommentInput
                      placeholder="Kommentar schreiben…"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <SendBtn type="submit" disabled={!newComment.trim()}>
                      <FaPaperPlane />
                    </SendBtn>
                  </CommentForm>
                )}
              </CommentSection>
            )}
          </PostCard>
        ))}
      </FeedWrap>
    </Layout>
  );
};

export default Feed;
