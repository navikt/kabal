import { useKvalitetsvurderingV3 } from '@app/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { usePrevious } from '@app/hooks/use-previous';
import { useRegistreringshjemlerMap } from '@app/simple-api-state/use-kodeverk';
import type {
  KvalitetsvurderingSaksdataHjemlerV3,
  KvalitetsvurderingV3Boolean,
} from '@app/types/kaka-kvalitetsvurdering/v3';
import { BodyShort, BoxNew, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { useEffect } from 'react';
import { styled } from 'styled-components';
import { useValidationError } from './use-validation-error';

const EMPTY_ARRAY: string[] = [];

interface SaksdatahjemlerProps {
  field: keyof KvalitetsvurderingSaksdataHjemlerV3;
  parentKey?: keyof KvalitetsvurderingV3Boolean;
}

export const Oppgavehjemler = ({ field, parentKey }: SaksdatahjemlerProps) => {
  const { hjemler, kvalitetsvurdering, update, isLoading } = useKvalitetsvurderingV3();
  const { data: registreringshjemlerMap, isLoading: registreringshjemlerMapIsLoading } = useRegistreringshjemlerMap();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(field);

  const previousSaksdataHjemmelIdList = usePrevious(isLoading ? undefined : hjemler);
  const selectedHjemmelIdList = isLoading ? undefined : kvalitetsvurdering[field];

  useEffect(() => {
    if (!canEdit || isLoading || selectedHjemmelIdList === undefined || previousSaksdataHjemmelIdList === undefined) {
      return;
    }

    if (hjemler.length === 0 || hjemler.length === 1) {
      if (hjemmelIdListsEquals(selectedHjemmelIdList, hjemler)) {
        return;
      }

      update({ [field]: hjemler });

      return;
    }

    if (selectedHjemmelIdList.length > 0) {
      const isUnchanged = hjemmelIdListsEquals(previousSaksdataHjemmelIdList, hjemler);

      if (!isUnchanged) {
        update({ [field]: EMPTY_ARRAY });
      }
    }
  }, [field, isLoading, selectedHjemmelIdList, previousSaksdataHjemmelIdList, hjemler, update, canEdit]);

  if (isLoading || registreringshjemlerMapIsLoading || typeof registreringshjemlerMap === 'undefined') {
    return null;
  }

  const show = parentKey === undefined || kvalitetsvurdering[parentKey];

  if (!show) {
    return null;
  }

  const onChange = (newHjemler: string[]) => {
    if (hjemler.length === 1) {
      return;
    }
    update({ [field]: newHjemler });
  };

  const value = kvalitetsvurdering[field];

  return (
    <BoxNew marginBlock="0 4" marginInline="8 0">
      <CheckboxGroup
        size="small"
        legend="Hjemler"
        onChange={onChange}
        value={value}
        disabled={!canEdit}
        error={validationError}
        id={field}
        data-testid={field}
      >
        <HjemmelCheckboxes hjemmelIdList={hjemler} />
      </CheckboxGroup>
    </BoxNew>
  );
};

interface HjemmelCheckboxesProps {
  hjemmelIdList: string[];
}

const HjemmelCheckboxes = ({ hjemmelIdList }: HjemmelCheckboxesProps) => {
  const { data: registreringshjemlerMap, isLoading } = useRegistreringshjemlerMap();

  if (hjemmelIdList.length === 0 || isLoading || typeof registreringshjemlerMap === 'undefined') {
    return <ItalicBodyShort>Ingen hjemler valgt under saksdata.</ItalicBodyShort>;
  }

  return (
    <>
      {hjemmelIdList.map((hjemmelId) => (
        <Checkbox key={hjemmelId} value={hjemmelId}>
          {registreringshjemlerMap[hjemmelId]?.hjemmelnavn ?? hjemmelId}
        </Checkbox>
      ))}
    </>
  );
};

const hjemmelIdListsEquals = (a: string[] = [], b: string[] = []) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((id) => b.includes(id));
};

const ItalicBodyShort = styled(BodyShort)`
  font-style: italic;
`;
