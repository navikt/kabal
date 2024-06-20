import { BodyShort } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { BEHANDLINGSTID_UNIT_TYPE_NAMES, BehandlingstidUnitType, SvarbrevSetting } from '@app/types/svarbrev';

export interface InitialVersion extends Pick<SvarbrevSetting, 'id' | 'modified' | 'modifiedBy'> {
  behandlingstidUnits: SvarbrevSetting['behandlingstidUnits'];
  behandlingstidUnitType: SvarbrevSetting['behandlingstidUnitType'];
  customText: SvarbrevSetting['customText'];
  shouldSend: SvarbrevSetting['shouldSend'];
  isInitialVersion: true;
}

export interface ChangeSet extends Pick<SvarbrevSetting, 'id' | 'modified' | 'modifiedBy'> {
  behandlingstidUnits?: SvarbrevSetting['behandlingstidUnits'];
  behandlingstidUnitType?: SvarbrevSetting['behandlingstidUnitType'];
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
        behandlingstidUnitType: setting.behandlingstidUnitType,
        customText: setting.customText,
        shouldSend: setting.shouldSend,
        isInitialVersion: true,
      };
      result[i] = initialVersion;
      continue;
    }

    const previous = data[i + 1]!;

    const isTimeEqual =
      setting.behandlingstidUnitType === previous.behandlingstidUnitType &&
      setting.behandlingstidUnits === previous.behandlingstidUnits;

    result[i] = {
      id: setting.id,
      modified: setting.modified,
      modifiedBy: setting.modifiedBy,
      behandlingstidUnits: isTimeEqual ? undefined : setting.behandlingstidUnits,
      behandlingstidUnitType: isTimeEqual ? undefined : setting.behandlingstidUnitType,
      customText: setting.customText === previous.customText ? undefined : setting.customText,
      shouldSend: setting.shouldSend === previous.shouldSend ? undefined : setting.shouldSend,
      isInitialVersion: false,
    };
  }

  return result;
};

export const getChangeSetText = ({
  shouldSend,
  behandlingstidUnitType,
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
            Svartid: <strong>{formatSvartid(behandlingstidUnits, behandlingstidUnitType)}</strong>
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

  if (behandlingstidUnits !== undefined && behandlingstidUnitType !== undefined) {
    parts.push(
      <>
        Satte behandlingstiden til <strong>{formatSvartid(behandlingstidUnits, behandlingstidUnitType)}</strong>.
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
  padding-left: 16px;
`;

const formatSvartid = (behandlingstidUnits: number, behandlingstidUnitType: BehandlingstidUnitType) =>
  `${behandlingstidUnits} ${BEHANDLINGSTID_UNIT_TYPE_NAMES[behandlingstidUnitType]}`;
