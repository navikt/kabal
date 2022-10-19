import { Warning } from '@navikt/ds-icons';
import { Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { isoDateTimeToPrettyDate } from '../../../../domain/date';
import { useKodeverkValue } from '../../../../hooks/use-kodeverk-value';
import { IKodeverkSimpleValue } from '../../../../types/kodeverk';
import { ApiQuery, IText, TemplateSections, TextMetadata } from '../../../../types/texts/texts';
import { MALTEKST_SECTION_NAMES } from '../../../smart-editor/constants';
import { SmartEditorContext } from '../../../smart-editor/context/smart-editor-context';
import { TEMPLATES } from '../../../smart-editor/templates/templates';
import { VARIANTS } from '../../../tags/resolved-tag';

interface Props extends Pick<IText, 'title' | 'modified' | 'created'> {
  limits: TextMetadata;
  query: ApiQuery | typeof skipToken;
}

export const ShowTags = ({ created, modified, title, limits, query }: Props) => {
  const { showMaltekstTags } = useContext(SmartEditorContext);

  const isGlobal = useMemo(
    () =>
      Object.values(limits)
        .filter(Array.isArray)
        .every((limit) => limit.length === 0),
    [limits]
  );

  if (!showMaltekstTags || query === skipToken) {
    return null;
  }

  const dateTime = isoDateTimeToPrettyDate(modified ?? created) ?? 'Ukjent dato';

  if (isGlobal) {
    return (
      <TagsContainer title={`${title} - ${dateTime}`}>
        <StyledTag size="small" variant="error">
          <Warning />
          <span>Global</span>
          <Warning />
        </StyledTag>
      </TagsContainer>
    );
  }

  return (
    <TagsContainer title={`${title} - ${dateTime}`}>
      <RenderTags query={query} limits={limits} type="templates" />
      <RenderTags query={query} limits={limits} type="sections" />
      <RenderTags query={query} limits={limits} type="hjemler" />
      <RenderTags query={query} limits={limits} type="ytelser" />
      <RenderTags query={query} limits={limits} type="utfall" />
      <RenderTags query={query} limits={limits} type="enheter" />
    </TagsContainer>
  );
};

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding-top: 8px;
`;

interface TagIdsProps {
  query: TextMetadata;
  limits: TextMetadata;
  type: keyof TextMetadata;
}

const RenderTags = ({ query, limits, type }: TagIdsProps) => {
  const kodeverkValues = useTextMetadataValues(type);

  if (limits[type].length === 0) {
    const TagComponent = VARIANTS[type];

    return (
      <TagComponent variant="info" size="small">
        Gjelder alle {getTypeName(type)}
      </TagComponent>
    );
  }

  if (typeof kodeverkValues === 'undefined') {
    return null;
  }

  const ids = getIds(query, limits, type);

  const tags = renderTags(
    kodeverkValues.filter((kv) => ids.includes(kv.id)),
    type
  );

  return <>{tags}</>;
};

const getTypeName = (type: keyof TextMetadata): string => {
  if (type === 'sections') {
    return 'seksjoner';
  }

  if (type === 'templates') {
    return 'maler';
  }

  return type;
};

const getIds = (query: TextMetadata, limits: TextMetadata, key: keyof TextMetadata): string[] => {
  const ids = query[key];

  return limits[key].filter((limit) => ids.some((id) => id === limit));
};

const renderTags = (tags: IKodeverkSimpleValue[], type: keyof TextMetadata) => {
  const TagComponent = VARIANTS[type];

  return tags.map(({ id, navn }) => (
    <TagComponent variant="info" size="small" key={id}>
      {navn}
    </TagComponent>
  ));
};

const useTextMetadataValues = (type: keyof TextMetadata): IKodeverkSimpleValue[] => {
  const isSections = type === 'sections';
  const isTemplates = type === 'templates';
  const isFromKodeverk = !isSections && !isTemplates;
  const kodeverkValues = useKodeverkValue(isFromKodeverk ? type : skipToken);

  return useMemo(() => {
    if (isFromKodeverk) {
      if (typeof kodeverkValues === 'undefined') {
        return [];
      }

      return kodeverkValues;
    }

    if (isSections) {
      return Object.values(TemplateSections).map((id) => ({ navn: MALTEKST_SECTION_NAMES[id], id }));
    }

    if (isTemplates) {
      return TEMPLATES.map(({ templateId, tittel }) => ({ navn: tittel, id: templateId }));
    }

    return [];
  }, [isFromKodeverk, isSections, isTemplates, kodeverkValues]);
};

const StyledTag = styled(Tag)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
