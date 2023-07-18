import { EyeObfuscatedIcon } from '@navikt/aksel-icons';
import { Alert, Button, Tooltip } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { IArkivertDocument } from '@app/types/arkiverte-documents';

export interface InvisibleWarningProps {
  allDocuments: IArkivertDocument[];
  slicedFilteredDocuments: IArkivertDocument[];
  totalLengthWithVedlegg: number;
}

export const InvisibleWarning = ({ slicedFilteredDocuments, totalLengthWithVedlegg }: InvisibleWarningProps) => {
  const { selectedDocuments, unselectMany } = useContext(SelectContext);
  const [isExpanded] = useIsExpanded();

  const invisibleDocuments = useMemo(
    () =>
      Object.values(selectedDocuments).filter(
        ({ journalpostId, dokumentInfoId }) =>
          slicedFilteredDocuments.find((filteredDoc) => {
            if (filteredDoc.journalpostId === journalpostId) {
              if (filteredDoc.dokumentInfoId === dokumentInfoId) {
                return true;
              }

              return filteredDoc.vedlegg.find((v) => v.dokumentInfoId === dokumentInfoId) !== undefined;
            }

            return false;
          }) === undefined,
      ),
    [selectedDocuments, slicedFilteredDocuments],
  );

  if (invisibleDocuments.length === 0) {
    const numSelected = Object.keys(selectedDocuments).length;

    if (numSelected === 0) {
      if (isExpanded) {
        return null;
      }

      // Always show this alert when not expanded, to prevent jumping UI.
      return (
        <Alert variant="info" size="small" inline>
          Ingen enkeltdokumenter valgt
        </Alert>
      );
    }

    return (
      <Alert variant="info" size="small" inline>
        {numSelected}/{totalLengthWithVedlegg} enkeltdokumenter valgt
      </Alert>
    );
  }

  return (
    <StyledAlert variant="warning" size="small" inline>
      <AlertContent>
        <span>
          {invisibleDocuments.length === 1
            ? '1 skjult dokument er valgt.'
            : `${invisibleDocuments.length} skjulte dokumenter er valgt.`}
        </span>
        <Tooltip content="Fjern skjulte dokumenter fra utvalget">
          <Button
            size="xsmall"
            variant="tertiary"
            onClick={() => unselectMany(invisibleDocuments)}
            icon={<EyeObfuscatedIcon aria-hidden />}
          />
        </Tooltip>
      </AlertContent>
    </StyledAlert>
  );
};

const StyledAlert = styled(Alert)`
  display: flex;
  align-items: center;
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;
