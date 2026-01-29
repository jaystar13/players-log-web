import { useState, useEffect } from 'react';
import { Log } from '@/entities/goll/model/types';
import { getLogs } from '../api';

export const useLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLogs();
        setLogs(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { logs, loading, error };
};
