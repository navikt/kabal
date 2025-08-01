import { getNewRichText } from '@app/components/smart-editor-texts/functions/new-text';
import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import {
  useCreateMaltekstseksjonMutation,
  useUpdateTextIdListMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import { useAddTextMutation } from '@app/redux-api/texts/mutations';
import { type IGetMaltekstseksjonParams, RichTextTypes } from '@app/types/common-text-types';
import type { INewMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { PadlockLockedIcon, PencilWritingIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';

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
  }, [createMaltekstseksjon, query, setPath]);

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
  const lang = useRedaktoerLanguage();

  const isLocked = textType === RichTextTypes.MALTEKST;

  const { id, versionId, textIdList } = maltekstseksjon;

  const create = useCallback(async () => {
    const text = getNewRichText(textType, lang);

    const createdText = await createText({ text, query: { textType } }).unwrap();

    await updateMaltekst({ id, query, textIdList: [...textIdList, createdText.id] });

    setPath({ maltekstseksjonId: id, maltekstseksjonVersionId: versionId, textId: createdText.id });
  }, [textType, lang, createText, updateMaltekst, id, query, textIdList, setPath, versionId]);

  const textName = isLocked ? 'låst' : 'redigerbar';
  const Icon = isLocked ? PadlockLockedIcon : PencilWritingIcon;

  return (
    <Button
      variant="tertiary"
      size="small"
      onClick={create}
      loading={isLoading || isMaltekstLoading}
      icon={<Icon aria-hidden />}
      className="justify-start"
    >
      Opprett ny {textName} tekst
    </Button>
  );
};
