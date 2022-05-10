import { Error, FileContent, Left, SelfService } from '@navikt/ds-icons';
import { Loader, TextField } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { Fragment, useCallback } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { ErrorBoundary } from '../../error-boundary/error-boundary';
import { useDebounced } from '../../hooks/use-debounce';
import { useEnhetNameFromId, useFullYtelseNameFromId, useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { useUtfallName } from '../../hooks/use-utfall-name';
import { useGetTextByIdQuery, useUpdateTextPropertyMutation } from '../../redux-api/texts';
import { NoTemplateIdEnum, TemplateIdEnum } from '../../types/smart-editor/template-enums';
import { IText, IUpdateTextPropertyParams } from '../../types/texts/texts';
import { DateTime } from '../datetime/datetime';
import { MALTEKST_SECTION_NAMES } from '../smart-editor/constants';
import { TEMPLATES } from '../smart-editor/templates/templates';
import { ResolvedTags } from '../tags/resolved-tag';
import { RichTextEditor } from './edit/rich-text';
import { ErrorComponent } from './error-component';
import { useTextQuery } from './hooks/use-text-query';
import { SavedStatus } from './saved-status';
import { KodeverkSelect, SectionSelect, TemplateSelect } from './select';
import { DeleteTextButton } from './smart-editor-texts-delete';
import { FilterDivider } from './styled-components';

export const LoadText = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching, isUninitialized, isError } = useGetTextByIdQuery(id ?? skipToken);

  if (isError) {
    return (
      <EmptyContainer data-textid={id}>
        <StyledError width={48} height={48} />
        <StyledStatusText>
          Kunne ikke laste tekst med id: <code>{id}</code>
        </StyledStatusText>
      </EmptyContainer>
    );
  }

  if (isUninitialized) {
    return (
      <EmptyContainer data-textid={id}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Left width={96} height={96} />
          <SelfService width={96} height={96} />
          <FileContent width={96} height={96} />
        </div>
        <StyledStatusText>Ingen tekst valgt</StyledStatusText>
      </EmptyContainer>
    );
  }

  if (isLoading || isFetching) {
    if (typeof data === 'undefined') {
      return (
        <Container data-textid={id}>
          <LoaderBackground>
            <Loader size="2xlarge" />
          </LoaderBackground>
        </Container>
      );
    }

    return (
      <Container data-textid={id}>
        <EditSmartEditorText key={id} {...data} />
        <LoaderBackground>
          <Loader size="2xlarge" />
        </LoaderBackground>
      </Container>
    );
  }

  if (isLoading || isFetching || typeof data === 'undefined') {
    return (
      <Container data-textid={id}>
        <LoaderBackground>
          <Loader size="2xlarge" />
        </LoaderBackground>
      </Container>
    );
  }

  return (
    <Container data-textid={id}>
      <EditSmartEditorText key={id} {...data} />
    </Container>
  );
};

type Value = IUpdateTextPropertyParams['value'];
type Key = IUpdateTextPropertyParams['key'];

const EditSmartEditorText = (savedText: IText) => {
  const [update, { isLoading, isUninitialized }] = useUpdateTextPropertyMutation({ fixedCacheKey: savedText.id });
  const query = useTextQuery();

  const { id, modified, created, hjemler, ytelser, utfall, enheter, sections, templates, content } = savedText;

  const [title, setTitle] = useDebounced(
    savedText.title,
    useCallback((value) => update({ key: 'title', value, query, id }), [query, update, id]),
    500
  );

  const immediateUpdate = useCallback(
    (value: Value, key: Key) => update({ key, value, query, id }),
    [query, update, id]
  );

  return (
    <Fragment key={id}>
      <ErrorBoundary errorComponent={() => <ErrorComponent textId={id} />}>
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
            <SectionSelect selected={sections} onChange={(value) => immediateUpdate(value, 'sections')}>
              Seksjoner
            </SectionSelect>

            <FilterDivider />

            <KodeverkSelect kodeverkKey="hjemler" selected={hjemler} onChange={immediateUpdate}>
              Hjemler
            </KodeverkSelect>
            <KodeverkSelect kodeverkKey="ytelser" selected={ytelser} onChange={immediateUpdate}>
              Ytelser
            </KodeverkSelect>
            <KodeverkSelect kodeverkKey="utfall" selected={utfall} onChange={immediateUpdate}>
              Utfall
            </KodeverkSelect>
            <KodeverkSelect kodeverkKey="enheter" selected={enheter} onChange={immediateUpdate}>
              Enheter
            </KodeverkSelect>
          </LineContainer>

          <TagContainer>
            <ResolvedTags
              ids={templates}
              useName={(tId) => TEMPLATES.find(({ templateId }) => templateId === tId)?.tittel ?? tId}
              variant="templates"
            />

            <ResolvedTags
              ids={sections}
              useName={(sectionId) => MALTEKST_SECTION_NAMES[sectionId]}
              variant="sections"
            />

            <ResolvedTags ids={hjemler} useName={useHjemmelFromId} variant="hjemler" />

            <ResolvedTags ids={ytelser} useName={useFullYtelseNameFromId} variant="ytelser" />

            <ResolvedTags ids={utfall} useName={useUtfallName} variant="utfall" />

            <ResolvedTags ids={enheter} useName={useEnhetNameFromId} variant="enheter" />
          </TagContainer>
        </Header>
        <RichTextEditor key={id} textId={id} savedContent={content} />
      </ErrorBoundary>
      <DeleteTextButton id={id} />
    </Fragment>
  );
};

const Container = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 350px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  border-radius: 4px;
`;

const EmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

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

const LoaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
  gap: 8px;
  flex-grow: 0;
`;

const StyledStatusText = styled.span`
  padding: 16px;
`;

const StyledError = styled(Error)`
  color: var(--navds-semantic-color-interaction-danger);
`;
