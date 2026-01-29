import { useUtfall } from '@app/simple-api-state/use-kodeverk';
import type { UtfallEnum } from '@app/types/kodeverk';
import { Tag, type TagProps } from '@navikt/ds-react';
import { useMemo } from 'react';

interface Props {
  utfallId: UtfallEnum | null;
  fallback?: string;
  size?: TagProps['size'];
}

export const UtfallTag = ({ utfallId, size = 'small', fallback }: Props) => {
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
    <Tag data-color="meta-purple" size={size} variant="outline">
      {name}
    </Tag>
  );
};
