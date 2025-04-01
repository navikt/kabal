import { SettPaaVentPanel } from '@app/components/oppgavebehandling-footer/sett-paa-vent/panel';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useNoOneCanEdit } from '@app/hooks/use-can-edit';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useDeleteSattPaaVentMutation, useSattPaaVentMutation } from '@app/redux-api/oppgaver/mutations/vent';
import { Role } from '@app/types/bruker';
import { HourglassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

const useCanEditSetPaaVent = () => {
  const { data, isSuccess } = useOppgave();
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const noOneCanEdit = useNoOneCanEdit();
  const userIsTildeltSaksbehandler = useIsSaksbehandler();
  const isTildeltSomeone = isSuccess && data.saksbehandler !== null;

  if (noOneCanEdit) {
    return false;
  }

  if (userIsTildeltSaksbehandler) {
    return true;
  }

  if (isMerkantil && isTildeltSomeone) {
    return true;
  }

  return false;
};

export const VentButton = () => {
  const { data, isSuccess } = useOppgave();
  const canEditSetPaaVent = useCanEditSetPaaVent();

  if (!canEditSetPaaVent || !isSuccess) {
    return null;
  }

  return data.sattPaaVent === null ? <SettPaaVent id={data.id} /> : <AvsluttVenteperiode id={data.id} />;
};

const SettPaaVent = ({ id }: { id: string }) => {
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [, { isLoading: deleteIsLoading }] = useDeleteSattPaaVentMutation({ fixedCacheKey: id });
  const [, { isLoading: settPaaVentIsLoading }] = useSattPaaVentMutation({ fixedCacheKey: id });
  useOnClickOutside(ref, () => setShowPopup(false));

  const isLoading = deleteIsLoading || settPaaVentIsLoading;

  return (
    <div ref={ref} className="relative">
      {showPopup ? <SettPaaVentPanel oppgaveId={id} close={() => setShowPopup(false)} /> : null}
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => setShowPopup(!showPopup)}
        loading={isLoading}
        icon={<HourglassIcon aria-hidden />}
      >
        Sett på vent
      </Button>
    </div>
  );
};

const AvsluttVenteperiode = ({ id }: { id: string }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [avslutt, { isLoading: deleteIsLoading }] = useDeleteSattPaaVentMutation({ fixedCacheKey: id });
  const [, { isLoading: settPaaVentIsLoading }] = useSattPaaVentMutation({ fixedCacheKey: id });
  useOnClickOutside(ref, () => setShowConfirm(false));

  const isLoading = deleteIsLoading || settPaaVentIsLoading;

  const onAvslutt = async () => {
    await avslutt(id).unwrap();

    setShowConfirm(false);
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="secondary"
        size="small"
        onClick={() => setShowConfirm(!showConfirm)}
        icon={<XMarkIcon aria-hidden />}
        disabled={isLoading}
      >
        Avslutt venteperiode
      </Button>

      {showConfirm ? (
        <Box
          padding="3"
          borderRadius="medium"
          shadow="medium"
          background="bg-default"
          className="absolute bottom-full flex flex-col gap-2"
        >
          <Alert inline variant="info" className="text-nowrap">
            Avslutt venteperiode?
          </Alert>

          <HStack gap="2">
            <Button variant="primary" size="small" onClick={onAvslutt} loading={isLoading}>
              Bekreft
            </Button>
            <Button variant="danger" size="small" onClick={() => setShowConfirm(false)} disabled={isLoading}>
              Avbryt
            </Button>
          </HStack>
        </Box>
      ) : null}
    </div>
  );
};
