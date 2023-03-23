import { BodyShort, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { usePrevious } from '@app/hooks/use-previous';
import { useRegistreringshjemlerMap } from '@app/simple-api-state/use-kodeverk';
import { IKvalitetsvurdering } from '@app/types/kaka-kvalitetsvurdering/v2';
import { SubSection } from './styled-components';
import { useKvalitetsvurderingV2 } from './use-kvalitetsvurdering-v2';
import { useValidationError } from './use-validation-error';

interface Props {
  field: keyof Pick<
    IKvalitetsvurdering,
    | 'vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdertHjemlerList'
    | 'vedtaketLovbestemmelsenTolketFeilHjemlerList'
    | 'vedtaketFeilKonkretRettsanvendelseHjemlerList'
    | 'vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevetHjemlerList'
  >;
  show: boolean;
}

const EMPTY_ARRAY: string[] = [];

export const Hjemler = ({ field, show }: Props) => {
  const { hjemler, kvalitetsvurdering, update, isLoading } = useKvalitetsvurderingV2();
  const { data: registreringshjemlerMap, isLoading: registreringshjemlerMapIsLoading } = useRegistreringshjemlerMap();
  const canEdit = useCanEdit();
  const validationError = useValidationError(field);

  const previousSaksdataHjemmelIdList = usePrevious(isLoading ? undefined : hjemler);
  const selectedHjemmelIdList = isLoading ? undefined : kvalitetsvurdering[field];

  useEffect(() => {
    if (!show || isLoading || selectedHjemmelIdList === undefined || previousSaksdataHjemmelIdList === undefined) {
      return;
    }

    if (hjemler.length === 0 || hjemler.length === 1) {
      if (hjemmelIdListsEquals(selectedHjemmelIdList, hjemler)) {
        return;
      }

      update({ [field]: hjemler });

      return;
    }

    if (selectedHjemmelIdList.length !== 0) {
      const isUnchanged = hjemmelIdListsEquals(previousSaksdataHjemmelIdList, hjemler);

      if (!isUnchanged) {
        update({ [field]: EMPTY_ARRAY });
      }
    }
  }, [field, isLoading, selectedHjemmelIdList, previousSaksdataHjemmelIdList, hjemler, show, update]);

  if (!show || isLoading || registreringshjemlerMapIsLoading || typeof registreringshjemlerMap === 'undefined') {
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
    <SubSection>
      <CheckboxGroup
        legend="Hjemler"
        onChange={onChange}
        value={value}
        disabled={!canEdit}
        error={validationError}
        id={field}
        data-testid={field}
        size="small"
      >
        <HjemmelCheckboxes hjemmelIdList={hjemler} />
      </CheckboxGroup>
    </SubSection>
  );
};

interface HjemmelCheckboxesProps {
  hjemmelIdList: string[];
}

const HjemmelCheckboxes = ({ hjemmelIdList }: HjemmelCheckboxesProps) => {
  const { data: registreringshjemlerMap, isLoading } = useRegistreringshjemlerMap();

  if (hjemmelIdList.length === 0 || isLoading || typeof registreringshjemlerMap === 'undefined') {
    return <ItalicBodyShort size="small">Ingen hjemler valgt under behandling.</ItalicBodyShort>;
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
