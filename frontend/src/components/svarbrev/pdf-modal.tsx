import { Button, FormSummary, Loader, Modal, Skeleton } from '@navikt/ds-react';
import { ReactNode, useEffect } from 'react';
import { styled } from 'styled-components';
import {
  CheckmarkCircleFillIconColored,
  XMarkOctagonFillIconColored,
} from '@app/components/colored-icons/colored-icons';
import { useYtelseName } from '@app/hooks/use-kodeverk-value';
import { useUpdateSvarbrevSettingMutation } from '@app/redux-api/svarbrev';

export interface PreviewProps {
  ytelseId: string;
  behandlingstidWeeks: number;
  customText: string | null;
  id: string;
  shouldSend: boolean;
}

interface ModalProps extends PreviewProps {
  submit?: boolean;
  heading: string;
  isOpen: boolean;
  close: () => void;
}

export const PdfModal = ({ isOpen, close, heading, submit = false, ...props }: ModalProps) => {
  const { ytelseId, behandlingstidWeeks, customText, shouldSend } = props;
  const [updateSetting, { isLoading, isSuccess }] = useUpdateSvarbrevSettingMutation();
  const [ytelseName, ytelseNameIsLoading] = useYtelseName(ytelseId);

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [close, isSuccess]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      header={{ heading }}
      size="small"
      closeOnBackdropClick
      width="0min(90vw, 1100px)"
      open={isOpen}
      onClose={close}
    >
      <ModalBody>
        <Summary>
          <Detail
            label="Aktiv"
            value={
              shouldSend ? (
                <>
                  Ja <CheckmarkCircleFillIconColored aria-hidden />
                </>
              ) : (
                <>
                  Nei <XMarkOctagonFillIconColored aria-hidden />
                </>
              )
            }
          />
          <Detail label="Ytelse" value={ytelseNameIsLoading ? <Skeleton /> : ytelseName} />
          <Detail label="Saksbehandlingstid" value={`${behandlingstidWeeks} uker`} />
          <Detail label="Valgfri tekst" value={customText ?? '-'} />
        </Summary>

        <PdfWithLoader>
          <CenterLoader>
            <Loader size="3xlarge" />
          </CenterLoader>

          <StyledPDF
            role="document"
            type="application/pdf"
            name="pdf-viewer"
            // TODO: Replace with actual URL
            data={`/api/kabal-api/journalposter/639656528/dokumenter/669213484/pdf${PDF_PARAMS}`}
          />
        </PdfWithLoader>
      </ModalBody>

      <Modal.Footer>
        {submit ? (
          <Button
            type="button"
            variant="primary"
            loading={isLoading}
            onClick={() => {
              updateSetting(props);
            }}
          >
            Lagre
          </Button>
        ) : null}

        <Button type="button" variant="secondary" onClick={close}>
          Lukk
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const CenterLoader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

const PdfWithLoader = styled.div`
  height: 100%;
  position: relative;
  height: min(90vh, 1500px);
  width: 100%;
`;

const PDF_PARAMS = '#toolbar=1&view=fitH&zoom=page-width';

const StyledPDF = styled.object`
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Summary = styled.div`
  display: flex;
  gap: 16px;
`;

const ModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(90vw, 1100px);
`;

const Detail = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <FormSummary.Label>{label}</FormSummary.Label>
    <StyledValue>{value}</StyledValue>
  </div>
);

const StyledValue = styled(FormSummary.Value)`
  display: flex;
  gap: 4px;
  align-items: center;
`;
