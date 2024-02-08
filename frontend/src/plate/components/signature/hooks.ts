import { skipToken } from '@reduxjs/toolkit/query';
import { PlateEditor, setNodes } from '@udecode/plate-common';
import { useContext, useEffect } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { pushLog } from '@app/observability';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { MISSING_TITLE } from '@app/plate/components/signature/title';
import { EditorValue, ISignature, SignatureElement } from '@app/plate/types';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { useGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const useVersion = (): string => {
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);
  const params = documentId === null || oppgaveId === skipToken ? skipToken : { dokumentId: documentId, oppgaveId };
  const { data } = useGetDocumentQuery(params);

  if (typeof data === 'undefined') {
    return 'document is undefined';
  }

  if (!data.isSmartDokument) {
    return 'document is not a smart document';
  }

  return data.version.toString();
};

const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.employee?.navIdent === 'string'
      ? oppgave.medunderskriver.employee.navIdent
      : skipToken,
  );

  const version = useVersion();
  const { user } = useContext(StaticDataContext);

  if (typeof oppgave === 'undefined') {
    pushLog('useMedunderskriverSignature: oppgave is undefined. Returning undefined.', {
      context: { userId: user.navIdent, version },
    });

    return undefined;
  }

  if (oppgave.medunderskriver.employee === null) {
    pushLog('useMedunderskriverSignature: medunderskriver.employee is null. Returning null.', {
      context: { userId: user.navIdent, oppgaveId: oppgave.id, version },
    });

    return null;
  }

  if (medunderskriverSignature === undefined) {
    pushLog('useMedunderskriverSignature: medunderskriverSignature is undefined. Returning undefined.', {
      context: {
        userId: user.navIdent,
        oppgaveId: oppgave.id,
        medunderskriverId: oppgave.medunderskriver.employee.navIdent,
        version,
      },
    });
  }

  return medunderskriverSignature;
};

export const useSignatureIdent = (): string | typeof skipToken => {
  const { data: oppgave } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);

  if (oppgave === undefined) {
    return skipToken;
  }

  if (
    templateId === TemplateIdEnum.ROL_ANSWERS &&
    (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE)
  ) {
    return oppgave.rol?.employee?.navIdent ?? skipToken;
  }

  return oppgave.saksbehandler?.navIdent ?? skipToken;
};

export const useSignatureData = (editor: PlateEditor<EditorValue>, element: SignatureElement) => {
  const medunderskriverSignature = useMedunderskriverSignature();
  const signatureIdent = useSignatureIdent();
  const { data: ownSignature } = useGetSignatureQuery(signatureIdent);
  const { templateId } = useContext(SmartEditorContext);
  const version = useVersion();

  useEffect(() => {
    if (typeof ownSignature === 'undefined' || typeof medunderskriverSignature === 'undefined') {
      pushLog('useSignatureData: ownSignature or medunderskriverSignature is undefined. Early exit.', {
        context: { userId: signatureIdent === skipToken ? 'skipToken' : signatureIdent, version },
      });

      return;
    }

    const ownSuffix = templateId === TemplateIdEnum.ROL_ANSWERS ? undefined : 'saksbehandler';

    const saksbehandler: ISignature = {
      name: getName(ownSignature, element.useShortName),
      title: getTitle(ownSignature.customJobTitle, ownSuffix) ?? MISSING_TITLE,
    };

    const noMedunderskriver =
      medunderskriverSignature === null ||
      templateId === TemplateIdEnum.ROL_QUESTIONS ||
      templateId === TemplateIdEnum.ROL_ANSWERS;

    if (noMedunderskriver) {
      pushLog('useSignatureData: noMedunderskriver is true. Will not show medunderskriver signature.', {
        context: {
          userId: signatureIdent === skipToken ? 'skipToken' : signatureIdent,
          medunderskriverSignatureIsNull: medunderskriverSignature === null ? 'true' : 'false',
          templateId,
          version,
        },
      });
    }

    const medunderskriver: ISignature | undefined = noMedunderskriver
      ? undefined
      : {
          name: getName(medunderskriverSignature, element.useShortName),
          title: medunderskriverSignature.customJobTitle ?? MISSING_TITLE,
        };

    if (
      element.saksbehandler?.name === saksbehandler.name &&
      element.saksbehandler?.title === saksbehandler.title &&
      element.medunderskriver?.name === medunderskriver?.name &&
      element.medunderskriver?.title === medunderskriver?.title
    ) {
      return;
    }

    const data: Partial<SignatureElement> = {
      useShortName: element.useShortName,
      medunderskriver,
      saksbehandler,
    };

    pushLog('useSignatureData: setting new signature data.', {
      context: {
        userId: signatureIdent === skipToken ? 'skipToken' : signatureIdent,
        templateId,
        version,
        medunderskriverLength: medunderskriver?.name.length.toString() ?? 'undefined',
        saksbehandlerLength: saksbehandler.name.length.toString(),
      },
    });

    setNodes(editor, data, { at: [], voids: true, mode: 'lowest', match: (n) => n === element });
  }, [editor, element, medunderskriverSignature, ownSignature, signatureIdent, templateId, version]);
};
