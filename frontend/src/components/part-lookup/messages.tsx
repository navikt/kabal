import { Loader } from '@navikt/ds-react';
import { InfoBox } from '@/components/info-box/info-box';

interface MessagesProps {
  warningReceiverMessage: string | null;
  invalidReceiverMessage: string | null;
  isSearching: boolean;
  isError: boolean;
}

export const Messages = ({ warningReceiverMessage, invalidReceiverMessage, isSearching, isError }: MessagesProps) => (
  <>
    {warningReceiverMessage !== null ? <InfoBox variant="info">{warningReceiverMessage}</InfoBox> : null}

    {invalidReceiverMessage !== null ? <InfoBox variant="warning">{invalidReceiverMessage}</InfoBox> : null}

    {isSearching ? (
      <div className="flex items-center justify-center py-4">
        <Loader size="small" title="Søker..." />
      </div>
    ) : null}

    {isError ? <InfoBox variant="warning">Ingen treff</InfoBox> : null}
  </>
);
