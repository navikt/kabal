import { ToggleGroup } from '@navikt/ds-react';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { REGELVERK_TYPE, TextTypes } from '@app/types/common-text-types';
import { Language, isLanguage } from '@app/types/texts/language';

interface Props {
  textType: TextTypes;
}

export const SetStandaloneTextLanguage = ({ textType }: Props) => {
  const language = useRedaktoerLanguage();
  const navigate = useNavigateToStandaloneTextVersion(textType !== REGELVERK_TYPE);

  return (
    <ToggleGroup
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
