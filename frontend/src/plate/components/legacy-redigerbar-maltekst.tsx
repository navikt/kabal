import { ArrowCirclepathReverseIcon } from '@navikt/aksel-icons';
import { Button, Loader, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { PlateElement, type PlateElementProps, useEditorReadOnly } from 'platejs/react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { useQuery } from '@/components/smart-editor/hooks/use-query';
import { useReportDynamicContentLoading } from '@/components/smart-editor/tabbed-editors/dynamic-content-loading-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { AddNewParagraphs } from '@/plate/components/common/add-new-paragraph-buttons';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@/plate/components/styled-components';
import { LexSpecialisStatus, lexSpecialis } from '@/plate/functions/lex-specialis/lex-specialis';
import { ELEMENT_EMPTY_VOID } from '@/plate/plugins/element-types';
import { createSimpleParagraph } from '@/plate/templates/helpers';
import type { EmptyVoidElement, RedigerbarMaltekstElement } from '@/plate/types';
import { isNodeEmpty, isOfElementType } from '@/plate/utils/queries';
import { useLazyGetConsumerTextsQuery } from '@/redux-api/texts/consumer';
import { RichTextTypes } from '@/types/common-text-types';
import type { IConsumerRichText, IConsumerText } from '@/types/texts/consumer';

const consistsOfOnlyEmptyVoid = (element: RedigerbarMaltekstElement) => {
  if (element.children.length !== 1) {
    return false;
  }

  const [child] = element.children;

  return isOfElementType<EmptyVoidElement>(child, ELEMENT_EMPTY_VOID);
};

/**
 * @deprecated Remove when all smart documents in prod use maltekstseksjon.
 */
export const LegacyRedigerbarMaltekst = (props: PlateElementProps<RedigerbarMaltekstElement>) => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const { templateId } = useContext(SmartEditorContext);
  const readOnly = useEditorReadOnly();

  const { children, element, editor } = props;

  const query = useQuery({ textType: RichTextTypes.REDIGERBAR_MALTEKST, section: element.section, templateId });

  const [getTexts, { isLoading }] = useLazyGetConsumerTextsQuery();

  const path = editor.api.findPath(element);

  const isInitialized = useRef(!isNodeEmpty(element));

  useReportDynamicContentLoading(isLoading);

  const insertRedigerbarMaltekst = useCallback(async () => {
    if (query === skipToken || path === undefined || oppgaveIsLoading || oppgave === undefined) {
      return;
    }

    isInitialized.current = true;

    try {
      const tekster = await getTexts(query).unwrap();

      const { ytelseId, resultat } = oppgave;
      const { hjemmelIdSet, utfallId, extraUtfallIdSet } = resultat;

      const [lexSpecialisStatus, richText] = lexSpecialis(
        templateId,
        element.section,
        ytelseId,
        hjemmelIdSet,
        utfallId === null ? extraUtfallIdSet : [utfallId, ...extraUtfallIdSet],
        tekster.filter(isRedigerbarMaltekst),
      );

      const nodes = lexSpecialisStatus === LexSpecialisStatus.FOUND ? richText.richText : [createSimpleParagraph()];

      editor.tf.replaceNodes(nodes, { at: path, children: true });
    } catch (e) {
      console.error('RedigerbarMaltekst: Failed to get texts', e, query);
      insertRedigerbarMaltekst().catch((error) => {
        console.error('RedigerbarMaltekst: Failed to insert redigerbar maltekst', error);
      });
    }
  }, [query, path, oppgaveIsLoading, oppgave, getTexts, templateId, element.section, editor]);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = !consistsOfOnlyEmptyVoid(element);

    if (!isInitialized.current) {
      insertRedigerbarMaltekst().catch((error) => {
        console.error('RedigerbarMaltekst: Failed to insert redigerbar maltekst on init', error);
      });
    }
  }, [element, insertRedigerbarMaltekst]);

  if (isLoading) {
    return (
      <PlateElement<RedigerbarMaltekstElement>
        {...props}
        as="div"
        attributes={{ ...props.attributes, contentEditable: false }}
      >
        <SectionContainer
          data-element={element.type}
          data-section={element.section}
          sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
        >
          <Loader title="Laster..." />
        </SectionContainer>
      </PlateElement>
    );
  }

  return (
    <PlateElement<RedigerbarMaltekstElement> {...props} as="div">
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
      >
        {children}
        {readOnly ? null : (
          <SectionToolbar contentEditable={false}>
            <AddNewParagraphs editor={editor} element={element} />
            <Tooltip content="Tilbakestill tekst" delay={0}>
              <Button
                data-color="neutral"
                title="Tilbakestill tekst"
                icon={<ArrowCirclepathReverseIcon aria-hidden />}
                onClick={insertRedigerbarMaltekst}
                variant="tertiary"
                size="xsmall"
                contentEditable={false}
              />
            </Tooltip>
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};

const isRedigerbarMaltekst = (text: IConsumerText): text is IConsumerRichText =>
  text.textType === RichTextTypes.REDIGERBAR_MALTEKST;
