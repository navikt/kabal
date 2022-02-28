import { Collapse, Expand, SuccessStroke } from '@navikt/ds-icons';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';
import { useSetTypeMutation } from '../../../../redux-api/documents';
import { DocumentType, IMainDocument } from '../../../../types/documents';

const OPTIONS = [
  {
    label: 'Vedtaksbrev',
    value: DocumentType.VEDTAKSBREV,
  },
  {
    label: 'Beslutningsbrev',
    value: DocumentType.BESLUTNING,
  },
  {
    label: 'Brev',
    value: DocumentType.BREV,
  },
  // TODO: Put back when BE implements
  // {
  //   label: 'Notat',
  //   value: DocumentType.NOTAT,
  // },
];
interface Props {
  document: IMainDocument;
}

export const DocumentTypeOrFrikoble = ({ document }: Props) => {
  const [setType] = useSetTypeMutation();
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref);

  if (document.parent !== null) {
    return null;
  }

  if (!canEdit || document.isMarkertAvsluttet) {
    return (
      <Container>
        <TextContainer>{OPTIONS.find((option) => option.value === document.dokumentTypeId)?.label}</TextContainer>
      </Container>
    );
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (isDocumentType(target.value)) {
      setType({ oppgaveId, dokumentId: document.id, dokumentTypeId: target.value });
      setOpen(false);
    }
  };

  const options = OPTIONS.map(({ label, value }) => {
    const isActive = value === document.dokumentTypeId;
    const icon = isActive ? <StyledRadioSelectedIcon /> : null;

    return (
      <StyledRadioLabel key={value}>
        <StyledRadio
          type="radio"
          name={`documenttype-${document.id}`}
          key={value}
          value={value}
          checked={isActive}
          onChange={onChange}
        />
        {icon}
        {label}
      </StyledRadioLabel>
    );
  });

  if (!open) {
    return (
      <Container ref={ref}>
        <StyledEditButton title="Endre" onClick={() => setOpen(!open)}>
          <StyledButtonText>
            {OPTIONS.find((option) => option.value === document.dokumentTypeId)?.label}
          </StyledButtonText>
          <Expand />
        </StyledEditButton>
      </Container>
    );
  }

  return (
    <Container ref={ref}>
      <StyledEditButton title="Endre" onClick={() => setOpen(!open)}>
        <StyledButtonText>{OPTIONS.find((option) => option.value === document.dokumentTypeId)?.label}</StyledButtonText>
        <Collapse />
      </StyledEditButton>
      <Dropdown>
        <StyledRadioGroup>{options}</StyledRadioGroup>
      </Dropdown>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
  position: relative;
`;

const TextContainer = styled.span`
  display: flex;
  flex-direction: row;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 4px;
  background-color: transparent;
  text-align: center;
  align-items: center;
  width: 100%;
  font-size: 16px;
  line-height: 1.25;
`;

const StyledEditButton = styled.button`
  display: flex;
  flex-direction: row;
  gap: 4px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 4px;
  background-color: transparent;
  cursor: pointer;
  text-align: center;
  align-items: center;
  font-size: 16px;
  font-family: inherit;

  width: 100%;
  justify-content: space-between;

  :hover {
    background-color: #c9c9c9;
  }
`;

const StyledButtonText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.25;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 0;
  z-index: 1;
  width: 100%;
`;

const StyledRadioGroup = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0;
  border: none;
`;

const StyledRadioLabel = styled.label`
  align-items: center;
  position: relative;
  border-radius: 4px;
  padding: 4px;
  padding-left: 24px; // 4 + 16 + 4
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.25;
  font-size: 16px;

  :hover {
    background-color: #f5f5f5;
  }
`;

const StyledRadioSelectedIcon = styled(SuccessStroke)`
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
`;

const StyledRadio = styled.input`
  display: none;
`;

const DOCUMENT_TYPES = Object.values(DocumentType);

const isDocumentType = (type: string): type is DocumentType => DOCUMENT_TYPES.some((t) => t === type);
