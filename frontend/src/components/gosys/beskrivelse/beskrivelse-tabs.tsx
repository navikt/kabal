import { EntryList } from '@app/components/gosys/beskrivelse/entry-list';
import { GosysBeskrivelseFormat } from '@app/components/gosys/beskrivelse/format-enum';
import type { GosysBeskrivelseEntry } from '@app/components/gosys/beskrivelse/parsing/type';
import { useGosysBeskrivelseTab } from '@app/hooks/settings/use-setting';
import { usePushEvent } from '@app/observability';
import { BulletListIcon, CaptionsIcon } from '@navikt/aksel-icons';
import { BodyLong, Tabs } from '@navikt/ds-react';
import { useCallback } from 'react';
import { splitBeskrivelse } from './parsing/split-beskrivelse';

interface Props {
  beskrivelse?: string | null;
  entries?: GosysBeskrivelseEntry[];
}

export const GosysBeskrivelseTabs = ({ beskrivelse = '', entries = splitBeskrivelse(beskrivelse ?? '') }: Props) => {
  const [format, setFormat] = usePreferredFormat();
  const pushEvent = usePushEvent();

  const onChange = useCallback(
    (format: string) => {
      setFormat(ensureGosysFormat(format));
      pushEvent('change-gosys-description-format', { format });
    },
    [setFormat, pushEvent],
  );

  return (
    <Tabs size="small" value={format} onChange={onChange} className="flex h-full flex-col">
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
      <Tabs.Panel value={GosysBeskrivelseFormat.KABAL} className="overflow-auto">
        <EntryList entries={entries} />
      </Tabs.Panel>
      <Tabs.Panel value={GosysBeskrivelseFormat.GOSYS} className="overflow-auto">
        <BodyLong
          size="small"
          className="mt-2 overflow-auto whitespace-pre-wrap border-ax-border-neutral-subtle border-l-4 pl-4"
        >
          {beskrivelse?.trim()}
        </BodyLong>
      </Tabs.Panel>
    </Tabs>
  );
};

const usePreferredFormat = (): [GosysBeskrivelseFormat, (format: GosysBeskrivelseFormat) => void] => {
  const { value, setValue } = useGosysBeskrivelseTab();

  return [ensureGosysFormat(value), setValue];
};

const ensureGosysFormat = (value: string | undefined): GosysBeskrivelseFormat =>
  value !== GosysBeskrivelseFormat.GOSYS ? GosysBeskrivelseFormat.KABAL : GosysBeskrivelseFormat.GOSYS;
