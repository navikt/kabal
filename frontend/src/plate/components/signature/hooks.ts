import { skipToken } from '@reduxjs/toolkit/query';
import { PlateEditor, setNodes } from '@udecode/plate-common';
import { useContext, useEffect } from 'react';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { getName, getTitle } from '@app/plate/components/signature/functions';
import { MISSING_TITLE } from '@app/plate/components/signature/title';
import { EditorValue, ISignature, SignatureElement } from '@app/plate/types';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.employee?.navIdent === 'string'
      ? oppgave.medunderskriver.employee.navIdent
      : skipToken,
  );

  if (typeof oppgave === 'undefined') {
    return undefined;
  }

  if (oppgave.medunderskriver.employee === null) {
    return null;
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

  useEffect(() => {
    if (typeof ownSignature === 'undefined' || typeof medunderskriverSignature === 'undefined') {
      return;
    }

    const ownSuffix = templateId === TemplateIdEnum.ROL_ANSWERS ? undefined : 'saksbehandler';

    const saksbehandler: ISignature = {
      name: getName(ownSignature, element.useShortName),
      title: getTitle(ownSignature.customJobTitle, ownSuffix) ?? MISSING_TITLE,
    };

    const medunderskriver: ISignature | undefined =
      medunderskriverSignature === null ||
      templateId === TemplateIdEnum.ROL_QUESTIONS ||
      templateId === TemplateIdEnum.ROL_ANSWERS
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

    setNodes(editor, data, { at: [], voids: true, mode: 'lowest', match: (n) => n === element });
  }, [editor, element, medunderskriverSignature, ownSignature, templateId]);
};
