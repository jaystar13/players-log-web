import { useState, useEffect, useCallback } from 'react';
import { Goll } from '@/entities/goll/model/types';
import { getGolls } from '../api';

export const useGolls = () => {
  const [golls, setGolls] = useState<Goll[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGolls = useCallback(async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      // The getGolls from ../api now expects pagination and returns a Page<Goll>
      const pageData = await getGolls(pageNum);
      setGolls(prevGolls => pageNum === 0 ? pageData.content : [...prevGolls, ...pageData.content]);
      setHasMore(!pageData.last);
      setPage(pageNum + 1);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Initial fetch
  useEffect(() => {
    fetchGolls(0);
    // We only want this to run once on mount, so the dependency array is empty.
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchGolls(page);
    }
  }, [hasMore, loading, page, fetchGolls]);

  return { golls, loading, error, hasMore, loadMore };
};
