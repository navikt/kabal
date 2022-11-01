import { TextField } from '@navikt/ds-react';
import React, { Fragment, useCallback } from 'react';
import styled from 'styled-components';
import { useDebounced } from '../../../hooks/use-debounce';
import {
  useEnhetNameFromId,
  useFullYtelseNameFromId,
  useRegistreringshjemmelFromId,
} from '../../../hooks/use-kodeverk-ids';
import { useUtfallName } from '../../../hooks/use-utfall-name';
import { useUpdateTextPropertyMutation } from '../../../redux-api/texts';
import { NoTemplateIdEnum, TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { IText, IUpdateTextPropertyParams, TextTypes } from '../../../types/texts/texts';
import { DateTime } from '../../datetime/datetime';
import { MALTEKST_SECTION_NAMES } from '../../smart-editor/constants';
import { TEMPLATES } from '../../smart-editor/templates/templates';
import { ResolvedTags } from '../../tags/resolved-tag';
import { HjemlerSelect } from '../hjemler-select';
import { useTextQuery } from '../hooks/use-text-query';
import { SavedStatus } from '../saved-status';
import { KodeverkSelect, SectionSelect, TemplateSelect } from '../select';
import { DeleteTextButton } from '../smart-editor-texts-delete';
import { FilterDivider } from '../styled-components';
import { HeaderFooterEditor } from './header-footer';
import { RichTextEditor } from './rich-text';

type Value = IUpdateTextPropertyParams['value'];
type Key = IUpdateTextPropertyParams['key'];

export const EditSmartEditorText = (savedText: IText) => {
  const [update, { isLoading, isUninitialized }] = useUpdateTextPropertyMutation({ fixedCacheKey: savedText.id });
  const query = useTextQuery();

  const { id, modified, created, hjemler, ytelser, utfall, enheter, sections, templates, textType } = savedText;

  const [title, setTitle] = useDebounced(
    savedText.title,
    useCallback((value) => update({ key: 'title', value, query, id }), [query, update, id]),
    500
  );

  const immediateUpdate = useCallback(
    (value: Value, key: Key) => update({ key, value, query, id }),
    [query, update, id]
  );

  const sectionSelect =
    textType === TextTypes.HEADER || textType === TextTypes.FOOTER ? null : (
      <SectionSelect selected={sections} onChange={(value) => immediateUpdate(value, 'sections')}>
        Seksjoner
      </SectionSelect>
    );

  return (
    <Fragment key={id}>
      <Header>
        <TextField label="Tittel" size="small" value={title} onChange={(event) => setTitle(event.target.value)} />

        <LineContainer>
          <strong>Sist endret:</strong>
          <DateTime modified={modified} created={created} />
          <SavedStatus isSaved={!isLoading || isUninitialized} />
        </LineContainer>

        <LineContainer>
          <TemplateSelect
            selected={templates.filter((t): t is TemplateIdEnum => t !== NoTemplateIdEnum.NONE)}
            onChange={(value) => immediateUpdate(value, 'templates')}
          >
            Maler
          </TemplateSelect>
          {sectionSelect}

          <FilterDivider />

          <HjemlerSelect selected={hjemler} onChange={(value: Value) => immediateUpdate(value, 'hjemler')} />

          <KodeverkSelect kodeverkKey="ytelser" selected={ytelser} onChange={immediateUpdate}>
            Ytelser
          </KodeverkSelect>
          <KodeverkSelect kodeverkKey="utfall" selected={utfall} onChange={immediateUpdate}>
            Utfall
          </KodeverkSelect>
          <KodeverkSelect
            kodeverkKey="klageenheter"
            selected={enheter}
            onChange={(value: Value) => immediateUpdate(value, 'enheter')}
          >
            Enheter
          </KodeverkSelect>
        </LineContainer>

        <TagContainer>
          <ResolvedTags
            ids={templates}
            useName={(tId) => TEMPLATES.find(({ templateId }) => templateId === tId)?.tittel ?? tId}
            variant="templates"
          />

          <ResolvedTags ids={sections} useName={(sectionId) => MALTEKST_SECTION_NAMES[sectionId]} variant="sections" />

          <ResolvedTags ids={hjemler} useName={useRegistreringshjemmelFromId} variant="hjemler" />

          <ResolvedTags ids={ytelser} useName={useFullYtelseNameFromId} variant="ytelser" />

          <ResolvedTags ids={utfall} useName={useUtfallName} variant="utfall" />

          <ResolvedTags ids={enheter} useName={useEnhetNameFromId} variant="enheter" />
        </TagContainer>
      </Header>
      <Editor {...savedText} />
      <DeleteTextButton id={id} />
    </Fragment>
  );
};

const Editor = (text: IText) => {
  if (text.textType === TextTypes.HEADER || text.textType === TextTypes.FOOTER) {
    return <HeaderFooterEditor key={text.id} textId={text.id} savedPlainText={text.plainText} type={text.textType} />;
  }

  return <RichTextEditor key={text.id} textId={text.id} savedContent={text.content} />;
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 16px;
  padding-bottom: 0;
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
