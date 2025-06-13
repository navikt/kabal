import { ArchiveButtons } from '@app/components/documents/new-documents/modal/finish-document/archive-buttons';
import { SendButtons } from '@app/components/documents/new-documents/modal/finish-document/send-buttons';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { type DocumentAccess, FinishStateEnum } from '@app/hooks/dua-access/use-document-access';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { DistribusjonsType, DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Alert } from '@navikt/ds-react';

interface Props {
  document: IMainDocument;
  innsendingshjemlerConfirmed: boolean;
  access: DocumentAccess;
}

export const FinishButton = ({ document, innsendingshjemlerConfirmed, access }: Props) => {
  const isTildeltSaksbehandler = useIsTildeltSaksbehandler();

  if (isTildeltSaksbehandler && access.finish === FinishStateEnum.WAIT_FOR_ROL) {
    return (
      <Alert variant="info" size="small" inline>
        Kan ikke arkiveres før rådgivende overlege har svart og returnert saken.
      </Alert>
    );
  }

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
