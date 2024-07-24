import { Button, Loader, Modal, Switch, Tag, TextField, Tooltip } from '@navikt/ds-react';
import {
  CenterLoader,
  Details,
  ModalBody,
  PdfWithLoader,
  Row,
  StyledPDF,
  StyledTime,
  TimeContainer,
  TimeInputContainer,
} from '@app/components/svarbrev/modal/styled-components';
import { usePdfUrl } from '@app/components/svarbrev/modal/use-pdf-url';
import { Warning } from '@app/components/svarbrev/modal/warning';
import { TimeInput } from '@app/components/svarbrev/time-input';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useYtelseName } from '@app/hooks/use-kodeverk-value';
import { useUpdateSvarbrevSettingMutation } from '@app/redux-api/svarbrev';
import { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { BehandlingstidUnitType, SvarbrevSetting } from '@app/types/svarbrev';

interface Props extends SvarbrevSetting {
  isOpen: boolean;
  close: () => void;
  cancel: () => void;
  setShouldSend: (shouldSend: boolean) => void;
  setCustomText: (customText: string) => void;
  setBehandlingstidUnits: (behandlingstidUnits: number) => void;
  setBehandlingstidUnitType: (behandlingstidUnitType: BehandlingstidUnitType) => void;
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
  behandlingstidUnitType,
  behandlingstidUnits,
  customText,
  modified,
  modifiedBy,
  setShouldSend,
  setCustomText,
  setBehandlingstidUnits,
  setBehandlingstidUnitType,
  hasChanges,
}: Props) => {
  const [updateSetting, { isLoading }] = useUpdateSvarbrevSettingMutation();
  const [ytelseName, ytelseNameIsLoading] = useYtelseName(ytelseId);
  const pdfUrl = usePdfUrl({ isOpen, ytelseId, typeId, behandlingstidUnits, behandlingstidUnitType, customText });

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      header={{ heading: getTitle(typeId) }}
      size="small"
      closeOnBackdropClick
      width="0min(90vw, 1100px)"
      open={isOpen}
      onClose={close}
    >
      <ModalBody>
        <Details>
          <TimeContainer>
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
          </TimeContainer>
          <Row>
            <Switch size="small" checked={shouldSend} onChange={({ target }) => setShouldSend(target.checked)}>
              Aktiv
            </Switch>
            <Tooltip content="Ytelse">
              <span>{ytelseNameIsLoading ? 'Laster...' : (ytelseName ?? `Ukjent ytelse med ID «${ytelseId}»`)}</span>
            </Tooltip>
            <Tooltip content="Saksbehandlingstid">
              <TimeInputContainer>
                <TimeInput
                  value={behandlingstidUnits}
                  onChange={setBehandlingstidUnits}
                  unit={behandlingstidUnitType}
                  setUnit={setBehandlingstidUnitType}
                />
              </TimeInputContainer>
            </Tooltip>
            <Tooltip content="Tekst til svarbrev (valgfri)">
              <div style={{ flexGrow: 1 }}>
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
          </Row>
        </Details>

        {hasChanges ? (
          <Warning behandlingstidUnits={behandlingstidUnits} behandlingstidUnitType={behandlingstidUnitType} />
        ) : null}

        <PdfWithLoader>
          <CenterLoader>
            <Loader size="3xlarge" />
          </CenterLoader>

          {pdfUrl === null ? null : (
            <StyledPDF role="document" type="application/pdf" name="pdf-viewer" data={pdfUrl} />
          )}
        </PdfWithLoader>
      </ModalBody>

      <Modal.Footer>
        {hasChanges || isLoading ? (
          <Button
            type="button"
            variant="primary"
            size="small"
            loading={isLoading}
            onClick={async () => {
              await updateSetting({ id, shouldSend, behandlingstidUnits, behandlingstidUnitType, customText });
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

const User = ({ navn, navIdent }: INavEmployee) => (
  <span>
    {navn} ({navIdent})
  </span>
);

const Time = ({ dateTime }: { dateTime: string }) => (
  <StyledTime dateTime={dateTime}>{isoDateTimeToPretty(dateTime)}</StyledTime>
);
