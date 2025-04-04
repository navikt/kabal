import { toast } from '@app/components/toast/store';
import { useCallback, useRef, useState } from 'react';

export const useSendDebugInfo = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendDebugInfo = useCallback(async (body: string) => {
    setLoading(true);
    setSuccess(false);

    if (timeout.current !== null) {
      clearTimeout(timeout.current);
    }

    try {
      const res = await fetch('/debug', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setSuccess(true);
      toast.success('Teknisk informasjon er sendt til Team Klage');

      timeout.current = setTimeout(() => {
        setSuccess(false);
      }, 3_000);
    } catch (error) {
      console.error('Failed to send debug info to Team Klage', error instanceof Error ? error.message : error);
      toast.error(
        'Klarte ikke sende teknisk informasjon til Team Klage. Teknisk informasjon er kopiert til utklippstavlen din.',
      );
      navigator.clipboard.writeText(body);
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendDebugInfo, loading, success };
};
