import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { Language, isLanguage } from '@app/types/texts/language';
import { ToggleGroup } from '@navikt/ds-react';

export const SetMaltekstseksjonLanguage = () => {
  const navigate = useNavigateMaltekstseksjoner();
  const language = useRedaktoerLanguage();

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
