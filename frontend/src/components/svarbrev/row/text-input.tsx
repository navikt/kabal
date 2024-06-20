import { ClipboardIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, TextField, Tooltip } from '@navikt/ds-react';
import { useSvarbrevNavigate } from '@app/components/svarbrev/navigate';
import { Horizontal } from '@app/components/svarbrev/row/styled-components';

interface Props {
  value: string;
  onChange: (value: string) => void;
  hasChanges: boolean;
  settingId: string;
}

export const TextInput = ({ value, onChange, hasChanges, settingId }: Props) => {
  const navigate = useSvarbrevNavigate();

  return (
    <Horizontal>
      <div style={{ flexGrow: 1 }}>
        <TextField
          size="small"
          value={value}
          onChange={({ target }) => onChange(target.value)}
          placeholder="Valgfri tekst"
          label="Tekst til svarbrev"
          hideLabel
          onKeyDown={(e) => {
            if (hasChanges && e.key === 'Enter') {
              e.preventDefault();
              navigate(settingId);
            }
          }}
          spellCheck
        />
      </div>

      <Tooltip content="Kopier">
        <CopyButton copyText={value} size="small" />
      </Tooltip>

      <Tooltip content="Lim inn">
        <Button
          size="small"
          variant="tertiary-neutral"
          icon={<ClipboardIcon aria-hidden />}
          onClick={async () => {
            const text = await navigator.clipboard.readText();

            if (text.length !== 0) {
              onChange(text);
            }
          }}
        />
      </Tooltip>
    </Horizontal>
  );
};
