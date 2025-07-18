import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { LegacyRedigerbarMaltekst } from '@app/plate/components/legacy-redigerbar-maltekst';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import type { RedigerbarMaltekstElement } from '@app/plate/types';
import { useLazyGetConsumerTextByIdQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';
import type { IConsumerRichText, IConsumerText } from '@app/types/texts/consumer';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { useContext } from 'react';

export const RedigerbarMaltekst = (props: PlateElementProps<RedigerbarMaltekstElement>) => {
  const [getText, { isFetching }] = useLazyGetConsumerTextByIdQuery();
  const language = useSmartEditorLanguage();
  const { hasWriteAccess } = useContext(SmartEditorContext);

  const { children, element, editor } = props;

  const reload = async () => {
    if (element.id === undefined) {
      return;
    }

    const path = editor.api.findPath(element);

    if (path === undefined) {
      return;
    }

    const text = await getText({ textId: element.id, language }).unwrap();

    if (!isRedigerbarMaltekst(text)) {
      return;
    }

    editor.tf.replaceNodes(text.richText, { at: path, children: true });
  };

  // TODO: Remove when all smart documents in prod use maltekstseksjon
  if (element.id === undefined) {
    return <LegacyRedigerbarMaltekst {...props}>{children}</LegacyRedigerbarMaltekst>;
  }

  const readOnly = editor.api.isReadOnly();

  return (
    <PlateElement<RedigerbarMaltekstElement> {...props} as="div">
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        $sectionType={SectionTypeEnum.REDIGERBAR_MALTEKST}
      >
        {children}
        {readOnly || !hasWriteAccess ? null : (
          <SectionToolbar contentEditable={false}>
            <Tooltip content="Tilbakestill tekst" delay={0}>
              <Button
                icon={<ArrowCirclepathIcon aria-hidden />}
                onClick={reload}
                variant="tertiary"
                size="xsmall"
                contentEditable={false}
                loading={isFetching}
              />
            </Tooltip>
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};

const isRedigerbarMaltekst = (element: IConsumerText): element is IConsumerRichText =>
  element.textType === RichTextTypes.REDIGERBAR_MALTEKST;
