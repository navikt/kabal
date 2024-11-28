import { ModifiedCreatedDateTime } from '@app/components/datetime/datetime';
import { Changelog } from '@app/components/smart-editor-texts/edit/changelog';
import { isGodFormuleringType, isRegelverkType, isRichTextType } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { TextChangeType } from '@app/types/common-text-types';
import { Language } from '@app/types/texts/language';
import type { IText } from '@app/types/texts/responses';
import { HStack, Label, useId } from '@navikt/ds-react';
import { useMemo } from 'react';

export const TextModified = ({ id, created, textType, edits }: IText) => {
  const { data: versions = [] } = useGetTextVersionsQuery(id);
  const modifiedId = useId();
  const language = useRedaktoerLanguage();

  const changeType: TextChangeType = useMemo(() => {
    if (isRichTextType(textType) || isGodFormuleringType(textType)) {
      return language === Language.NB ? TextChangeType.RICH_TEXT_NB : TextChangeType.RICH_TEXT_NN;
    }

    if (isRegelverkType(textType)) {
      return TextChangeType.RICH_TEXT_UNTRANSLATED;
    }

    return language === Language.NB ? TextChangeType.PLAIN_TEXT_NB : TextChangeType.PLAIN_TEXT_NN;
  }, [language, textType]);

  const filteredEdits = useMemo(
    () => edits.filter((e) => e.changeType === changeType || e.changeType === TextChangeType.TEXT_VERSION_CREATED),
    [edits, changeType],
  );

  const [lastEdit] = filteredEdits;

  return (
    <HStack gap="2" align="center" data-element="text-modified">
      <Label size="small" htmlFor={modifiedId}>
        Sist endret:
      </Label>
      <ModifiedCreatedDateTime id={modifiedId} lastEdit={lastEdit} created={created} />
      <Changelog versions={versions} />
    </HStack>
  );
};
