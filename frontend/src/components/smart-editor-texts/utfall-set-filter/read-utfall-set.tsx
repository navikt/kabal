import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { CustomTag } from '@/components/tags/resolved-tag';
import { UtfallTag } from '@/components/utfall-tag/utfall-tag';
import type { UtfallEnum } from '@/types/kodeverk';

interface ReadUtfallSetProps {
  utfallSet: UtfallEnum[];
  onDelete: () => void;
  editUtfallSet: () => void;
}

export const ReadUtfallSet = ({ utfallSet, onDelete, editUtfallSet }: ReadUtfallSetProps) => (
  <HStack justify="space-between">
    <HStack align="center" gap="space-4" wrap>
      {utfallSet.length === 0 ? (
        <CustomTag variant="utfallIdList">Alle utfall</CustomTag>
      ) : (
        utfallSet.map((u) => <UtfallTag key={u} utfallId={u} />)
      )}
    </HStack>
    <HStack align="start" wrap={false} className="self-start">
      <Button
        data-color="neutral"
        variant="tertiary"
        size="xsmall"
        icon={<PencilIcon aria-hidden />}
        onClick={editUtfallSet}
        title="Endre"
      />
      <Button
        data-color="neutral"
        variant="tertiary"
        size="xsmall"
        icon={<TrashIcon aria-hidden />}
        onClick={onDelete}
        title="Slett"
      />
    </HStack>
  </HStack>
);
