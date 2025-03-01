import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OfflineAction {
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

const OFFLINE_ACTIONS_KEY = 'naijahub_offline_actions';
const OFFLINE_DATA_KEY = 'naijahub_offline_data';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineActions();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data for offline access
  const saveForOffline = async (key: string, data: any) => {
    try {
      const offlineData = JSON.parse(localStorage.getItem(OFFLINE_DATA_KEY) || '{}');
      offlineData[key] = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  // Queue action for offline sync
  const queueOfflineAction = (action: OfflineAction) => {
    try {
      const actions = JSON.parse(localStorage.getItem(OFFLINE_ACTIONS_KEY) || '[]');
      actions.push(action);
      localStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(actions));
    } catch (error) {
      console.error('Error queuing offline action:', error);
    }
  };

  // Sync offline actions when back online
  const syncOfflineActions = async () => {
    if (isSyncing || !navigator.onLine) return;

    try {
      setIsSyncing(true);
      const actions = JSON.parse(localStorage.getItem(OFFLINE_ACTIONS_KEY) || '[]') as OfflineAction[];
      
      if (actions.length === 0) {
        setIsSyncing(false);
        return;
      }

      // Sort actions by timestamp
      actions.sort((a, b) => a.timestamp - b.timestamp);

      for (const action of actions) {
        try {
          switch (action.type) {
            case 'create':
              await supabase.from(action.table).insert(action.data);
              break;
            case 'update':
              await supabase
                .from(action.table)
                .update(action.data)
                .eq('id', action.data.id);
              break;
            case 'delete':
              await supabase
                .from(action.table)
                .delete()
                .eq('id', action.data.id);
              break;
          }
        } catch (error) {
          console.error(`Error syncing action:`, action, error);
          // Keep failed actions for retry
          continue;
        }
      }

      // Clear synced actions
      localStorage.setItem(OFFLINE_ACTIONS_KEY, '[]');
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries();
      
      toast.success('All changes synced successfully');
    } catch (error) {
      console.error('Error syncing offline actions:', error);
      toast.error('Error syncing changes');
    } finally {
      setIsSyncing(false);
    }
  };

  // Get offline data
  const getOfflineData = (key: string) => {
    try {
      const offlineData = JSON.parse(localStorage.getItem(OFFLINE_DATA_KEY) || '{}');
      return offlineData[key]?.data;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  };

  return {
    isOnline,
    isSyncing,
    saveForOffline,
    queueOfflineAction,
    getOfflineData,
    syncOfflineActions,
  };
};
