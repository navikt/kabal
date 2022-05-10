import { Refresh } from '@navikt/ds-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import styled from 'styled-components';
import { ApiQuery } from '../../../../types/texts/texts';
import { MALTEKST_SECTION_NAMES } from '../../../smart-editor/constants';
import { ParagraphStyle } from '../../styled-elements/content';
import { TextAlignEnum } from '../../types/editor-enums';
import { MaltekstElementType } from '../../types/editor-void-types';
import { renderElement } from './render';
import { ShowTags } from './show-tags';

interface Props {
  element: MaltekstElementType;
  query: ApiQuery | typeof skipToken;
  isLoading: boolean;
  reload: () => Promise<void>;
}

export const MaltekstContent = ({ element, query, isLoading, reload }: Props) => {
  if (isLoading || element.content === null) {
    return (
      <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>
        <Loader />
      </ParagraphStyle>
    );
  }

  if (element.content.length === 0) {
    return (
      <>
        <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>
          Ingen maltekst funnet for seksjon &ldquo;{MALTEKST_SECTION_NAMES[element.section]}&rdquo;.
        </ParagraphStyle>
        <ReloadButtonWrapper>
          <ReloadButton onClick={reload}>
            <Refresh />
          </ReloadButton>
        </ReloadButtonWrapper>
      </>
    );
  }

  return (
    <>
      {element.content.flatMap(({ content, id, created, modified, title, ...metadata }) => (
        <section key={id}>
          {content.map((c, i) => renderElement(c, i.toString()))}
          <ShowTags created={created} modified={modified} title={title} limits={metadata} query={query} />
        </section>
      ))}
      <ReloadButtonWrapper>
        <ReloadButton onClick={reload}>
          <Refresh />
        </ReloadButton>
      </ReloadButtonWrapper>
    </>
  );
};

const ReloadButton = styled.button`
  position: sticky;
  top: 24px;
  background-color: transparent;
  height: fit-content;
  cursor: pointer;
  padding: 0;
  margin: 0;
  border: none;
`;

const ReloadButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 100%;
  height: 100%;
  padding-left: 12px;
`;
