import { usePdfUrl } from '@app/components/svarbrev/modal/use-pdf-url';
import { Warning } from '@app/components/svarbrev/modal/warning';
import { TimeInput } from '@app/components/svarbrev/time-input';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useYtelseName } from '@app/hooks/use-kodeverk-value';
import { useUpdateSvarbrevSettingMutation } from '@app/redux-api/svarbrev';
import type { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { BehandlingstidUnitType, SvarbrevSetting } from '@app/types/svarbrev';
import { Button, HStack, Loader, Modal, Switch, Tag, TextField, Tooltip, VStack } from '@navikt/ds-react';

interface Props extends SvarbrevSetting {
  isOpen: boolean;
  close: () => void;
  cancel: () => void;
  setShouldSend: (shouldSend: boolean) => void;
  setCustomText: (customText: string) => void;
  setBehandlingstidUnits: (behandlingstidUnits: number) => void;
  setBehandlingstidUnitTypeId: (behandlingstidUnitTypeId: BehandlingstidUnitType) => void;
  hasChanges: boolean;
}

export const PdfModal = ({
  isOpen,
  close,
  cancel,
  id,
  ytelseId,
  typeId,
  shouldSend,
  behandlingstidUnitTypeId,
  behandlingstidUnits,
  customText,
  modified,
  modifiedBy,
  setShouldSend,
  setCustomText,
  setBehandlingstidUnits,
  setBehandlingstidUnitTypeId,
  hasChanges,
}: Props) => {
  const [updateSetting, { isLoading }] = useUpdateSvarbrevSettingMutation();
  const [ytelseName, ytelseNameIsLoading] = useYtelseName(ytelseId);
  const pdfUrl = usePdfUrl({
    isOpen,
    ytelseId,
    typeId,
    behandlingstidUnits,
    behandlingstidUnitTypeId,
    customText,
  });

  if (!isOpen) {
    return null;
  }

  const heading = getTitle(typeId);

  return (
    <Modal
      header={{ heading }}
      size="small"
      closeOnBackdropClick
      open={isOpen}
      onClose={close}
      width="1100px"
      className="max-w-[90vw]"
    >
      <VStack asChild gap="4" width="100%">
        <Modal.Body>
          <VStack gap="4">
            <HStack align="center" gap="0 1" className="text-base italic">
              <span>
                Sist endret <Time dateTime={modified} /> av <User {...modifiedBy} />.
              </span>
              {hasChanges ? (
                <Tag variant="warning" size="small">
                  Utkast
                </Tag>
              ) : (
                <Tag variant="info" size="small">
                  Lagret
                </Tag>
              )}
            </HStack>
            <HStack align="center" gap="0 4">
              <Switch size="small" checked={shouldSend} onChange={({ target }) => setShouldSend(target.checked)}>
                Aktiv
              </Switch>
              <Tooltip content="Ytelse">
                <span>{ytelseNameIsLoading ? 'Laster...' : (ytelseName ?? `Ukjent ytelse med ID «${ytelseId}»`)}</span>
              </Tooltip>
              <Tooltip content="Saksbehandlingstid">
                <HStack align="center" gap="0 2">
                  <TimeInput
                    value={behandlingstidUnits}
                    onChange={setBehandlingstidUnits}
                    unit={behandlingstidUnitTypeId}
                    setUnit={setBehandlingstidUnitTypeId}
                  />
                </HStack>
              </Tooltip>
              <Tooltip content="Tekst til svarbrev (valgfri)">
                <div className="grow">
                  <TextField
                    size="small"
                    label="Tekst (valgfri)"
                    placeholder="Tekst til svarbrev (valgfri)"
                    hideLabel
                    value={customText ?? ''}
                    onChange={({ target }) => setCustomText(target.value)}
                  />
                </div>
              </Tooltip>
            </HStack>
          </VStack>

          {hasChanges ? (
            <Warning behandlingstidUnits={behandlingstidUnits} behandlingstidUnitTypeId={behandlingstidUnitTypeId} />
          ) : null}

          <div className="relative h-[1500px] max-h-[90vh] w-full">
            <div className="-translate-1/2 absolute top-1/2 left-1/2 z-0">
              <Loader size="3xlarge" />
            </div>

            {pdfUrl === null ? null : (
              // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: PDF
              <object
                role="document"
                type="application/pdf"
                name="pdf-viewer"
                data={pdfUrl}
                className="absolute z-1 h-full w-full"
                aria-label={heading}
              />
            )}
          </div>
        </Modal.Body>
      </VStack>

      <Modal.Footer>
        {hasChanges || isLoading ? (
          <Button
            type="button"
            variant="primary"
            size="small"
            loading={isLoading}
            onClick={async () => {
              await updateSetting({
                id,
                shouldSend,
                behandlingstidUnits,
                behandlingstidUnitTypeId,
                customText,
              });
              close();
            }}
          >
            Lagre
          </Button>
        ) : null}

        {hasChanges ? (
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => {
              cancel();
              close();
            }}
          >
            Avbryt og forkast endringer
          </Button>
        ) : null}

        <Button type="button" variant="secondary" size="small" onClick={close}>
          Lukk
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const getTitle = (type: SaksTypeEnum.KLAGE | SaksTypeEnum.ANKE) => {
  switch (type) {
    case SaksTypeEnum.KLAGE:
      return 'Forhåndsvisning av svarbrev for klage';
    case SaksTypeEnum.ANKE:
      return 'Forhåndsvisning av svarbrev for anke';
  }
};

const User = ({ navn, navIdent }: INavEmployee) => `${navn} (${navIdent})`;

const Time = ({ dateTime }: { dateTime: string }) => (
  <time dateTime={dateTime} className="font-bold">
    {isoDateTimeToPretty(dateTime)}
  </time>
);
