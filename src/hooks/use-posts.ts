import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOfflineSync } from './use-offline-sync';
import { toast } from 'sonner';
import type { Post } from '@/types/post';

export const usePosts = (categoryId?: string) => {
  const queryClient = useQueryClient();
  const { isOnline, saveForOffline, queueOfflineAction, getOfflineData } = useOfflineSync();

  // Query for fetching posts
  const { data: posts, ...queryRest } = useQuery<Post[]>({
    queryKey: ['posts', categoryId || 'all'],
    queryFn: async () => {
      if (!isOnline) {
        // Return cached data when offline
        const cachedPosts = getOfflineData(`posts_${categoryId || 'all'}`);
        if (cachedPosts) return cachedPosts;
        throw new Error('No cached data available offline');
      }

      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles!inner (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const formattedPosts = data.map(post => ({
        ...post,
        user: {
          id: post.user_id,
          username: post.profiles?.username || 'Unknown User',
          avatar_url: post.profiles?.avatar_url
        },
        categories: {
          name: post.categories?.name || ''
        },
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];

      // Cache data for offline use
      saveForOffline(`posts_${categoryId || 'all'}`, formattedPosts);
      
      return formattedPosts;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  // Create post mutation
  const createPost = useMutation({
    mutationFn: async (newPost: Partial<Post>) => {
      if (!isOnline) {
        // Queue for later sync
        queueOfflineAction({
          type: 'create',
          table: 'posts',
          data: newPost,
          timestamp: Date.now(),
        });
        toast.success('Post saved offline. Will sync when online.');
        return null;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Update post mutation
  const updatePost = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Post> & { id: string }) => {
      if (!isOnline) {
        queueOfflineAction({
          type: 'update',
          table: 'posts',
          data: { id, ...updates },
          timestamp: Date.now(),
        });
        toast.success('Update saved offline. Will sync when online.');
        return null;
      }

      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      if (!isOnline) {
        queueOfflineAction({
          type: 'delete',
          table: 'posts',
          data: { id },
          timestamp: Date.now(),
        });
        toast.success('Delete saved offline. Will sync when online.');
        return null;
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    posts,
    ...queryRest,
    createPost,
    updatePost,
    deletePost,
    isOnline,
  };
};
