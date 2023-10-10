import { Button, HelpText, Tag } from '@navikt/ds-react';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Dropdown } from '@app/components/filter-dropdown/dropdown';
import { isUtfall } from '@app/functions/is-utfall';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useUtfall } from '@app/hooks/use-utfall';
import { useUpdateExtraUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { UtfallEnum } from '@app/types/kodeverk';

interface Props {
  utfallIdSet: UtfallEnum[];
  mainUtfall: UtfallEnum | null;
  oppgaveId: string;
}

export const ExtraUtfall = ({ utfallIdSet, mainUtfall, oppgaveId }: Props) => {
  const [updateUtfall] = useUpdateExtraUtfallMutation();
  const canEdit = useCanEdit();
  const { data: oppgave } = useOppgave();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [utfallKodeverk] = useUtfall(oppgave?.typeId);

  useOnClickOutside(ref, () => setIsOpen(false), true);

  const options = useMemo(
    () =>
      utfallKodeverk.map(({ id, navn }) => ({
        value: id,
        label: navn,
        disabled: !canEdit || id === mainUtfall,
      })),
    [utfallKodeverk, canEdit, mainUtfall],
  );

  const selected = useMemo(() => {
    if (mainUtfall === null) {
      return utfallIdSet;
    }

    return utfallIdSet.includes(mainUtfall) ? utfallIdSet : [...utfallIdSet, mainUtfall];
  }, [utfallIdSet, mainUtfall]);

  return (
    <Container ref={ref}>
      <HelpTextWrapper>
        <Button variant="secondary" onClick={() => setIsOpen((o) => !o)} size="small">
          Sett ekstra utfall for tilpasset tekst
        </Button>
        <HelpText>
          <HelpTextContent>
            Her kan du velge flere utfall for å få opp maltekst som passer til flere utfall.
          </HelpTextContent>
        </HelpText>
      </HelpTextWrapper>
      <Popup isOpen={isOpen}>
        <Dropdown
          selected={selected}
          onChange={(newList) => updateUtfall({ oppgaveId, extraUtfallIdSet: newList.filter(isUtfall) })}
          options={options}
          open={isOpen}
          close={() => setIsOpen(false)}
        />
      </Popup>
      <TagsContainer>
        {mainUtfall === null ? null : (
          <Tag size="small" variant="alt1">
            {utfallKodeverk.find((u) => u.id === mainUtfall)?.navn ?? `Ukjent utfall (${mainUtfall})`} (hovedutfall)
          </Tag>
        )}
        {utfallIdSet.map((utfall) =>
          utfall === mainUtfall ? null : (
            <Tag key={utfall} size="small" variant="info">
              {utfallKodeverk.find((u) => u.id === utfall)?.navn ?? `Ukjent utfall (${utfall})`}
            </Tag>
          ),
        )}
      </TagsContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const Popup = ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) => {
  if (!isOpen) {
    return null;
  }

  return <StyledPopup>{children}</StyledPopup>;
};

const StyledPopup = styled.div`
  position: absolute;
  z-index: 1;
`;

const HelpTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HelpTextContent = styled.div`
  width: 300px;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 8px;
`;
