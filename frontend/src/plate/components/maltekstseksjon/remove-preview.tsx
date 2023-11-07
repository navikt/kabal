import { FileSearchIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import React, { useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { CustomTag } from '@app/components/tags/resolved-tag';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useRegistreringshjemlerMap, useUtfall } from '@app/simple-api-state/use-kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

interface Props {
  oppgave: IOppgavebehandling;
}

export const RemovePreview = ({ oppgave }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data: registreringshjemlerMap = {} } = useRegistreringshjemlerMap();
  const { data: utfall = [] } = useUtfall();
  useOnClickOutside(ref, () => setIsOpen(false), true);

  const { utfallId, extraUtfallIdSet, hjemmelIdSet } = oppgave.resultat;
  const hasHovedutfall = utfallId !== null;

  const utfallTags = useMemo(() => {
    if (hasHovedutfall) {
      if (extraUtfallIdSet.includes(utfallId)) {
        return extraUtfallIdSet.map((id) => (
          <CustomTag key={id} variant="utfallIdList">
            {utfall.find((u) => u.id === id)?.navn ?? id}
          </CustomTag>
        ));
      }

      return [utfallId, ...extraUtfallIdSet].map((id) => (
        <CustomTag key={id} variant="utfallIdList">
          {utfall.find((u) => u.id === id)?.navn ?? id}
        </CustomTag>
      ));
    }

    if (extraUtfallIdSet.length === 0) {
      return <CustomTag variant="utfallIdList">Ingen utfall</CustomTag>;
    }
  }, [extraUtfallIdSet, hasHovedutfall, utfall, utfallId]);

  const hjemlerTags = useMemo(() => {
    if (hjemmelIdSet.length === 0) {
      return <CustomTag variant="ytelseHjemmelIdList">Ingen hjemler</CustomTag>;
    }

    return hjemmelIdSet.map((id) => (
      <CustomTag key={id} variant="ytelseHjemmelIdList">
        {registreringshjemlerMap[id]?.hjemmelnavn ?? id}
      </CustomTag>
    ));
  }, [hjemmelIdSet, registreringshjemlerMap]);

  return (
    <RemovePreviewContainer ref={ref}>
      <Button
        size="xsmall"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        icon={<FileSearchIcon aria-hidden />}
      >
        Forhåndsvisning
      </Button>
      {isOpen ? (
        <RemovePreviewPopup>
          {hasHovedutfall ? null : (
            <Alert variant="warning" size="small">
              Hovedutfall mangler!
            </Alert>
          )}
          <Alert variant="info" size="small">
            <div>Ingen tekst som passer for utfall:</div>
            <TagContainer>{utfallTags}</TagContainer>
            <div>og hjemler:</div>
            <TagContainer>{hjemlerTags}</TagContainer>
            <div>Den eksisterende teksten vil bli fjernet.</div>
          </Alert>
        </RemovePreviewPopup>
      ) : null}
    </RemovePreviewContainer>
  );
};

const TagContainer = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  column-gap: 4px;
  row-gap: 4px;
`;

const RemovePreviewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RemovePreviewPopup = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: auto;
  padding: 8px;
  z-index: 22;
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  background-color: white;
  width: 450px;
  user-select: text;
`;
