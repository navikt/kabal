import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button, Detail, Skeleton, Switch, Table, Tooltip } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ScoredNamedSvarbrevSetting } from '@app/components/svarbrev/filter-sort';
import { SvarbrevSettingHistory } from '@app/components/svarbrev/history';
import { PdfModal } from '@app/components/svarbrev/modal/modal';
import { useSvarbrevNavigate } from '@app/components/svarbrev/navigate';
import { Preview, Submit } from '@app/components/svarbrev/preview';
import { Behandlingstid, Buttons, NoWrap, StyledTableRow } from '@app/components/svarbrev/row/styled-components';
import { TextInput } from '@app/components/svarbrev/row/text-input';
import { TimeInput } from '@app/components/svarbrev/time-input';
import { Type } from '@app/components/type/type';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useYtelseName } from '@app/hooks/use-kodeverk-value';
import { usePrevious } from '@app/hooks/use-previous';

export enum ModalEnum {
  PREVIEW = 'preview',
  HISTORY = 'history',
}

interface Props extends ScoredNamedSvarbrevSetting {
  modal?: ModalEnum;
}

export const Row = ({ modal, ...setting }: Props) => {
  const [ytelseName, isLoading] = useYtelseName(setting.ytelseId);
  const [localBehandlingstidUnits, setLocalBehandlingstidUnits] = useState(setting.behandlingstidUnits);
  const [localBehandlingstidUnitTypeId, setLocalBehandlingstidUnitTypeId] = useState(setting.behandlingstidUnitTypeId);
  const [localCustomText, setLocalCustomText] = useState(setting.customText ?? '');
  const [localShouldSend, setLocalShouldSend] = useState(setting.shouldSend);
  const { id } = useParams();
  const isActive = id === setting.id;
  const showPreview = isActive && modal === ModalEnum.PREVIEW;
  const showHistory = isActive && modal === ModalEnum.HISTORY;

  const navigate = useSvarbrevNavigate();

  const cancel = useCallback(() => {
    setLocalBehandlingstidUnits(setting.behandlingstidUnits);
    setLocalBehandlingstidUnitTypeId(setting.behandlingstidUnitTypeId);
    setLocalCustomText(setting.customText ?? '');
    setLocalShouldSend(setting.shouldSend);
  }, [setting.behandlingstidUnits, setting.behandlingstidUnitTypeId, setting.customText, setting.shouldSend]);

  const hasChanges =
    localBehandlingstidUnits !== setting.behandlingstidUnits ||
    localBehandlingstidUnitTypeId !== setting.behandlingstidUnitTypeId ||
    localCustomText !== (setting.customText ?? '') ||
    localShouldSend !== setting.shouldSend;

  const rowRef = useRef<HTMLTableRowElement>(null);

  const [isFocused, setIsFocused] = useState(rowRef.current?.contains(document.activeElement) ?? false);

  const previousId = usePrevious(id);
  const wasActive = previousId === setting.id;
  const isHighlighted = isActive || (wasActive && id === undefined);

  useEffect(() => {
    if (wasActive && !isActive && rowRef.current !== null) {
      rowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      rowRef.current.animate(
        [{ backgroundColor: 'var(--a-blue-400)' }, { backgroundColor: 'var(--a-surface-action-subtle)' }],
        {
          duration: 5_000,
          easing: 'ease-out',
        },
      );
    }
  }, [isActive, wasActive]);

  return (
    <StyledTableRow
      selected={isHighlighted || isFocused}
      $hasChanges={hasChanges}
      $isActive={setting.shouldSend || isFocused}
      ref={rowRef}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Table.DataCell>
        <Switch
          checked={localShouldSend}
          onChange={({ target }) => setLocalShouldSend(target.checked)}
          hideLabel
          size="small"
        >
          Aktiv
        </Switch>
      </Table.DataCell>

      <Table.DataCell>
        <Type type={setting.typeId} />
      </Table.DataCell>

      <Table.DataCell>
        <NoWrap>{isLoading ? <Skeleton /> : ytelseName}</NoWrap>
      </Table.DataCell>

      <Table.DataCell>
        <Behandlingstid>
          <TimeInput
            value={localBehandlingstidUnits}
            onChange={setLocalBehandlingstidUnits}
            unit={localBehandlingstidUnitTypeId}
            setUnit={setLocalBehandlingstidUnitTypeId}
          />
        </Behandlingstid>
      </Table.DataCell>

      <Table.DataCell>
        <TextInput
          value={localCustomText}
          onChange={setLocalCustomText}
          hasChanges={hasChanges}
          settingId={setting.id}
        />
      </Table.DataCell>

      <Table.DataCell>
        <Tooltip content={`Endret av: ${setting.modifiedBy.navn}`}>
          <Detail>{isoDateTimeToPretty(setting.modified)}</Detail>
        </Tooltip>
      </Table.DataCell>

      <Table.DataCell>
        <Buttons>
          <SvarbrevSettingHistory id={setting.id} isOpen={showHistory} close={() => navigate('/svarbrev')} />

          {hasChanges ? (
            <>
              <Submit id={setting.id} />
              <Tooltip content="Angre endringer" placement="top">
                <Button
                  onClick={() => cancel()}
                  size="small"
                  variant="secondary"
                  icon={<ArrowUndoIcon aria-hidden />}
                />
              </Tooltip>
            </>
          ) : (
            <Preview id={setting.id} />
          )}
          <PdfModal
            {...setting}
            isOpen={showPreview}
            close={() => navigate('/svarbrev')}
            cancel={cancel}
            hasChanges={hasChanges}
            behandlingstidUnitTypeId={localBehandlingstidUnitTypeId}
            behandlingstidUnits={localBehandlingstidUnits}
            customText={localCustomText}
            shouldSend={localShouldSend}
            setShouldSend={setLocalShouldSend}
            setBehandlingstidUnitTypeId={setLocalBehandlingstidUnitTypeId}
            setBehandlingstidUnits={setLocalBehandlingstidUnits}
            setCustomText={setLocalCustomText}
          />
        </Buttons>
      </Table.DataCell>
    </StyledTableRow>
  );
};
