import { ArchiveButtons } from '@app/components/documents/new-documents/modal/finish-document/archive-buttons';
import { SendButtons } from '@app/components/documents/new-documents/modal/finish-document/send-buttons';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { type DocumentAccess, FinishStateEnum } from '@app/hooks/dua-access/use-document-access';
import { DistribusjonsType, DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { Alert } from '@navikt/ds-react';
import { useMemo } from 'react';

interface Props {
  document: IDocument;
  innsendingshjemlerConfirmed: boolean;
  access: DocumentAccess;
}

export const FinishButton = ({ document, innsendingshjemlerConfirmed, access }: Props) => {
  const accessMessage = useMemo(() => {
    switch (access.finish) {
      case FinishStateEnum.FEILREGISTRERT:
        return 'Saken er feilregistrert';
      case FinishStateEnum.FINISHED:
        return 'Dokumentet er allerede arkivert eller sendt';
      case FinishStateEnum.NOT_ASSIGNED:
        return 'Kun tildelt saksbehandler kan arkivere eller sende dokumentet';
      case FinishStateEnum.ROL_KROL:
        return 'ROL og KROL kan ikke arkivere eller sende dokumenter';
      case FinishStateEnum.SENT_TO_MU:
        return 'Kan ikke arkiveres eller sendes mens saken er hos medunderskriver.';
      case FinishStateEnum.ROL_REQUIRED:
        return 'Kan ikke arkiveres før rådgivende overlege har svart og returnert saken.';
      case FinishStateEnum.ALLOWED:
        return null;
    }
  }, [access.finish]);

  if (accessMessage !== null) {
    return (
      <Alert variant="info" size="small" inline>
        {accessMessage}
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
