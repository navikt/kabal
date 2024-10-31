import { BEHANDLING_PANEL_DOMAIN } from '@app/components/behandling/behandlingsdetaljer/gosys/domain';
import { EntryList } from '@app/components/behandling/behandlingsdetaljer/gosys/entry-list';
import { GosysBeskrivelseFormat } from '@app/components/behandling/behandlingsdetaljer/gosys/format-enum';
import type { GosysBeskrivelseEntry } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';
import { useGosysBeskrivelseTab } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { BulletListIcon, CaptionsIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, Tabs } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';

interface Props {
  defaultFormat: GosysBeskrivelseFormat;
  beskrivelse: string;
  entries: GosysBeskrivelseEntry[];
  hasExpectedEntries: boolean;
}

export const ModalContent = ({ defaultFormat, entries, beskrivelse, hasExpectedEntries }: Props) => {
  const { setValue } = useGosysBeskrivelseTab();

  const onChange = useCallback(
    (format: string) => {
      setValue(format);
      pushEvent('change-gosys-description-format', BEHANDLING_PANEL_DOMAIN, { format });
    },
    [setValue],
  );

  const FormattedIcon = hasExpectedEntries ? BulletListIcon : ExclamationmarkTriangleIcon;

  return (
    <Tabs
      defaultValue={defaultFormat}
      size="small"
      onChange={onChange}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Tabs.List>
        <Tabs.Tab
          value={GosysBeskrivelseFormat.KABAL}
          label={`Formatert (${entries.length})`}
          icon={<FormattedIcon aria-hidden role="presentation" />}
        />
        <Tabs.Tab
          value={GosysBeskrivelseFormat.GOSYS}
          label="Gosys"
          icon={<CaptionsIcon aria-hidden role="presentation" />}
        />
      </Tabs.List>
      <Tabs.Panel value={GosysBeskrivelseFormat.KABAL} style={{ overflow: 'auto' }}>
        {hasExpectedEntries ? null : <Warning />}
        <EntryList entries={entries} />
      </Tabs.Panel>
      <Tabs.Panel value={GosysBeskrivelseFormat.GOSYS} style={{ overflow: 'auto' }}>
        <GosysFormatted size="small">{beskrivelse}</GosysFormatted>
      </Tabs.Panel>
    </Tabs>
  );
};

const Warning = () => (
  <Alert variant="warning" size="small" style={{ marginTop: 'var(--a-spacing-2)' }}>
    Kabal klarte ikke formatere alle meldingene fra Gosys. Det er ikke sikkert alle meldingene vises her. Se Gosys-fanen
    for full oversikt.
  </Alert>
);

const GosysFormatted = styled(BodyLong)`
  white-space: pre-wrap;
  border-left: var(--a-spacing-1) solid var(--a-border-subtle);
  padding-left: var(--a-spacing-4);
  margin-top: var(--a-spacing-2);
  overflow: auto;
`;
