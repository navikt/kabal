import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import type { TextTypes } from '@app/types/common-text-types';
import { isLanguage, Language } from '@app/types/texts/language';
import { ToggleGroup } from '@navikt/ds-react';

interface Props {
  textType: TextTypes;
}

export const SetStandaloneTextLanguage = ({ textType }: Props) => {
  const language = useRedaktoerLanguage();
  const navigate = useNavigateToStandaloneTextVersion(textType);

  return (
    <ToggleGroup
      value={language}
      size="small"
      variant="neutral"
      onChange={(lang) => {
        if (isLanguage(lang)) {
          navigate({ lang });
        }
      }}
    >
      <ToggleGroup.Item value={Language.NB}>Bokmål</ToggleGroup.Item>
      <ToggleGroup.Item value={Language.NN}>Nynorsk</ToggleGroup.Item>
    </ToggleGroup>
  );
};
