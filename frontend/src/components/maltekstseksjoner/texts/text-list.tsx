import { ArrowDownIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { Alert, Button, Tooltip } from '@navikt/ds-react';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
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

      return setPath({ textId: first }, true);
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
      <StyledAlert variant="warning" size="small">
        Ingen tekster funnet
      </StyledAlert>
    );
  }

  return (
    <List>
      {textIdList.map((textId, i) => (
        <ListItem key={textId}>
          {isPublished ? null : (
            <ArrowButtonsContainer>
              <Tooltip content="Flytt opp">
                <Button
                  variant="tertiary"
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
                  variant="tertiary"
                  size="small"
                  disabled={i === lastIndex}
                  onClick={() => moveDown(textId)}
                  icon={<ArrowDownIcon aria-hidden />}
                  loading={isMaltekstUpdating}
                  title="Flytt ned"
                />
              </Tooltip>
            </ArrowButtonsContainer>
          )}
          <StyledTextVersions
            textId={textId}
            isActive={textId === activeTextId}
            setActive={setActive}
            maltekstseksjonId={maltekstseksjon.id}
          />
        </ListItem>
      ))}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 1;
`;

const ArrowButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextVersions = styled(TextVersions)`
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  border-width: 4px;
  border-style: solid;
  border-color: ${({ isActive }) => (isActive ? 'var(--a-border-action-selected)' : 'transparent')};
  flex-grow: 1;
  padding: 4px;
  margin-left: 4px;
  margin-right: 4px;
  flex-grow: 1;

  &:last-child {
    margin-bottom: 4px;
  }
`;

const StyledAlert = styled(Alert)`
  margin-top: 8px;
`;
