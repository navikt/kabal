import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, TextField } from '@navikt/ds-react';
import React, { Fragment, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import {
  useEnhetNameFromIdOrLoading,
  useFullYtelseNameFromIdOrLoading,
  useRegistreringshjemmelFromIdOrLoading,
} from '@app/hooks/use-kodeverk-ids';
import { useUtfallNameOrLoading } from '@app/hooks/use-utfall-name';
import { TEMPLATES } from '@app/plate/templates/templates';
import { useUpdateTextMutation } from '@app/redux-api/texts';
import { NoTemplateIdEnum, TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IText, IUpdatePlainTextProperty, IUpdateRichTextProperty, isPlainTextType } from '@app/types/texts/texts';
import { DateTime } from '../../datetime/datetime';
import { MALTEKST_SECTION_NAMES } from '../../smart-editor/constants';
import { ResolvedTags } from '../../tags/resolved-tag';
import { KlageenhetSelect, SectionSelect, TemplateSelect, UtfallSelect, YtelseSelect } from '../edit-text-selects';
import { HjemlerSelect } from '../hjemler-select';
import { useTextQuery } from '../hooks/use-text-query';
import { DeleteTextButton } from '../smart-editor-texts-delete';
import { FilterDivider } from '../styled-components';
import { ContentEditor } from './content-editor';

type Key = IUpdatePlainTextProperty['key'] | IUpdateRichTextProperty['key'];
type Value = IUpdatePlainTextProperty['value'] | IUpdateRichTextProperty['value'];

export const EditSmartEditorText = (savedText: IText) => {
  const [update, status] = useUpdateTextMutation({
    fixedCacheKey: savedText.id,
  });
  const query = useTextQuery();
  const [text, setText] = useState<IText>(savedText);

  useEffect(() => {
    if (savedText.id !== text.id) {
      setText(savedText);
    }
  }, [savedText, text.id]);

  const { id, modified, created, hjemler, ytelser, utfall, enheter, sections, templates, textType, title } = text;

  const updateUnsavedText = (value: Value, key: Key) => setText({ ...text, [key]: value });

  const save = () => update({ text, query });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      save();
    }
  };

  const sectionSelect = isPlainTextType(textType) ? null : (
    <SectionSelect selected={sections} onChange={(value) => updateUnsavedText(value, 'sections')}>
      Seksjoner
    </SectionSelect>
  );

  return (
    <Fragment key={id}>
      <Header onKeyDown={onKeyDown}>
        <TextField
          label="Tittel"
          size="small"
          value={title}
          onChange={({ target }) => updateUnsavedText(target.value, 'title')}
        />

        <LineContainer>
          <strong>Sist endret:</strong>
          <DateTime modified={modified} created={created} />
        </LineContainer>

        <LineContainer>
          <TemplateSelect
            selected={templates.filter((t): t is TemplateIdEnum => t !== NoTemplateIdEnum.NONE)}
            onChange={(value) => updateUnsavedText(value, 'templates')}
          >
            Maler
          </TemplateSelect>

          {sectionSelect}

          <FilterDivider />

          <HjemlerSelect selected={hjemler} onChange={(value: Value) => updateUnsavedText(value, 'hjemler')} />

          <YtelseSelect selected={ytelser ?? []} onChange={(value) => updateUnsavedText(value, 'ytelser')}>
            Ytelser
          </YtelseSelect>

          <UtfallSelect selected={utfall} onChange={(value) => updateUnsavedText(value, 'utfall')}>
            Utfall
          </UtfallSelect>

          <KlageenhetSelect selected={enheter ?? []} onChange={(value) => updateUnsavedText(value, 'enheter')}>
            Enheter
          </KlageenhetSelect>
        </LineContainer>

        <TagContainer>
          <ResolvedTags
            ids={templates}
            useName={(tId) => TEMPLATES.find(({ templateId }) => templateId === tId)?.tittel ?? tId}
            variant="templates"
          />

          <ResolvedTags ids={sections} useName={useMaltekstSectionName} variant="sections" />

          <ResolvedTags ids={hjemler} useName={useRegistreringshjemmelFromIdOrLoading} variant="hjemler" />

          <ResolvedTags ids={ytelser} useName={useFullYtelseNameFromIdOrLoading} variant="ytelser" />

          <ResolvedTags ids={utfall} useName={useUtfallNameOrLoading} variant="utfall" />

          <ResolvedTags ids={enheter} useName={useEnhetNameFromIdOrLoading} variant="enheter" />
        </TagContainer>
      </Header>

      <ContentEditor text={text} update={updateUnsavedText} onKeyDown={onKeyDown} />

      <Buttons onKeyDown={onKeyDown}>
        <Button onClick={save} icon={<CheckmarkIcon aria-hidden />} size="small" loading={status.isLoading}>
          Lagre og publisér
        </Button>
        <DeleteTextButton id={id} title={savedText.title} />
      </Buttons>
    </Fragment>
  );
};

const isMaltekstSectionName = (sectionId: string): sectionId is keyof typeof MALTEKST_SECTION_NAMES =>
  Object.keys(MALTEKST_SECTION_NAMES).includes(sectionId);

const useMaltekstSectionName = (sectionId: string) =>
  isMaltekstSectionName(sectionId) ? MALTEKST_SECTION_NAMES[sectionId] : sectionId;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  background: var(--a-surface-subtle);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 16px;
`;

const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
  gap: 8px;
  flex-grow: 0;
`;
