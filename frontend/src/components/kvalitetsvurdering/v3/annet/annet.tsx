import { StaticDataContext } from '@app/components/app/static-data-context';
import { DESCRIPTION, HELP_TEXT, LABEL } from '@app/components/kvalitetsvurdering/v3/annet/data';
import { KvalitetsskjemaTextarea } from '@app/components/kvalitetsvurdering/v3/common/textarea';
import { TypeEnum } from '@app/components/kvalitetsvurdering/v3/common/types';
import { AnnetFields } from '@app/components/kvalitetsvurdering/v3/data';
import { useKlageenheter } from '@app/simple-api-state/use-kodeverk';
import { useContext } from 'react';

export const Annet = () => {
  const isInKlageenhet = useIsInKlageenhet();

  if (!isInKlageenhet) {
    return null;
  }

  return (
    <KvalitetsskjemaTextarea
      field={AnnetFields.annetFritekst}
      label={`${LABEL} (valgfritt)`}
      helpText={HELP_TEXT}
      description={DESCRIPTION}
      type={TypeEnum.TEXTAREA}
    />
  );
};

const useIsInKlageenhet = () => {
  const { user } = useContext(StaticDataContext);
  const { data: klageenheter, isLoading: klageenheterIsLoading } = useKlageenheter();

  if (klageenheterIsLoading || typeof klageenheter === 'undefined') {
    return false;
  }

  return klageenheter.some(({ id }) => id === user.ansattEnhet.id);
};
