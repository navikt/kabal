import { ReturWarning } from '@app/components/behandling/behandlingsdetaljer/warnings';
import { Dropdown } from '@app/components/filter-dropdown/dropdown';
import { isUtfall } from '@app/functions/is-utfall';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useUtfall } from '@app/hooks/use-utfall';
import { useUpdateExtraUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { type SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { Button, HStack, HelpText, Label, Tag, VStack } from '@navikt/ds-react';
import { type ReactNode, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

interface TagsProps {
  utfallIdSet: UtfallEnum[];
  mainUtfall: UtfallEnum | null;
  typeId: SaksTypeEnum;
}

interface Props extends TagsProps {
  oppgaveId: string;
}

export const ExtraUtfall = (props: Props) => {
  const canEdit = useCanEditBehandling();
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  const includesRetur = oppgave.resultat.extraUtfallIdSet.some((u) => u === UtfallEnum.RETUR);

  return (
    <VStack gap="2" marginBlock="0 4">
      {canEdit ? <ExtraUtfallButton {...props} /> : null}
      <Tags {...props} />
      {canEdit && includesRetur ? <ReturWarning /> : null}
    </VStack>
  );
};

const ExtraUtfallButton = ({ utfallIdSet, mainUtfall, oppgaveId, typeId }: Props) => {
  const [updateUtfall] = useUpdateExtraUtfallMutation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [utfallKodeverk] = useUtfall(typeId);

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
      <HStack wrap gap="1" marginBlock="1 0">
        <Button variant="secondary" onClick={() => setIsOpen((o) => !o)} size="small" disabled={disabled}>
          Sett ekstra utfall for tilpasset tekst
        </Button>
        <HelpText>
          <VStack width="300px">
            {disabled ? <strong>Du må velge utfall/resultat først.</strong> : null}
            <span>Her kan du velge flere utfall for å få opp maltekst som passer til flere utfall.</span>
          </VStack>
        </HelpText>
      </HStack>
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
  const canEdit = useCanEditBehandling();

  if (canEdit) {
    return null;
  }

  return (
    <HStack align="center" gap="2">
      <Label htmlFor={TAGSCONTAINER_ID} size="small">
        Ekstra utfall for tilpasset tekst
      </Label>
      <HelpText>
        <VStack width="300px">Valg av flere utfall for å få opp maltekst som passer til flere utfall.</VStack>
      </HelpText>
    </HStack>
  );
};

const TAGSCONTAINER_ID = 'tags-container';

const Tags = ({ utfallIdSet, mainUtfall, typeId }: TagsProps) => {
  const [utfallKodeverk] = useUtfall(typeId);
  const canEdit = useCanEditBehandling();

  return (
    <>
      <ReadOnlyLabel />
      <HStack wrap gap="1" marginBlock="1 0" id={TAGSCONTAINER_ID}>
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
      </HStack>
    </>
  );
};

const ButtonContainer = styled.div`
  position: relative;
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
