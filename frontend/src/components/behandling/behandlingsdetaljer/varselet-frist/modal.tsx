import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { isoDateToPretty } from '@app/domain/date';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Button, HStack, Modal, TextField, Textarea, VStack } from '@navikt/ds-react';
import { addYears, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
  modalRef: React.RefObject<HTMLDialogElement | null>;
  children?: React.ReactNode;
}

export const VarseletFristModal = ({ oppgavebehandling, modalRef, children }: Props) => {
  const { varsletFrist } = oppgavebehandling;
  const [newDate, setNewDate] = useState<string | null>(varsletFrist);
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const [pdfParams, setPdfParams] = useState<PreviewParams | null>(null);

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        setPdfParams({
          behandlingId: oppgavebehandling.id,
          title,
          customText: text,
          // fullmektigFritekst: null,
          // previousBehandlingstidInfo: null,
          // reason: null,
          // behandlingstidUnits: null,
          // behandlingstidUnitTypeId: null,
          behandlingstidDate: newDate ?? undefined,
        }),
      500,
    );

    return () => clearTimeout(timeout);
  }, [oppgavebehandling.id, title, text, newDate]);

  const pdfUrl = usePdfUrl(pdfParams);

  const validate = (): boolean => {
    const isValid = newDate !== null;
    setDateError(isValid ? undefined : 'Frist må være satt.');

    return isValid;
  };

  return (
    <Modal ref={modalRef} header={{ heading: 'Send brev om endret frist' }} width="1200px" closeOnBackdropClick>
      <Modal.Body>
        <HStack>
          <VStack gap="4">
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

          {pdfUrl === null ? null : (
            <object
              data={`${pdfUrl}${PDF_PARAMS}`}
              type="application/pdf"
              name="pdf-viewer"
              aria-label="Forhåndsvisning av brev om forlenget frist."
            />
          )}
        </HStack>
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

const PDF_PARAMS = '#toolbar=1&view=fitH&zoom=page-width';

const usePdfUrl = (params: PreviewParams | null): string | null => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (params === null) {
      setUrl(null);
    } else {
      getUrl(params).then(setUrl);
    }
  }, [params]);

  return url;
};

const getUrl = async (params: PreviewParams): Promise<string | null> => {
  const res = await fetch('/api/kabal-api/preview/forlenget-behandlingstid', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.ok ? res.text() : null;
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
