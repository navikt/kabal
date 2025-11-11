import { StaticDataContext } from '@app/components/app/static-data-context';
import { useUnreadBehandlingCount } from '@app/components/header/notifications/api';
import { HjemmelList } from '@app/components/oppgavebehandling-footer/deassign/hjemmel-list';
import { useFradel } from '@app/components/oppgavestyring/use-tildel';
import { areArraysEqual } from '@app/functions/are-arrays-equal';
import { useHasRole } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { FradelReason, FradelReasonText } from '@app/types/oppgaver';
import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import {
  BodyLong,
  BoxNew,
  Button,
  HStack,
  InlineMessage,
  LocalAlert,
  Radio,
  RadioGroup,
  VStack,
} from '@navikt/ds-react';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { Direction } from './direction';

interface Props {
  oppgaveId: string;
  typeId: SaksTypeEnum;
  ytelseId: string;
  hjemmelIdList: string[];
  tildeltSaksbehandler: string | null;
  close: () => void;
  direction: Direction;
  redirect?: boolean;
}

export const Popup = ({
  oppgaveId,
  typeId,
  ytelseId,
  hjemmelIdList,
  tildeltSaksbehandler,
  close,
  direction,
  redirect = false,
}: Props) => {
  const navigate = useNavigate();
  const [reasonId, setReasonId] = useState<FradelReason | null>(null);
  const [selectedHjemmelIdList, setSelectedHjemmelIdList] = useState<string[]>(hjemmelIdList);
  const [fradel, { isLoading }] = useFradel(oppgaveId, typeId, ytelseId);
  const [hjemmelError, setHjemmelError] = useState<string | null>(null);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const { user } = useContext(StaticDataContext);
  const isTildeltSaksbehandler = tildeltSaksbehandler === user.navIdent;
  const { unreadMessageCount, isFetching: isUnreadCountFetching } = useUnreadBehandlingCount(oppgaveId);
  const hasUnread = unreadMessageCount !== null && unreadMessageCount !== 0;
  const disabledByNotifications = (isTildeltSaksbehandler && hasUnread) || (!hasOppgavestyringRole && hasUnread);

  const onClick = useCallback(async () => {
    if (reasonId === null || disabledByNotifications) {
      return;
    }

    if (reasonId === FradelReason.FEIL_HJEMMEL) {
      if (selectedHjemmelIdList.length === 0) {
        setHjemmelError('Du må velge minst én hjemmel.');

        return;
      }

      if (areArraysEqual(selectedHjemmelIdList, hjemmelIdList)) {
        setHjemmelError('Du må endre hjemler.');

        return;
      }

      const success = await fradel({ reasonId, hjemmelIdList: selectedHjemmelIdList });

      if (redirect && success) {
        navigate('/mineoppgaver');
      }

      return;
    }

    const success = await fradel({ reasonId });

    if (redirect && success) {
      navigate('/mineoppgaver');
    }
  }, [reasonId, fradel, redirect, selectedHjemmelIdList, hjemmelIdList, navigate, disabledByNotifications]);

  return (
    <VStack
      asChild
      position="absolute"
      right="0"
      gap="2"
      padding="4"
      width="280px"
      className={`z-10 ${direction === Direction.UP ? 'bottom-full' : 'top-full'}`}
      data-testid="deassign-oppgave-popup"
    >
      <BoxNew background="default" borderRadius="medium" shadow="dialog" borderWidth="1" borderColor="neutral">
        <RadioGroup value={reasonId} onChange={setReasonId} legend="Årsak for å legge tilbake" size="small">
          <Radio value={FradelReason.FEIL_HJEMMEL}>{FradelReasonText[FradelReason.FEIL_HJEMMEL]}</Radio>
          <Radio value={FradelReason.MANGLER_KOMPETANSE}>{FradelReasonText[FradelReason.MANGLER_KOMPETANSE]}</Radio>
          <Radio value={FradelReason.INHABIL}>{FradelReasonText[FradelReason.INHABIL]}</Radio>
          <Radio value={FradelReason.LENGRE_FRAVÆR}>{FradelReasonText[FradelReason.LENGRE_FRAVÆR]}</Radio>
          <Radio value={FradelReason.ANNET}>{FradelReasonText[FradelReason.ANNET]}</Radio>
          {hasOppgavestyringRole ? (
            <Radio value={FradelReason.LEDER}>{FradelReasonText[FradelReason.LEDER]}</Radio>
          ) : null}
        </RadioGroup>

        {reasonId === FradelReason.FEIL_HJEMMEL ? (
          <HjemmelList
            selected={selectedHjemmelIdList}
            onChange={setSelectedHjemmelIdList}
            ytelseId={ytelseId}
            direction={direction}
            error={hjemmelError}
          />
        ) : null}

        {hasUnread && !isUnreadCountFetching ? (
          <LocalAlert status={isTildeltSaksbehandler ? 'error' : 'warning'} size="small">
            <LocalAlert.Header>
              <LocalAlert.Title>Uleste varsler</LocalAlert.Title>
            </LocalAlert.Header>

            <LocalAlert.Content>
              <BodyLong size="small" spacing>
                Det er {unreadMessageCount} {unreadMessageCount === 1 ? 'ulest varsel' : 'uleste varsler'} knyttet til
                behandlingen.
              </BodyLong>

              <BodyLong size="small">
                {isTildeltSaksbehandler
                  ? 'Alle varsler må markeres som lest før du kan legge den tilbake.'
                  : 'Alle varsler vil bli slettet om du legger den tilbake.'}
              </BodyLong>
            </LocalAlert.Content>
          </LocalAlert>
        ) : null}

        {reasonId === null ? (
          <InlineMessage status="warning" size="small" className="ml-auto">
            Velg årsak
          </InlineMessage>
        ) : null}

        <HStack justify="space-between" gap="2">
          <Button
            variant="secondary-neutral"
            size="small"
            loading={isLoading}
            onClick={close}
            icon={<XMarkIcon aria-hidden />}
          >
            Avbryt
          </Button>

          <Button
            variant="primary"
            size="small"
            loading={isLoading}
            onClick={onClick}
            icon={<FolderFileIcon aria-hidden />}
            title={reasonId === null ? 'Velg årsak' : undefined}
          >
            Legg tilbake
          </Button>
        </HStack>
      </BoxNew>
    </VStack>
  );
};
