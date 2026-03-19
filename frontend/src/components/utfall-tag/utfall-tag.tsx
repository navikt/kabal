import { Tag, type TagProps } from '@navikt/ds-react';
import { useMemo } from 'react';
import { useUtfall } from '@/simple-api-state/use-kodeverk';
import type { UtfallEnum } from '@/types/kodeverk';

interface Props {
  utfallId: UtfallEnum | null;
  fallback?: string;
  size?: TagProps['size'];
  className?: string;
}

export const UtfallTag = ({ utfallId, size = 'small', fallback, className }: Props) => {
  const { data: utfall } = useUtfall();

  const name = useMemo(() => {
    if (utfall === undefined) {
      return 'Laster...';
    }

    if (utfallId === null) {
      return fallback ?? 'Utfall mangler';
    }

    return utfall.find((u) => u.id === utfallId)?.navn ?? utfallId;
  }, [utfall, utfallId, fallback]);

  return (
    <Tag data-color="meta-purple" size={size} variant="outline" className={className}>
      {name}
    </Tag>
  );
};
