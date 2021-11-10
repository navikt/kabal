import React from 'react';
import { Descendant } from 'slate';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useCreateSmartEditorMutation } from '../../../redux-api/smart-editor';
import { useUpdateSmartEditorIdMutation } from '../../../redux-api/smart-editor-id';
import { INewSmartEditor, ISmartEditorTemplate } from '../../../redux-api/smart-editor-types';
import { ContentTypeEnum, TextAlignEnum } from '../editor-types';
import { GenereltBrevIcon } from './generelt-brev-icon';
import { StyledNewDocument, StyledTemplateButton, StyledTemplateButtonIcon } from './styled-components';

const INITIAL_SLATE_VALUE: Descendant[] = [
  {
    type: ContentTypeEnum.PARAGRAPH,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    children: [
      {
        text: '',
      },
    ],
  },
];

const EMPTY_TEMPLATE: ISmartEditorTemplate = {
  templateId: 'empty',
  title: 'Generelt brev',
  content: [
    {
      id: 'test-smart-editor',
      label: '',
      type: 'rich-text',
      content: INITIAL_SLATE_VALUE,
    },
  ],
};

const TEMPLATES: ISmartEditorTemplate[] = [EMPTY_TEMPLATE];

export const NewDocument = () => {
  const [createSmartEditorDocument] = useCreateSmartEditorMutation();
  const [setSmartEditorId] = useUpdateSmartEditorIdMutation();
  const klagebehandlingId = useKlagebehandlingId();

  const onClick = (template: INewSmartEditor) => {
    createSmartEditorDocument(template)
      .unwrap()
      .then(({ id }) => setSmartEditorId({ smartEditorId: id, klagebehandlingId }));
    close();
  };

  return (
    <StyledNewDocument>
      <h2>Opprett nytt dokument</h2>
      {TEMPLATES.map((template) => (
        <StyledTemplateButton onClick={() => onClick(template)} key={template.templateId}>
          <StyledTemplateButtonIcon>
            <TemplateIcon type={template.templateId} />
          </StyledTemplateButtonIcon>
          {template.title}
        </StyledTemplateButton>
      ))}
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
    default:
      return null;
  }
};
