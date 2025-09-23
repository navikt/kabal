import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { ArrowDownIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { Alert, BoxNew, Button, HStack, Tooltip, VStack } from '@navikt/ds-react';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextVersions } from './text-versions';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

export const TextList = ({ maltekstseksjon, query }: Props) => {
  const setPath = useNavigateMaltekstseksjoner();
  const { textId: activeTextId } = useParams();
  const [updateMaltekst, { isLoading: isMaltekstUpdating }] = useUpdateTextIdListMutation({
    fixedCacheKey: maltekstseksjon.id,
  });
  const lang = useRedaktoerLanguage();

  useEffect(() => {
    if (activeTextId === undefined) {
      const [first] = maltekstseksjon.textIdList;

      if (first === undefined) {
        return;
      }

      setPath({ textId: first }, true);
    }
  }, [activeTextId, maltekstseksjon.textIdList, setPath]);

  const { id, versionId, textIdList, published, publishedDateTime } = maltekstseksjon;

  const moveUp = useCallback(
    (textId: string) => {
      const newTextIdList: string[] = new Array<string>(textIdList.length);

      for (let i = 0; i < textIdList.length; i++) {
        const currentText = textIdList[i];

        if (currentText === undefined) {
          break;
        }

        const nextText = textIdList[i + 1];

        if (nextText === textId) {
          newTextIdList[i] = nextText;
          newTextIdList[i + 1] = currentText;
          i++;
        } else {
          newTextIdList[i] = currentText;
        }
      }

      updateMaltekst({ id, query, textIdList: newTextIdList });
    },
    [id, query, textIdList, updateMaltekst],
  );

  const moveDown = useCallback(
    (textId: string) => {
      const newTextIdList: string[] = new Array<string>(textIdList.length);

      for (let i = textIdList.length - 1; i >= 0; i--) {
        const currentText = textIdList[i];

        if (currentText === undefined) {
          break;
        }

        const prevText = textIdList[i - 1];

        if (prevText === textId) {
          newTextIdList[i] = prevText;
          newTextIdList[i - 1] = currentText;
          i--;
        } else {
          newTextIdList[i] = currentText;
        }
      }

      updateMaltekst({ id, query, textIdList: newTextIdList });
    },
    [id, query, textIdList, updateMaltekst],
  );

  const setActive = useCallback(
    (textId: string) => {
      setPath({ maltekstseksjonId: id, maltekstseksjonVersionId: versionId, textId, lang });
    },
    [setPath, id, versionId, lang],
  );

  const lastIndex = textIdList.length - 1;
  const isPublished = published || publishedDateTime !== null;

  if (textIdList.length === 0) {
    return (
      <Alert variant="warning" size="small" className="mt-2 h-fit">
        Ingen tekster funnet
      </Alert>
    );
  }

  return (
    <VStack gap="4 0" overflowY="auto" overflowX="hidden">
      {textIdList.map((textId, i) => (
        <HStack flexGrow="1" width="100%" key={textId}>
          {isPublished ? null : (
            <VStack>
              <Tooltip content="Flytt opp">
                <Button
                  variant="tertiary-neutral"
                  size="small"
                  disabled={i === 0}
                  onClick={() => moveUp(textId)}
                  icon={<ArrowUpIcon aria-hidden />}
                  loading={isMaltekstUpdating}
                  title="Flytt opp"
                />
              </Tooltip>
              <Tooltip content="Flytt ned">
                <Button
                  variant="tertiary-neutral"
                  size="small"
                  disabled={i === lastIndex}
                  onClick={() => moveDown(textId)}
                  icon={<ArrowDownIcon aria-hidden />}
                  loading={isMaltekstUpdating}
                  title="Flytt ned"
                />
              </Tooltip>
            </VStack>
          )}
          <BoxNew
            asChild
            borderRadius="medium"
            shadow="dialog"
            borderWidth="4"
            borderColor={textId === activeTextId ? 'accent' : undefined}
            flexGrow="1"
            padding="1"
            marginInline="1"
            className="last:mb-1"
          >
            <TextVersions
              textId={textId}
              isActive={textId === activeTextId}
              setActive={setActive}
              maltekstseksjonId={maltekstseksjon.id}
            />
          </BoxNew>
        </HStack>
      ))}
    </VStack>
  );
};
