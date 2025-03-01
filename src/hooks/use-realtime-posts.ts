import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Post } from '@/types/post';

export const useRealtimePosts = (categoryId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Create a channel for posts
    const channel = supabase
      .channel('posts_channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'posts',
          ...(categoryId && { filter: `category_id=eq.${categoryId}` }),
        },
        async (payload) => {
          // Get the current posts from the cache
          const queryKey = ['posts', categoryId || 'all'];
          const previousPosts = queryClient.getQueryData<Post[]>(queryKey) || [];

          if (payload.eventType === 'INSERT') {
            // Fetch the complete post data with relations
            const { data: newPost } = await supabase
              .from('posts')
              .select(`
                *,
                profiles!inner (username, avatar_url),
                categories!posts_category_id_fkey (name),
                likes (count),
                comments (count)
              `)
              .eq('id', payload.new.id)
              .single();

            if (newPost) {
              // Format the post data
              const formattedPost = {
                ...newPost,
                user: {
                  id: newPost.user_id,
                  username: newPost.profiles?.username || 'Unknown User',
                  avatar_url: newPost.profiles?.avatar_url
                },
                categories: {
                  name: newPost.categories?.name || ''
                },
                _count: {
                  likes: newPost.likes?.[0]?.count || 0,
                  comments: newPost.comments?.[0]?.count || 0
                }
              } as Post;

              // Add new post to the beginning of the list
              queryClient.setQueryData(queryKey, [formattedPost, ...previousPosts]);
            }
          } else if (payload.eventType === 'UPDATE') {
            // Update existing post
            queryClient.setQueryData(
              queryKey,
              previousPosts.map((post) =>
                post.id === payload.new.id ? { ...post, ...payload.new } : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted post
            queryClient.setQueryData(
              queryKey,
              previousPosts.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, categoryId]);
};
