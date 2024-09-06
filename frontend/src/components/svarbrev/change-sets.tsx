import { BodyShort } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { BEHANDLINGSTID_UNIT_TYPE_NAMES, BehandlingstidUnitType, SvarbrevSetting } from '@app/types/svarbrev';

export interface InitialVersion extends Pick<SvarbrevSetting, 'id' | 'modified' | 'modifiedBy'> {
  behandlingstidUnits: SvarbrevSetting['behandlingstidUnits'];
  behandlingstidUnitTypeId: SvarbrevSetting['behandlingstidUnitTypeId'];
  customText: SvarbrevSetting['customText'];
  shouldSend: SvarbrevSetting['shouldSend'];
  isInitialVersion: true;
}

export interface ChangeSet extends Pick<SvarbrevSetting, 'id' | 'modified' | 'modifiedBy'> {
  behandlingstidUnits?: SvarbrevSetting['behandlingstidUnits'];
  behandlingstidUnitTypeId?: SvarbrevSetting['behandlingstidUnitTypeId'];
  customText?: SvarbrevSetting['customText'];
  shouldSend?: SvarbrevSetting['shouldSend'];
  isInitialVersion: false;
}

export const getChangeSets = (data: SvarbrevSetting[]): (InitialVersion | ChangeSet)[] => {
  const result = new Array<InitialVersion | ChangeSet>(data.length);
  const firstIndex = data.length - 1;

  for (let i = firstIndex; i >= 0; i--) {
    const setting = data[i]!;

    if (i === firstIndex) {
      // First version. Everything is new.
      const initialVersion: InitialVersion = {
        id: setting.id,
        modified: setting.modified,
        modifiedBy: setting.modifiedBy,
        behandlingstidUnits: setting.behandlingstidUnits,
        behandlingstidUnitTypeId: setting.behandlingstidUnitTypeId,
        customText: setting.customText,
        shouldSend: setting.shouldSend,
        isInitialVersion: true,
      };
      result[i] = initialVersion;
      continue;
    }

    const previous = data[i + 1]!;

    const isTimeEqual =
      setting.behandlingstidUnitTypeId === previous.behandlingstidUnitTypeId &&
      setting.behandlingstidUnits === previous.behandlingstidUnits;

    result[i] = {
      id: setting.id,
      modified: setting.modified,
      modifiedBy: setting.modifiedBy,
      behandlingstidUnits: isTimeEqual ? undefined : setting.behandlingstidUnits,
      behandlingstidUnitTypeId: isTimeEqual ? undefined : setting.behandlingstidUnitTypeId,
      customText: setting.customText === previous.customText ? undefined : setting.customText,
      shouldSend: setting.shouldSend === previous.shouldSend ? undefined : setting.shouldSend,
      isInitialVersion: false,
    };
  }

  return result;
};

export const getChangeSetText = ({
  shouldSend,
  behandlingstidUnitTypeId,
  behandlingstidUnits,
  customText,
  isInitialVersion,
}: InitialVersion | ChangeSet) => {
  if (isInitialVersion) {
    return (
      <>
        <span>Svarbrev opprettet med standardinnstillinger;</span>
        <StyledVersionList>
          <li>
            <strong>{shouldSend ? 'Aktivert' : 'Deaktivert'}</strong>
          </li>
          <li>
            {customText === null || customText.length === 0 ? (
              'Uten tekst.'
            ) : (
              <>
                Tekst: «<strong>{customText}</strong>».
              </>
            )}
          </li>
          <li>
            Svartid: <strong>{formatSvartid(behandlingstidUnits, behandlingstidUnitTypeId)}</strong>
          </li>
        </StyledVersionList>
      </>
    );
  }

  const parts = [];

  if (shouldSend !== undefined) {
    parts.push(
      <>
        <strong>{shouldSend ? 'Aktiverte' : 'Deaktiverte'}</strong> svarbrevet.
      </>,
    );
  }

  if (behandlingstidUnits !== undefined && behandlingstidUnitTypeId !== undefined) {
    parts.push(
      <>
        Satte behandlingstiden til <strong>{formatSvartid(behandlingstidUnits, behandlingstidUnitTypeId)}</strong>.
      </>,
    );
  }

  if (customText !== undefined) {
    parts.push(
      customText === null || customText.length === 0 ? (
        'Fjernet teksten.'
      ) : (
        <>
          Endret teksten til «<strong>{customText}</strong>».
        </>
      ),
    );
  }

  if (parts.length === 0) {
    return <BodyShort>Ingen endring.</BodyShort>;
  }

  return (
    <StyledVersionList>
      {parts.map((part, index) => (
        <li key={index}>{part}</li>
      ))}
    </StyledVersionList>
  );
};

const StyledVersionList = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: var(--a-spacing-4);
`;

const formatSvartid = (behandlingstidUnits: number, behandlingstidUnitTypeId: BehandlingstidUnitType) =>
  `${behandlingstidUnits} ${BEHANDLINGSTID_UNIT_TYPE_NAMES[behandlingstidUnitTypeId]}`;
