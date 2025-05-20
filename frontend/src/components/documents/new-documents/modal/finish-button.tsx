import { ArchiveButtons } from '@app/components/documents/new-documents/modal/finish-document/archive-buttons';
import { SendButtons } from '@app/components/documents/new-documents/modal/finish-document/send-buttons';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { DistribusjonsType, DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Alert } from '@navikt/ds-react';

interface Props {
  document: IDocument;
  innsendingshjemlerConfirmed: boolean;
}

export const FinishButton = ({ document, innsendingshjemlerConfirmed }: Props) => {
  if (
    document.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST &&
    document.type === DocumentTypeEnum.UPLOADED &&
    (document.avsender === null || document.inngaaendeKanal === null)
  ) {
    return (
      <Alert variant="info" size="small" inline>
        Kan ikke arkiveres før avsender og inngående kanal er satt.
      </Alert>
    );
  }

  if (document.templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN && !innsendingshjemlerConfirmed) {
    return (
      <Alert variant="info" size="small" inline>
        Kan ikke sendes ut før det er bekreftet at innsendingshjemlene stemmer.
      </Alert>
    );
  }

  return document.dokumentTypeId === DistribusjonsType.NOTAT || getIsIncomingDocument(document.dokumentTypeId) ? (
    <ArchiveButtons document={document} />
  ) : (
    <SendButtons document={document} />
  );
};
