import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useOppgaveId } from '../../../hooks/use-oppgave-id';
import { useOppgaveType } from '../../../hooks/use-oppgave-type';
import { useCreateSmartEditorMutation } from '../../../redux-api/smart-editor';
import { useUpdateSmartEditorIdMutation } from '../../../redux-api/smart-editor-id';
import { INewSmartEditor, ISmartEditorTemplate } from '../../../types/smart-editor';
import { AVSLAG_TEMPLATE } from '../templates/avslag-template';
import { EMPTY_TEMPLATE } from '../templates/empty-template';
import { MEDHOLD_TEMPLATE } from '../templates/medhold-template';
import { AvslagBrevIcon } from './avslag-brev-icon';
import { GenereltBrevIcon } from './generelt-brev-icon';
import { MedholdBrevIcon } from './medhold-brev-icon';
import {
  StyledHeader,
  StyledNewDocument,
  StyledTemplateButton,
  StyledTemplateButtonIcon,
  StyledTemplates,
} from './styled-components';

const TEMPLATES: ISmartEditorTemplate[] = [EMPTY_TEMPLATE, MEDHOLD_TEMPLATE, AVSLAG_TEMPLATE];

export const NewDocument = () => {
  const [createSmartEditorDocument] = useCreateSmartEditorMutation();
  const [setSmartEditorId] = useUpdateSmartEditorIdMutation();
  const oppgaveId = useOppgaveId();
  const type = useOppgaveType();
  const canEdit = useCanEdit();

  if (!canEdit) {
    return null;
  }

  const onClick = (template: INewSmartEditor) => {
    createSmartEditorDocument(template)
      .unwrap()
      .then(({ id }) => setSmartEditorId({ smartEditorId: id, oppgaveId, type }));
    close();
  };

  return (
    <StyledNewDocument>
      <StyledHeader>Opprett nytt dokument</StyledHeader>

      <StyledTemplates>
        {TEMPLATES.map((template) => (
          <StyledTemplateButton onClick={() => onClick(template)} key={template.templateId}>
            <StyledTemplateButtonIcon>
              <TemplateIcon type={template.templateId} />
            </StyledTemplateButtonIcon>
            {template.title}
          </StyledTemplateButton>
        ))}
      </StyledTemplates>
    </StyledNewDocument>
  );
};

interface TemplateIconProps {
  type: string;
}

const TemplateIcon = ({ type }: TemplateIconProps) => {
  switch (type) {
    case 'empty':
      return <GenereltBrevIcon />;
    case 'medhold':
      return <MedholdBrevIcon />;
    case 'avslag':
      return <AvslagBrevIcon />;
    default:
      return null;
  }
};
