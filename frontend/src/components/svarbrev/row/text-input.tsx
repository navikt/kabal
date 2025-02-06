import { useSvarbrevNavigate } from '@app/components/svarbrev/navigate';
import { ClipboardIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack, TextField, Tooltip } from '@navikt/ds-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  hasChanges: boolean;
  settingId: string;
}

export const TextInput = ({ value, onChange, hasChanges, settingId }: Props) => {
  const navigate = useSvarbrevNavigate();

  return (
    <HStack align="center" gap="0 1">
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

            if (text.length > 0) {
              onChange(text);
            }
          }}
        />
      </Tooltip>
    </HStack>
  );
};
