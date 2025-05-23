import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useDatabase } from '../db/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, getPhotoUrlWithFallback } from '../utils/assetUtils';

interface Photo {
  id: number;
  url: string;
  description: string;
  date_taken: string;
  uploaded_by: number;
  created_at: string;
  uploader_name?: string;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

interface Comment {
  id: number;
  photo_id: number;
  user_id: number;
  content: string;
  created_at: string;
  username?: string;
  display_name?: string;
}

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const PhotoCard = styled(Card)`
  overflow: hidden;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const PhotoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PhotoAvatar = styled.div<{ src: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const PhotoInfo = styled.div`
  flex: 1;
`;

const PhotoUser = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`;

const PhotoDate = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text}aa;
`;

const PhotoDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  margin-right: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
    font-size: 1.2rem;
  }
  
  &.liked {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const CommentsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const CommentItem = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CommentAvatar = styled.div<{ src: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  margin-right: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const CommentUser = styled.span`
  font-weight: 600;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const CommentText = styled.span`
  font-size: 0.9rem;
`;

const CommentForm = styled.form`
  display: flex;
  margin-top: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CommentInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Feed: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState<string>('');
  const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { executeQuery } = useDatabase();
  const { currentUser, isAuthenticated } = useAuth();
  
  // Fetch photos and related data
  useEffect(() => {
    const fetchPhotos = () => {
      try {
        // Get all photos with uploader info
        const photosData = executeQuery(`
          SELECT p.*, u.display_name as uploader_name
          FROM photos p
          LEFT JOIN users u ON p.uploaded_by = u.id
          ORDER BY RANDOM()
        `);
        
  // Get likes count for each photo
  const photosWithLikes = photosData.map((photo: Photo) => {
    // Generate random high numbers for likes (between 6000 and 25000)
    const likesCount = Math.floor(Math.random() * 19000) + 6000;
    
    const commentsCount = executeQuery(`
      SELECT COUNT(*) as count FROM comments WHERE photo_id = ?
    `, [photo.id])[0].count;
    
    let isLiked = false;
    if (currentUser) {
      const likeCheck = executeQuery(`
        SELECT * FROM likes WHERE photo_id = ? AND user_id = ?
      `, [photo.id, currentUser.id]);
      isLiked = likeCheck.length > 0;
    }
    
    return {
      ...photo,
      likes_count: likesCount,
      comments_count: commentsCount,
      is_liked: isLiked
    };
  });
        
        setPhotos(photosWithLikes);
      } catch (err) {
        console.error('Error fetching photos:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPhotos();
  }, [executeQuery, currentUser]);
  
  // Toggle comments visibility and load comments if needed
  const toggleComments = (photoId: number) => {
    if (activePhotoId === photoId) {
      setActivePhotoId(null);
      return;
    }
    
    setActivePhotoId(photoId);
    
    // Load comments if not already loaded
    if (!comments[photoId]) {
      try {
        const commentsData = executeQuery(`
          SELECT c.*, u.username, u.display_name
          FROM comments c
          JOIN users u ON c.user_id = u.id
          WHERE c.photo_id = ?
          ORDER BY c.created_at ASC
        `, [photoId]);
        
        setComments(prev => ({
          ...prev,
          [photoId]: commentsData
        }));
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
  };
  
  // Toggle like on a photo
  const toggleLike = (photoId: number) => {
    if (!isAuthenticated || !currentUser) return;
    
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;
      
      if (photo.is_liked) {
        // Unlike
        executeQuery(`
          DELETE FROM likes
          WHERE photo_id = ? AND user_id = ?
        `, [photoId, currentUser.id]);
        
        setPhotos(prev => 
          prev.map(p => 
            p.id === photoId 
              ? { ...p, is_liked: false, likes_count: (p.likes_count || 0) - 1 } 
              : p
          )
        );
      } else {
        // Like
        executeQuery(`
          INSERT INTO likes (photo_id, user_id)
          VALUES (?, ?)
        `, [photoId, currentUser.id]);
        
        setPhotos(prev => 
          prev.map(p => 
            p.id === photoId 
              ? { ...p, is_liked: true, likes_count: (p.likes_count || 0) + 1 } 
              : p
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  
  // Add a new comment
  const addComment = (e: React.FormEvent, photoId: number) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser || !newComment.trim()) return;
    
    try {
      executeQuery(`
        INSERT INTO comments (photo_id, user_id, content)
        VALUES (?, ?, ?)
      `, [photoId, currentUser.id, newComment.trim()]);
      
      // Get the newly created comment
      const newCommentData = executeQuery(`
        SELECT c.*, u.username, u.display_name
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.photo_id = ? AND c.user_id = ?
        ORDER BY c.created_at DESC
        LIMIT 1
      `, [photoId, currentUser.id])[0];
      
      // Update comments state
      setComments(prev => ({
        ...prev,
        [photoId]: [...(prev[photoId] || []), newCommentData]
      }));
      
      // Update comments count
      setPhotos(prev => 
        prev.map(p => 
          p.id === photoId 
            ? { ...p, comments_count: (p.comments_count || 0) + 1 } 
            : p
        )
      );
      
      // Clear input
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <Layout title="Feed">
        <div>Loading...</div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Photo Feed">
      <FeedContainer>
        {photos.map(photo => (
          <PhotoCard key={photo.id}>
            <PhotoHeader>
              <PhotoAvatar src={getAvatarUrl(`avatar${photo.uploaded_by}.jpg`)} />
              <PhotoInfo>
                <PhotoUser>{photo.uploader_name}</PhotoUser>
                <PhotoDate>{formatDate(photo.date_taken)}</PhotoDate>
              </PhotoInfo>
            </PhotoHeader>
            
            <PhotoImage src={getPhotoUrlWithFallback(photo.url, photo.id)} alt={photo.description} />
            
            {photo.description && (
              <PhotoDescription>{photo.description}</PhotoDescription>
            )}
            
            <PhotoActions>
              <ActionButton 
                onClick={() => toggleLike(photo.id)} 
                className={photo.is_liked ? 'liked' : ''}
              >
                {photo.is_liked ? <FaHeart /> : <FaRegHeart />}
                {photo.likes_count || 0}
              </ActionButton>
              
              <ActionButton onClick={() => toggleComments(photo.id)}>
                <FaComment />
                {photo.comments_count || 0}
              </ActionButton>
            </PhotoActions>
            
            {activePhotoId === photo.id && (
              <CommentsSection>
                {comments[photo.id]?.map(comment => (
                  <CommentItem key={comment.id}>
                    <CommentAvatar src={getAvatarUrl(`avatar${comment.user_id}.jpg`)} />
                    <CommentContent>
                      <CommentUser>{comment.display_name}</CommentUser>
                      <CommentText>{comment.content}</CommentText>
                    </CommentContent>
                  </CommentItem>
                ))}
                
                {isAuthenticated && (
                  <CommentForm onSubmit={(e) => addComment(e, photo.id)}>
                    <CommentInput
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button type="submit" size="small">Post</Button>
                  </CommentForm>
                )}
              </CommentsSection>
            )}
          </PhotoCard>
        ))}
      </FeedContainer>
    </Layout>
  );
};

export default Feed;
