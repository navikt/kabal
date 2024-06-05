import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { CreateLogiskVedlegg } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/create';
import { LogiskeVedleggListItemStyle } from '@app/components/documents/styled-components/attachment-list';
import { LogiskVedlegg } from '@app/types/arkiverte-documents';

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
      $connected={hasVedlegg}
      $paddingLeft={10}
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
        >
          <ButtonText>Legg til logisk vedlegg</ButtonText>
        </Button>
      )}
    </LogiskeVedleggListItemStyle>
  );
};

const ButtonText = styled.span`
  font-weight: normal;
`;
