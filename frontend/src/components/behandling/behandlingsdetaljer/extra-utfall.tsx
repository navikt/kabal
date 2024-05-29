import { Button, HelpText, Label, Tag } from '@navikt/ds-react';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Dropdown } from '@app/components/filter-dropdown/dropdown';
import { isUtfall } from '@app/functions/is-utfall';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useUtfall } from '@app/hooks/use-utfall';
import { useUpdateExtraUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { UtfallEnum } from '@app/types/kodeverk';

interface TagsProps {
  utfallIdSet: UtfallEnum[];
  mainUtfall: UtfallEnum | null;
}

interface Props extends TagsProps {
  oppgaveId: string;
}

export const ExtraUtfall = (props: Props) => {
  const canEdit = useCanEdit();

  return (
    <Container>
      {canEdit ? <ExtraUtfallButton {...props} /> : null}
      <Tags {...props} />
    </Container>
  );
};

const ExtraUtfallButton = ({ utfallIdSet, mainUtfall, oppgaveId }: Props) => {
  const [updateUtfall] = useUpdateExtraUtfallMutation();
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
        disabled: id === mainUtfall,
      })),
    [utfallKodeverk, mainUtfall],
  );

  const selected = useMemo(() => {
    if (mainUtfall === null) {
      return utfallIdSet;
    }

    return utfallIdSet.includes(mainUtfall) ? utfallIdSet : [...utfallIdSet, mainUtfall];
  }, [utfallIdSet, mainUtfall]);

  const disabled = mainUtfall === null;

  return (
    <ButtonContainer ref={ref}>
      <HelpTextWrapper>
        <Button variant="secondary" onClick={() => setIsOpen((o) => !o)} size="small" disabled={disabled}>
          Sett ekstra utfall for tilpasset tekst
        </Button>
        <HelpText>
          <HelpTextContent>
            {disabled ? <strong>Du må velge utfall/resultat først.</strong> : null}
            <span>Her kan du velge flere utfall for å få opp maltekst som passer til flere utfall.</span>
          </HelpTextContent>
        </HelpText>
      </HelpTextWrapper>
      <Popup isOpen={isOpen && !disabled}>
        <Dropdown
          selected={selected}
          onChange={(newList) => updateUtfall({ oppgaveId, extraUtfallIdSet: newList.filter(isUtfall) })}
          options={options}
          close={() => setIsOpen(false)}
        />
      </Popup>
    </ButtonContainer>
  );
};

const ReadOnlyLabel = () => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return null;
  }

  return (
    <HelpTextWrapper>
      <Label htmlFor={TAGSCONTAINER_ID} size="small">
        Ekstra utfall for tilpasset tekst
      </Label>
      <HelpText>
        <HelpTextContent>Valg av flere utfall for å få opp maltekst som passer til flere utfall.</HelpTextContent>
      </HelpText>
    </HelpTextWrapper>
  );
};

const TAGSCONTAINER_ID = 'tags-container';

const Tags = ({ utfallIdSet, mainUtfall }: TagsProps) => {
  const { data: oppgave } = useOppgave();
  const [utfallKodeverk] = useUtfall(oppgave?.typeId);
  const canEdit = useCanEdit();

  return (
    <>
      <ReadOnlyLabel />
      <TagsContainer id={TAGSCONTAINER_ID}>
        {mainUtfall === null || !canEdit ? null : (
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
    </>
  );
};

const ButtonContainer = styled.div`
  position: relative;
`;

const Container = styled.div`
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
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 8px;
`;
