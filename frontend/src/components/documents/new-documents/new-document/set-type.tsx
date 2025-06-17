import { ChangeTypeStateEnum, type DocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DISTRIBUSJONSTYPER, type DistribusjonsType, type IDocument } from '@app/types/documents/documents';
import { Alert, Select, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

interface Props {
  document: IDocument;
  showLabel?: boolean;
  access: DocumentAccess;
}

export const SetDocumentType = ({ document, showLabel = false, access }: Props) => {
  const { id, dokumentTypeId } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const { options, explanation } = useDistribusjonstypeOptions(document.type);

  const warning = useMemo<string | null>(() => {
    switch (access.changeType) {
      case ChangeTypeStateEnum.NOT_ASSIGNED:
        return 'Kun tildelt saksbehandler kan endre type på dokumentet.';
      case ChangeTypeStateEnum.FINISHED:
        return 'Det er ikke mulig å endre type på ferdigstilte dokumenter.';
      case ChangeTypeStateEnum.ROL_QUESTIONS:
        return 'Det er ikke mulig å endre type for ROL-spørsmål.';
      case ChangeTypeStateEnum.FEILREGISTRERT:
        return 'Det er ikke mulig å endre type for dokumenter på feilregistrerte saker.';
      case ChangeTypeStateEnum.SENT_TO_MU:
        return 'Det er ikke mulig å endre type for dokumenter på saker som er sendt til medunderskriver.';
      case ChangeTypeStateEnum.ROL_KROL:
        return 'ROL og KROL kan ikke endre type på dokumenter.';
      case ChangeTypeStateEnum.ALLOWED:
        return null;
    }
  }, [access.changeType]);

  if (warning !== null) {
    return showLabel ? (
      <Alert variant="info" size="small" inline>
        {warning}
      </Alert>
    ) : null;
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDocumentType(target.value) && oppgaveId !== skipToken) {
      setType({ oppgaveId, dokumentId: id, dokumentTypeId: target.value });
    }
  };

  return (
    <Tooltip content={explanation} maxChar={Number.POSITIVE_INFINITY}>
      <Select
        data-testid="document-type-select"
        label="Dokumenttype"
        hideLabel={!showLabel}
        size="small"
        onChange={onChange}
        value={dokumentTypeId}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </Tooltip>
  );
};

const isDocumentType = (type: string): type is DistribusjonsType => DISTRIBUSJONSTYPER.some((t) => t === type);
