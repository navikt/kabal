import { Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Plate } from '@udecode/plate-common';
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { getTitle } from '@app/components/editable-title/editable-title';
import { renderReadOnlyLeaf } from '@app/plate/leaf/render-leaf';
import { PlateEditor } from '@app/plate/plate-editor';
import { previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import { EditorValue, RichTextEditor, RootElement } from '@app/plate/types';
import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { useLazyGetTextByIdQuery } from '@app/redux-api/texts/queries';
import { RichTextTypes } from '@app/types/common-text-types';
import { IRichText, IText } from '@app/types/texts/responses';

interface Props {
  id: string | null;
}

export const Preview = ({ id }: Props) => {
  const { data: maltekstseksjon } = useGetMaltekstseksjonQuery(id ?? skipToken);
  const [getContent] = useLazyGetTextByIdQuery();
  const [children, setChildren] = useState<RootElement[] | null>(null);

  const getChildren = useCallback(async () => {
    if (maltekstseksjon === undefined) {
      return;
    }

    const texts = await Promise.all(maltekstseksjon.textIdList.map((tId) => getContent(tId, false).unwrap()));

    const c: RootElement[] = texts.filter(isMaltekstOrRedigerbarMaltekst).flatMap((text) => text.content);

    setChildren(c);
  }, [getContent, maltekstseksjon]);

  useEffect(() => {
    getChildren();
  }, [getChildren]);

  if (id === null) {
    return null;
  }

  if (maltekstseksjon === undefined || children === null) {
    return <Loader title="Laster..." />;
  }

  return (
    <>
      <PreviewBackground>
        <Heading level="1" size="xsmall">
          Forhåndsvisning av {getTitle(maltekstseksjon.title)}
        </Heading>
        <Sheet>
          <Plate<EditorValue, RichTextEditor> id={id} initialValue={children} readOnly plugins={previewPlugins}>
            <PlateEditor id={id} readOnly renderLeaf={renderReadOnlyLeaf} />
          </Plate>
        </Sheet>
      </PreviewBackground>
    </>
  );
};

const PreviewBackground = styled.div`
  background: var(--a-surface-subtle);
  padding: var(--a-spacing-4);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--a-spacing-4);
`;

const Sheet = styled.div`
  padding: 20mm;
  padding-top: 15mm;
  box-shadow: var(--a-shadow-medium);
  background: white;
  width: 210mm;
`;

const isMaltekstOrRedigerbarMaltekst = (text: IText): text is IRichText =>
  text.textType === RichTextTypes.MALTEKST || text.textType === RichTextTypes.REDIGERBAR_MALTEKST;
