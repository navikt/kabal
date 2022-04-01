import { Refresh } from '@navikt/ds-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import {
  ContentTypeEnum,
  HeadingTypesEnum,
  MaltekstElementType,
  NonVoidElementTypes,
  TextAlignEnum,
} from '../../editor-types';
import { ParagraphStyle } from '../../styled-elements/content';
import { voidStyle } from '../style';
import { renderElement } from './render';

interface Props {
  element: MaltekstElementType;
}

export const MaltekstElement = ({ element }: Props) => {
  const editor = useSlateStatic();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: Migrate to RTK Query API when API exists.
  const loadMaltekst = useCallback(
    (e: MaltekstElementType) => {
      getStaticValue(e.source).then((maltekst) => {
        Transforms.setNodes<MaltekstElementType>(
          editor,
          { maltekst },
          {
            match: (n) => n === e,
            voids: true,
            at: [],
          }
        );
      });

      setIsLoading(false);
    },
    [editor]
  );

  useEffect(() => {
    if (element.maltekst === null && !isLoading) {
      setIsLoading(true);
      loadMaltekst(element);
    }
  }, [element, isLoading, loadMaltekst]);

  return (
    <MaltekstContainer contentEditable={false}>
      {getContent(element, isLoading, () => loadMaltekst(element))}
    </MaltekstContainer>
  );
};

const getContent = (element: MaltekstElementType, isLoading: boolean, reload: () => void) => {
  if (element.maltekst === null || isLoading) {
    return <ParagraphStyle textAlign={TextAlignEnum.TEXT_ALIGN_LEFT}>Maltekst laster...</ParagraphStyle>;
  }

  // TODO: Implement spinning icon on reload.
  return (
    <>
      {element.maltekst.map((e, i) => renderElement(e, `${i}`))}
      <ReloadButtonWrapper>
        <ReloadButton onClick={reload}>
          <Refresh />
        </ReloadButton>
      </ReloadButtonWrapper>
    </>
  );
};

const MaltekstContainer = styled.div`
  position: relative;
  ${voidStyle}
`;

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

export const getStaticValue = async (source: string): Promise<NonVoidElementTypes[]> => {
  if (source === 'document-title') {
    return [{ type: HeadingTypesEnum.HEADING_ONE, children: [{ text: 'NAV Klageinstans har behandlet klagen din' }] }];
  }

  if (source === 'regards') {
    return [
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [{ text: 'Med vennlig hilsen\nNAV Klageinstans' }],
      },
    ];
  }

  if (source === 'questions') {
    return [
      {
        type: HeadingTypesEnum.HEADING_ONE,
        children: [{ text: 'Har du spørsmål?' }],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [
          {
            text: 'Du finner mer informasjon på nav.no. Hvis du ikke finner svar på spørsmålet ditt, kontakt oss på nav.no/kontakt.',
          },
        ],
      },
    ];
  }

  if (source === 'anke') {
    return [
      {
        type: HeadingTypesEnum.HEADING_ONE,
        children: [{ text: 'Du har rett til å anke' }],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [
          {
            text: 'Hvis du mener dette vedtaket er feil, kan du anke til Trygderetten innen seks uker fra den datoen vedtaket kom fram til deg. Du finner informasjon, skjema og første side for innsending på www.nav.no/klage. Velg NAV Klageinstans [avdeling].',
          },
        ],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [{ text: 'Anken må være underskrevet av deg.' }],
      },
      {
        type: ContentTypeEnum.PARAGRAPH,
        textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
        children: [
          { text: 'I trygdesaker må du først anke til Trygderetten før du kan ta saken videre til lagmannsretten.' },
        ],
      },
    ];
  }

  return [];
};
