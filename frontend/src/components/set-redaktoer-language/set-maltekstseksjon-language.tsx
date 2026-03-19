import { ToggleGroup } from '@navikt/ds-react';
import { useNavigateMaltekstseksjoner } from '@/hooks/use-navigate-maltekstseksjoner';
import { useRedaktoerLanguage } from '@/hooks/use-redaktoer-language';
import { isLanguage, Language } from '@/types/texts/language';

export const SetMaltekstseksjonLanguage = () => {
  const navigate = useNavigateMaltekstseksjoner();
  const language = useRedaktoerLanguage();

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
