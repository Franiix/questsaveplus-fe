import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { GameCommunityRating } from '@/shared/models/GameCommunityRating.model';

export function useGameCommunityRating(gameId: number) {
 return useQuery({
  queryKey: ['game-community-rating', gameId],
  enabled: gameId > 0,
  staleTime: 60 * 1000,
  queryFn: async (): Promise<GameCommunityRating> => {
   const { data, error } = await supabase
    .from('backlog_items')
    .select('personal_rating')
    .eq('game_id', gameId)
    .not('personal_rating', 'is', null);

   if (error) {
    throw error;
   }

   const ratings = (data ?? [])
    .map((item) => item.personal_rating)
    .filter((rating): rating is number => rating !== null);

   if (ratings.length === 0) {
    return { averageRating: null, ratingsCount: 0 };
   }

   const total = ratings.reduce((sum, rating) => sum + rating, 0);

   return {
    averageRating: Math.round((total / ratings.length) * 10) / 10,
    ratingsCount: ratings.length,
   };
  },
 });
}
