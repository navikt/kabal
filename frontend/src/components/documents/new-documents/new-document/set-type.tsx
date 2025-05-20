import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDistribusjonstypeOptions } from '@app/hooks/use-distribusjonstype-options';
import { useSetTypeMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DISTRIBUSJONSTYPER, type DistribusjonsType, type IDocument } from '@app/types/documents/documents';
import { Select, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

interface Props {
  document: IDocument;
  showLabel?: boolean;
}

export const SetDocumentType = ({ document, showLabel = false }: Props) => {
  const { id, dokumentTypeId } = document;
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const { options, explanation } = useDistribusjonstypeOptions(document.type);

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
