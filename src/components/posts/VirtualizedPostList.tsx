import { useRef, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryClient } from '@tanstack/react-query';
import { PostCard } from '../PostCard';
import { NewPostIndicator } from './NewPostIndicator';
import { PullToRefresh } from '../mobile/PullToRefresh';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Post } from '@/types/post';

interface VirtualizedPostListProps {
  posts: Post[];
  categoryId?: string;
}

export const VirtualizedPostList = ({ posts, categoryId }: VirtualizedPostListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState(Date.now());
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => isMobile ? 250 : 300, // Adjust size for mobile
    overscan: 5
  });

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries(['posts', categoryId || 'all']);
    setNewPostsCount(0);
    setLastViewedTimestamp(Date.now());
  }, [queryClient, categoryId]);

  // Check for new posts
  useEffect(() => {
    const newPosts = posts.filter(
      post => new Date(post.created_at).getTime() > lastViewedTimestamp
    ).length;
    setNewPostsCount(newPosts);
  }, [posts, lastViewedTimestamp]);

  const handleNewPostsClick = () => {
    if (parentRef.current) {
      parentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    setNewPostsCount(0);
    setLastViewedTimestamp(Date.now());
  };

  // Reset new posts count when scrolled to top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      setNewPostsCount(0);
      setLastViewedTimestamp(Date.now());
    }
  };

  // Touch gestures for mobile
  useTouchGestures(parentRef, {
    onSwipeLeft: () => {
      // Navigate to next category if available
    },
    onSwipeRight: () => {
      // Navigate to previous category if available
    },
  });

  const postList = (
    <div 
      ref={parentRef} 
      className="h-[800px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent md:px-4"
      onScroll={handleScroll}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              width: '100%',
              padding: isMobile ? '0.5rem' : '0 1rem',
            }}
          >
            <PostCard post={posts[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {postList}
        </PullToRefresh>
      ) : (
        postList
      )}
      <NewPostIndicator count={newPostsCount} onClick={handleNewPostsClick} />
    </>
  );
};
