import { FeilTag, PolTag } from '@app/components/documents/document-warnings';
import { HStack, Switch, Tag, Tooltip } from '@navikt/ds-react';

interface RedactedSwitchProps {
  hasAccessToArchivedDocuments: boolean;
  showRedacted: boolean;
  setShowRedacted: (showRedacted: boolean) => void;
}

interface VariantProps extends RedactedSwitchProps {
  showsPol: boolean;
  showsFeil: boolean;
  showsArchivedDocument: boolean;
  hasRedactedDocuments: boolean;
}

export const Variant = ({
  showsPol,
  showsFeil,
  showsArchivedDocument,
  hasRedactedDocuments,
  ...props
}: VariantProps) => {
  const showRedactedSwitch = showsArchivedDocument && hasRedactedDocuments;

  if (!showRedactedSwitch && !showsPol && !showsFeil) {
    return null;
  }

  return (
    <HStack gap="space-4" align="center" wrap={false}>
      {showsPol ? <PolTag /> : null}
      {showsFeil ? <FeilTag /> : null}

      {showRedactedSwitch ? <RedactedSwitch {...props} /> : null}
    </HStack>
  );
};

const RedactedSwitch = ({ hasAccessToArchivedDocuments, showRedacted, setShowRedacted }: RedactedSwitchProps) => {
  if (!hasAccessToArchivedDocuments) {
    return (
      <Tooltip content="Du har ikke tilgang til å se usladdet versjon" placement="top">
        <Tag data-color="meta-purple" variant="strong" size="xsmall">
          Sladdet
        </Tag>
      </Tooltip>
    );
  }

  return (
    <Switch size="small" checked={showRedacted} onChange={() => setShowRedacted(!showRedacted)} className="py-0">
      Sladdet
    </Switch>
  );
};
