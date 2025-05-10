import { CreateLogiskVedlegg } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/create';
import { LogiskeVedleggListItemStyle } from '@app/components/documents/styled-components/attachment-list';
import type { LogiskVedlegg } from '@app/types/arkiverte-documents';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback, useRef, useState } from 'react';

interface Props {
  hasVedlegg: boolean;
  index: number;
  top: number;
  logiskeVedlegg: LogiskVedlegg[];
  temaId: string | null;
  dokumentInfoId: string;
}

export const AddLogiskVedlegg = ({ hasVedlegg, index, top, dokumentInfoId, logiskeVedlegg, temaId }: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isAdding, setIsAdding] = useState(false);

  const onClose = useCallback(() => {
    setIsAdding(false);
    setTimeout(() => {
      ref.current?.focus();
    }, 0);
  }, []);

  return (
    <LogiskeVedleggListItemStyle
      key="logisk-vedlegg_add"
      style={{ top }}
      aria-rowindex={index}
      connected={hasVedlegg}
      role="treeitem"
    >
      {isAdding ? (
        <CreateLogiskVedlegg
          dokumentInfoId={dokumentInfoId}
          logiskeVedlegg={logiskeVedlegg}
          temaId={temaId}
          onClose={onClose}
        />
      ) : (
        <Button
          variant="tertiary-neutral"
          size="xsmall"
          icon={<PlusCircleIcon aria-hidden />}
          onClick={() => setIsAdding(true)}
          ref={ref}
          tabIndex={-1}
        >
          <span className="font-normal">Legg til logisk vedlegg</span>
        </Button>
      )}
    </LogiskeVedleggListItemStyle>
  );
};
