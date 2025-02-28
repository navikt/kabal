import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { SimplePdfPreview } from '@app/components/simple-pdf-preview/simple-pdf-preview';
import { useNoFlickerReloadPdf } from '@app/components/view-pdf/no-flicker-reload';
import { isoDateToPretty } from '@app/domain/date';
import { useForlengetFristPdfWidth } from '@app/hooks/settings/use-setting';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Button, HStack, Modal, TextField, Textarea, VStack } from '@navikt/ds-react';
import { addYears, subDays } from 'date-fns';
import { useState } from 'react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
  modalRef: React.RefObject<HTMLDialogElement | null>;
  children?: React.ReactNode;
}

export const VarsletFristModal = ({ oppgavebehandling, modalRef, children }: Props) => {
  const { varsletFrist } = oppgavebehandling;
  const [newDate, setNewDate] = useState<string | null>(varsletFrist);
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { value: width, setValue: setWidth } = useForlengetFristPdfWidth();

  const pdfParams = {
    behandlingId: oppgavebehandling.id,
    title,
    customText: text,
    // fullmektigFritekst: null,
    // previousBehandlingstidInfo: null,
    // reason: null,
    // behandlingstidUnits: null,
    // behandlingstidUnitTypeId: null,
    behandlingstidDate: newDate ?? undefined,
  };

  const pdfUrl = '/arkivert-dokument/453930176/454332137';
  const noFlickerReload = useNoFlickerReloadPdf(pdfUrl, setPdfLoading);

  const validate = (): boolean => {
    const isValid = newDate !== null;
    setDateError(isValid ? undefined : 'Frist må være satt.');

    return isValid;
  };

  return (
    <Modal ref={modalRef} header={{ heading: 'Send brev om endret frist' }} width="2000px" closeOnBackdropClick>
      <Modal.Body className="flex h-[80vh] w-full gap-9">
        <VStack gap="4" width="fit-content" flexShrink="0" overflowY="auto">
          <HStack gap="4">
            {children}

            <BehandlingSection label="Varslet frist">
              <span>{varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}</span>
            </BehandlingSection>
          </HStack>

          <DatePicker
            label="Ny frist"
            onChange={(mottattVedtaksinstans) => {
              setNewDate(mottattVedtaksinstans);
            }}
            value={newDate}
            size="small"
            centuryThreshold={CURRENT_YEAR_IN_CENTURY}
            warningThreshhold={subDays(new Date(), 360)}
            fromDate={new Date()}
            toDate={addYears(new Date(), 1)}
            error={dateError}
          />

          <TextField label="Tittel" size="small" value={title} onChange={({ target }) => setTitle(target.value)} />

          <Textarea
            label="Ekstra tekst i brevet (valgfri)"
            size="small"
            value={text}
            onChange={({ target }) => setText(target.value)}
            cols={60}
            rows={20}
          />
        </VStack>

        <SimplePdfPreview noFlickerReload={noFlickerReload} isLoading={pdfLoading} width={width} setWidth={setWidth} />
      </Modal.Body>

      <Modal.Footer>
        <Button
          size="small"
          variant="primary"
          onClick={() => {
            if (validate()) {
              console.debug('Send brev', { newDate, text });
            } else {
              console.debug('Invalid brev', { newDate, text });
            }
          }}
        >
          Endre frist og send brev
        </Button>

        <Button size="small" variant="secondary" onClick={() => modalRef.current?.close()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

enum BehandlingstidUnitTypeId {
  WEEKS = '1',
  MONTHS = '2',
}

interface PreviewParams {
  behandlingId: string;
  title: string;
  fullmektigFritekst?: string;
  previousBehandlingstidInfo?: string;
  reason?: string;
  behandlingstidUnits?: number;
  behandlingstidUnitTypeId?: BehandlingstidUnitTypeId;
  behandlingstidDate?: string;
  customText?: string;
}
