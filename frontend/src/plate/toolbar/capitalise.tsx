import { useSmartEditorCapitalise } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { Heading, ToggleGroup } from '@navikt/ds-react';

export const Capitalise = () => {
  const { setValue, value } = useSmartEditorCapitalise();

  return (
    <section aria-labelledby="capitalise">
      <Heading level="2" size="small" spacing id="capitalise">
        Automatisk stor forbokstav
      </Heading>

      <ToggleGroup
        size="small"
        defaultValue="false"
        value={typeof value === 'boolean' ? String(value) : 'false'}
        onChange={(v) => {
          const enabled = v === 'true';
          pushEvent('capitalise', 'smart-editor', { enabled: v });
          setValue(enabled);
        }}
      >
        <ToggleGroup.Item value="true">På</ToggleGroup.Item>
        <ToggleGroup.Item value="false">Av</ToggleGroup.Item>
      </ToggleGroup>
    </section>
  );
};
