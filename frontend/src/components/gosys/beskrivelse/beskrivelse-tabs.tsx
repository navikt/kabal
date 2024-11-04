import { EntryList } from '@app/components/gosys/beskrivelse/entry-list';
import { GosysBeskrivelseFormat } from '@app/components/gosys/beskrivelse/format-enum';
import type { GosysBeskrivelseEntry } from '@app/components/gosys/beskrivelse/parsing/type';
import { useGosysBeskrivelseTab } from '@app/hooks/settings/use-setting';
import { pushLog, usePushEvent } from '@app/observability';
import { BulletListIcon, CaptionsIcon } from '@navikt/aksel-icons';
import { BodyLong, Tabs } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo } from 'react';
import { styled } from 'styled-components';
import { simpleHeaderPrecheck } from './parsing/parse-header';
import { splitBeskrivelse } from './parsing/split-beskrivelse';

interface Props {
  id: number;
  beskrivelse?: string | null;
  entries?: GosysBeskrivelseEntry[];
}

export const GosysBeskrivelseTabs = ({
  id,
  beskrivelse = '',
  entries = useMemo(() => splitBeskrivelse(beskrivelse ?? ''), [beskrivelse]),
}: Props) => {
  const [format, setFormat] = usePreferredFormat();
  const pushEvent = usePushEvent();

  const onChange = useCallback(
    (format: string) => {
      setFormat(ensureGosysFormat(format));
      pushEvent('change-gosys-description-format', { format });
    },
    [setFormat, pushEvent],
  );

  const expectedEntries = getExpectedEntries(beskrivelse);
  const hasExpectedEntries = entries.length === expectedEntries;

  useEffect(() => {
    if (!hasExpectedEntries) {
      const context = {
        expectedEntries: expectedEntries.toString(10),
        actualEntries: entries.length.toString(10),
        gosysOppgaveId: id.toString(10),
      };
      pushLog('Unexpected number of entries in Gosys description', { context });
      pushEvent('unexpected-gosys-description', context);
    }
  }, [entries.length, expectedEntries, hasExpectedEntries, pushEvent, id]);

  return (
    <Tabs
      size="small"
      value={format}
      onChange={onChange}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Tabs.List>
        <Tabs.Tab
          value={GosysBeskrivelseFormat.KABAL}
          label={`Formatert (${entries.length})`}
          icon={<BulletListIcon aria-hidden role="presentation" />}
        />
        <Tabs.Tab
          value={GosysBeskrivelseFormat.GOSYS}
          label="Gosys"
          icon={<CaptionsIcon aria-hidden role="presentation" />}
        />
      </Tabs.List>
      <Tabs.Panel value={GosysBeskrivelseFormat.KABAL} style={{ overflow: 'auto' }}>
        <EntryList entries={entries} />
      </Tabs.Panel>
      <Tabs.Panel value={GosysBeskrivelseFormat.GOSYS} style={{ overflow: 'auto' }}>
        <GosysFormatted size="small">{beskrivelse?.trim()}</GosysFormatted>
      </Tabs.Panel>
    </Tabs>
  );
};

const getExpectedEntries = (beskrivelse: string | null | undefined): number =>
  beskrivelse?.split('\n').filter((l) => simpleHeaderPrecheck(l) && l.split('').some((c) => c !== '-')).length ?? 0;

const usePreferredFormat = (): [GosysBeskrivelseFormat, (format: GosysBeskrivelseFormat) => void] => {
  const { value, setValue } = useGosysBeskrivelseTab();

  return [ensureGosysFormat(value), setValue];
};

const ensureGosysFormat = (value: string | undefined): GosysBeskrivelseFormat =>
  value !== GosysBeskrivelseFormat.GOSYS ? GosysBeskrivelseFormat.KABAL : GosysBeskrivelseFormat.GOSYS;

const GosysFormatted = styled(BodyLong)`
  white-space: pre-wrap;
  border-left: var(--a-spacing-1) solid var(--a-border-subtle);
  padding-left: var(--a-spacing-4);
  margin-top: var(--a-spacing-2);
  overflow: auto;
`;
