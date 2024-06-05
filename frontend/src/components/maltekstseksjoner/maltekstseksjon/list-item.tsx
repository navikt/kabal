import { CircleBrokenIcon, LinkBrokenIcon, PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Button, HelpText, Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { XMarkOctagonFillIconColored } from '@app/components/colored-icons/colored-icons';
import { createDragUI } from '@app/components/maltekstseksjoner/drag-and-drop/create-drag-ui';
import { useMaltekstseksjonPath } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { IGetMaltekstseksjonParams, RichTextTypes } from '@app/types/common-text-types';
import { isApiError } from '@app/types/errors';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { DragAndDropContext } from '../drag-and-drop/drag-context';
import { TextLink } from '../text-link';

interface LoadTextListItemProps {
  textId: string;
  maltekstseksjon: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

export const LoadTextListItem = ({ textId, maltekstseksjon, query }: LoadTextListItemProps) => {
  const [updateTextIdList, { isLoading: isRemoving }] = useUpdateTextIdListMutation({
    fixedCacheKey: maltekstseksjon.id,
  });
  const { data: versions, isLoading, isError, error } = useGetTextVersionsQuery(textId);
  const { setDraggedTextId, clearDragState } = useContext(DragAndDropContext);
  const dragElementRef = useRef<HTMLAnchorElement>(null);
  const dragElementUI = useRef<HTMLAnchorElement | null>(null);
  const removeDragUI = useRef<() => void>(() => dragElementUI.current?.remove());

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.dataTransfer.clearData();
      e.dataTransfer.setData('text/plain', textId);

      removeDragUI.current = createDragUI(dragElementRef, e);

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'move';
      setDraggedTextId(textId);
    },
    [setDraggedTextId, textId],
  );

  const text = !isLoading && versions !== undefined ? versions[0] : undefined;

  const isReady = text !== undefined;

  const Icon = useMemo(() => {
    if (!isReady) {
      return CircleBrokenIcon;
    }

    if (text.textType === RichTextTypes.MALTEKST) {
      return PadlockLockedIcon;
    }

    return PencilWritingIcon;
  }, [isReady, text?.textType]);

  const onRemove = useCallback(() => {
    updateTextIdList({
      id: maltekstseksjon.id,
      query,
      textIdList: maltekstseksjon.textIdList.filter((id) => id !== textId),
    });
  }, [maltekstseksjon.id, maltekstseksjon.textIdList, query, textId, updateTextIdList]);

  const unlink = useMemo(
    () => (
      <Tooltip content="Fjern tekst fra maltekstseksjon">
        <Button
          size="xsmall"
          variant="danger"
          icon={<LinkBrokenIcon aria-hidden />}
          onClick={onRemove}
          loading={isRemoving}
        />
      </Tooltip>
    ),
    [isRemoving, onRemove],
  );

  const path = useMaltekstseksjonPath({
    maltekstseksjonId: maltekstseksjon.id,
    maltekstseksjonVersionId: maltekstseksjon.versionId,
    textId,
  });

  if (isError) {
    const helpText =
      'data' in error && isApiError(error.data) ? (
        <HelpText strategy="fixed">
          <HelpTextContainer>{error.data.detail}</HelpTextContainer>
        </HelpText>
      ) : null;

    return (
      <>
        {unlink}
        <ErrorContainer>
          <XMarkOctagonFillIconColored aria-hidden />
          Feil ved lasting
          {helpText}
        </ErrorContainer>
      </>
    );
  }

  return (
    <>
      {maltekstseksjon.publishedDateTime === null ? unlink : null}
      <TextLink
        ref={dragElementRef}
        to={path}
        modified={isReady ? text.modified : ''}
        icon={<Icon aria-hidden />}
        hasDraft={text?.publishedDateTime === null}
        draggable={isReady}
        onDragStart={onDragStart}
        onDragEnd={() => {
          removeDragUI.current();
          clearDragState();
        }}
      >
        {isReady ? text.title : 'Laster...'}
      </TextLink>
    </>
  );
};

const Container = styled.div`
  height: 38px;
`;

const ErrorContainer = styled(Container)`
  display: flex;
  align-items: center;
  margin-left: 8px;
  gap: 8px;
`;

const HelpTextContainer = styled.div`
  max-width: 300px;
  white-space: normal;
`;
