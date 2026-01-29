import { useState, useEffect } from 'react';
import { Goll } from '@/entities/goll/model/types';
import { getGolls } from '../api';

export const useGolls = () => {
  const [golls, setGolls] = useState<Goll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGolls();
        setGolls(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { golls: golls, loading, error };
};
