import { PadlockLockedIcon, PencilWritingIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import {
  useCreateMaltekstseksjonMutation,
  useUpdateTextIdListMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import { useAddTextMutation } from '@app/redux-api/texts/mutations';
import { IGetMaltekstseksjonParams, RichTextTypes } from '@app/types/common-text-types';
import { INewMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { Language } from '@app/types/texts/language';
import { INewTextParams } from '@app/types/texts/params';

interface Props {
  query: IGetMaltekstseksjonParams;
}

export const CreateMaltekstseksjon = ({ query }: Props) => {
  const [createMaltekstseksjon, { isLoading }] = useCreateMaltekstseksjonMutation();
  const setPath = useNavigateMaltekstseksjoner();

  const create = useCallback(async () => {
    const maltekstseksjon: INewMaltekstseksjonParams['maltekstseksjon'] = {
      title: '',
      textIdList: [],
      enhetIdList: [],
      templateSectionIdList: [],
      utfallIdList: [],
      ytelseHjemmelIdList: [],
    };
    const { id, versionId } = await createMaltekstseksjon({ maltekstseksjon, query }).unwrap();

    setPath({ maltekstseksjonId: id, maltekstseksjonVersionId: versionId });
  }, [createMaltekstseksjon, setPath, query]);

  return (
    <Button variant="secondary" size="small" onClick={create} loading={isLoading} icon={<PlusIcon aria-hidden />}>
      Legg til ny
    </Button>
  );
};

interface CreateTextProps {
  query: IGetMaltekstseksjonParams;
  textType: RichTextTypes.MALTEKST | RichTextTypes.REDIGERBAR_MALTEKST;
  maltekstseksjon: IMaltekstseksjon;
}

export const CreateText = ({ query, textType, maltekstseksjon }: CreateTextProps) => {
  const [createText, { isLoading }] = useAddTextMutation();
  const [updateMaltekst, { isLoading: isMaltekstLoading }] = useUpdateTextIdListMutation({
    fixedCacheKey: maltekstseksjon.id,
  });
  const setPath = useNavigateMaltekstseksjoner();

  const isLocked = textType === RichTextTypes.MALTEKST;

  const { id, versionId, textIdList } = maltekstseksjon;

  const create = useCallback(async () => {
    const text: INewTextParams = {
      title: '',
      textType,
      richText: {
        [Language.NB]: [createSimpleParagraph()],
        [Language.NN]: [createSimpleParagraph()],
      },
      enhetIdList: [],
      templateSectionIdList: [],
      utfallIdList: [],
      ytelseHjemmelIdList: [],
    };

    const createdText = await createText({ text, query: { textType } }).unwrap();

    await updateMaltekst({ id, query, textIdList: [...textIdList, createdText.id] });

    setPath({ maltekstseksjonId: id, maltekstseksjonVersionId: versionId, textId: createdText.id });
  }, [textType, createText, updateMaltekst, id, query, textIdList, setPath, versionId]);

  const textName = isLocked ? 'låst' : 'redigerbar';
  const Icon = isLocked ? PadlockLockedIcon : PencilWritingIcon;

  return (
    <StyledButton
      variant="tertiary"
      size="small"
      onClick={create}
      loading={isLoading || isMaltekstLoading}
      icon={<Icon aria-hidden />}
    >
      Opprett ny {textName} tekst
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  justify-content: flex-start;
`;
