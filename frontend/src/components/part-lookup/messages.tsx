import { Alert } from '@app/components/alert/alert';
import { Loader } from '@navikt/ds-react';

interface MessagesProps {
  warningReceiverMessage: string | null;
  invalidReceiverMessage: string | null;
  isSearching: boolean;
  isError: boolean;
}

export const Messages = ({ warningReceiverMessage, invalidReceiverMessage, isSearching, isError }: MessagesProps) => (
  <>
    {warningReceiverMessage !== null ? <Alert variant="info">{warningReceiverMessage}</Alert> : null}

    {invalidReceiverMessage !== null ? <Alert variant="warning">{invalidReceiverMessage}</Alert> : null}

    {isSearching ? (
      <div className="flex items-center justify-center py-4">
        <Loader size="small" title="Søker..." />
      </div>
    ) : null}

    {isError ? <Alert variant="warning">Ingen treff</Alert> : null}
  </>
);
