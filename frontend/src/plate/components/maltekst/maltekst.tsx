import { ArrowCirclepathIcon, CheckmarkIcon, PadlockUnlockedIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  findNodePath,
  isEditorReadOnly,
  isElement,
  replaceNodeChildren,
  unwrapNodes,
} from '@udecode/plate-common';
import React, { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { LegacyMaltekst } from '@app/plate/components/maltekst/legacy-maltekst';
import { SectionContainer, SectionToolbar, SectionTypeEnum } from '@app/plate/components/styled-components';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { EditorValue, MaltekstElement } from '@app/plate/types';
import { useLazyGetConsumerTextByIdQuery } from '@app/redux-api/texts/consumer';
import { RichTextTypes } from '@app/types/common-text-types';
import { PublishedRichTextVersion, PublishedTextVersion } from '@app/types/texts/responses';

export const Maltekst = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<EditorValue, MaltekstElement>) => {
  const [getText, { isFetching }] = useLazyGetConsumerTextByIdQuery();

  // TODO: Remove this when all smart documents in prod use maltekstseksjon
  if (element.id === undefined) {
    return (
      <LegacyMaltekst editor={editor} attributes={attributes} element={element}>
        {children}
      </LegacyMaltekst>
    );
  }

  const reload = async () => {
    if (element.id === undefined) {
      return;
    }

    const path = findNodePath(editor, element);

    if (path === undefined) {
      return;
    }

    const text = await getText(element.id).unwrap();

    if (!isMaltekst(text)) {
      return;
    }

    replaceNodeChildren(editor, { at: path, nodes: text.richText });
  };

  const [first] = element.children;

  if (isElement(first) && first.type === ELEMENT_EMPTY_VOID) {
    return (
      <PlateElement as="div" attributes={attributes} element={element} editor={editor}>
        {null}
      </PlateElement>
    );
  }

  const unlock = () => unwrapNodes(editor, { match: (n) => n === element, at: [] });

  const readOnly = isEditorReadOnly(editor);

  return (
    <PlateElement
      asChild
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onDragStart={(event) => event.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <SectionContainer
        data-element={element.type}
        data-section={element.section}
        $sectionType={SectionTypeEnum.MALTEKST}
      >
        {children}
        {readOnly ? null : (
          <SectionToolbar contentEditable={false}>
            <Tooltip content="Oppdater til siste versjon" delay={0}>
              <Button
                icon={<ArrowCirclepathIcon aria-hidden />}
                onClick={reload}
                variant="tertiary"
                size="xsmall"
                contentEditable={false}
                loading={isFetching}
              />
            </Tooltip>
            <Unlock onClick={unlock} loading={isFetching} />
          </SectionToolbar>
        )}
      </SectionContainer>
    </PlateElement>
  );
};

const Unlock = ({ onClick, loading }: { loading: boolean; onClick: () => void }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setShowConfirm(false));

  const buttonStyle = showConfirm ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {};

  return (
    <UnlockContainer ref={ref}>
      <Tooltip
        content="Lås opp tekst (Obs! Kan ikke låses igjen. Teksten du låser opp vil ikke lenger automatisk påvirkes om du endrer utfall/resultat eller hjemmel.)"
        delay={0}
      >
        <Button
          style={buttonStyle}
          icon={<PadlockUnlockedIcon aria-hidden />}
          onClick={() => setShowConfirm(!showConfirm)}
          variant={showConfirm ? 'primary' : 'tertiary'}
          size="xsmall"
          contentEditable={false}
          loading={loading}
        />
      </Tooltip>

      {showConfirm ? (
        <ConfirmContainer>
          <Tooltip content="Bekreft" delay={0} placement="right">
            <Button
              icon={<CheckmarkIcon aria-hidden />}
              onClick={onClick}
              variant="tertiary"
              size="xsmall"
              contentEditable={false}
              loading={loading}
            />
          </Tooltip>
          <Tooltip content="Avbryt" delay={0} placement="right">
            <Button
              icon={<XMarkIcon aria-hidden />}
              onClick={() => setShowConfirm(false)}
              variant="tertiary"
              size="xsmall"
              contentEditable={false}
              loading={loading}
            />
          </Tooltip>
        </ConfirmContainer>
      ) : null}
    </UnlockContainer>
  );
};

const UnlockContainer = styled.div`
  position: relative;
  display: flex;
`;

const ConfirmContainer = styled.div`
  position: absolute;
  top: 100%;
  background-color: var(--a-bg-subtle);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: var(--a-shadow-medium);
`;
const isMaltekst = (text: PublishedTextVersion): text is PublishedRichTextVersion =>
  text.textType === RichTextTypes.MALTEKST;
