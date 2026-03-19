import { ToggleGroup } from '@navikt/ds-react';
import { useNavigateToStandaloneTextVersion } from '@/hooks/use-navigate-to-standalone-text-version';
import { useRedaktoerLanguage } from '@/hooks/use-redaktoer-language';
import type { TextTypes } from '@/types/common-text-types';
import { isLanguage, Language } from '@/types/texts/language';

interface Props {
  textType: TextTypes;
}

export const SetStandaloneTextLanguage = ({ textType }: Props) => {
  const language = useRedaktoerLanguage();
  const navigate = useNavigateToStandaloneTextVersion(textType);

  return (
    <ToggleGroup
      data-color="neutral"
      value={language}
      size="small"
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
