import { Checkbox } from 'nav-frontend-skjema';
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { isNotNull } from '../../../../functions/is-not-type-guards';
import { useGetDocumentsQuery } from '../../../../redux-api/documents';
import { useGetTilknyttedeDokumenterQuery } from '../../../../redux-api/oppgavebehandling';
import { IOppgavebehandling } from '../../../../types/oppgavebehandling';
import { IDocumentListElement } from '../../../../types/smart-editor';
import { ListContentEnum, ListTypesEnum } from '../../editor-types';
import { BulletListElement, ListItemElement } from '../../slate-elements';

type Content = IDocumentListElement['content'];
interface Props {
  oppgave: IOppgavebehandling;
  element: IDocumentListElement;
  onChange: (value: Content, element: IDocumentListElement) => void;
}

export const DocumentListElement = React.memo(
  ({ oppgave, element, onChange }: Props) => {
    const { data: newDocuments, isLoading: newIsLoading } = useGetDocumentsQuery({ oppgaveId: oppgave.id });
    const { data: attachedDocuments, isLoading: attachedIsLoading } = useGetTilknyttedeDokumenterQuery(oppgave.id);

    const isLoading =
      newIsLoading ||
      attachedIsLoading ||
      typeof newDocuments === 'undefined' ||
      typeof attachedDocuments === 'undefined';

    const documents = useMemo<Content>(
      () =>
        isLoading
          ? element.content
          : [
              ...newDocuments.map(({ id, tittel }) => ({ id, title: tittel })),
              ...attachedDocuments.dokumenter.filter(hasTitle).map(({ dokumentInfoId, journalpostId, tittel }) => ({
                id: `${journalpostId}-${dokumentInfoId}`,
                title: tittel,
              })),
            ].map(({ id, title }) => {
              const existing = element.content.find(({ id: eId }) => eId === id);

              if (typeof existing === 'undefined') {
                return { id, title, include: false };
              }

              return { ...existing, title };
            }, []),
      [isLoading, element.content, newDocuments, attachedDocuments?.dokumenter]
    );

    useEffect(() => {
      if (
        element.content.length !== documents.length ||
        element.content.some(
          (e) => !documents.some((d) => d.id === e.id && d.include === e.include && d.title === e.title)
        )
      ) {
        onChange(documents, element);
      }
    }, [documents, element, onChange]);

    if (isLoading) {
      return null;
    }

    return (
      <Container>
        <BulletListElement
          element={{ type: ListTypesEnum.BULLET_LIST, children: [] }}
          attributes={{ 'data-slate-node': 'element', ref: undefined }}
        >
          {documents.map(({ id, title, include }) => (
            <ListItemElement
              key={id}
              element={{ type: ListContentEnum.LIST_ITEM, children: [] }}
              attributes={{ 'data-slate-node': 'element', ref: undefined }}
            >
              <Checkbox
                label={title}
                value={id}
                checked={include}
                onChange={({ target }) =>
                  onChange(
                    documents.map((d) => (d.id === id ? { ...d, include: target.checked } : d)),
                    element
                  )
                }
              />
            </ListItemElement>
          ))}
        </BulletListElement>
      </Container>
    );
  },
  (prevProps, nextProps) =>
    prevProps.element.id === nextProps.element.id &&
    prevProps.element.type === nextProps.element.type &&
    prevProps.element.content === nextProps.element.content
);

DocumentListElement.displayName = 'DocumentListElement';

const Container = styled.div`
  padding-left: 16px;
`;

const hasTitle = <T, R extends T & { tittel: string }>(d: T & { tittel: string | null }): d is R => isNotNull(d.tittel);
