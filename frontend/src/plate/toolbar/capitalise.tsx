import { useSmartEditorCapitalise } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { BodyShort, Heading, HelpText, HStack, Tag, ToggleGroup } from '@navikt/ds-react';
import { useId } from 'react';

export const Capitalise = () => {
  const { setValue, value } = useSmartEditorCapitalise();
  const id = useId();

  return (
    <section aria-labelledby={id}>
      <HStack asChild align="center" gap="1" wrap={false}>
        <Heading level="2" size="small" spacing id={id}>
          <span>Automatisk stor forbokstav</span>

          <HelpText title="Hjelp">
            <BodyShort size="small" spacing>
              Gjør automatisk om første bokstav i setninger til stor bokstav.
            </BodyShort>

            <BodyShort size="small" spacing>
              <span className="block">Tar høyde for norske forkortelser.</span>
              <span className="italic">
                Om du savner en fortkortelse, ta kontakt med Team Klage i kanalen «Tilbakemelding til Kabal» på Teams.
              </span>
            </BodyShort>

            <BodyShort size="small">
              <span>Bruk </span>
              <Tag variant="neutral" size="xsmall">
                backspace
              </Tag>
              <span> for å gjøre om til liten bokstav igjen.</span>
            </BodyShort>
          </HelpText>
        </Heading>
      </HStack>

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
