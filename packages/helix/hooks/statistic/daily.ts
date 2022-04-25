import { Network, DailyStatistic } from '@helix/shared/model';
import { useQuery } from 'graphql-hooks';

const STATISTICS_QUERY = `
  query dailyStatistics($timepast: Int!, $chain: String) {
    dailyStatistics(timepast: $timepast, chain: $chain) {
      dailyCount
      dailyVolume
      id
    }
  }
`;

// eslint-disable-next-line no-magic-numbers
export const TIMEPAST = 6 * 30 * 24 * 3600;

export function useDailyStatistic(chain?: Network, timepast?: number) {
  const { data, loading } = useQuery<{ dailyStatistics: DailyStatistic[] }>(STATISTICS_QUERY, {
    variables: { timepast: timepast ?? TIMEPAST, chain },
  });

  return { data, loading };
}