import { MaltekstseksjonReadOnly } from '@app/components/maltekstseksjoner/maltekstseksjon/read-only';
import { TextPreview } from '@app/components/maltekstseksjoner/texts/preview';
import { Table, Tabs } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  textId: string;
  draftMaltekstseksjonIdList: string[];
  publishedMaltekstseksjonIdList: string[];
  children: React.ReactNode;
}

export const Row = ({ textId, draftMaltekstseksjonIdList, publishedMaltekstseksjonIdList, children }: Props) => {
  const hasDrafts = draftMaltekstseksjonIdList.length > 0;
  const hasPublished = publishedMaltekstseksjonIdList.length > 0;
  const [open, setOpen] = useState(false);

  const content = (
    <Tabs defaultValue="preview">
      <Tabs.List>
        <Tabs.Tab value="preview" label="Forhåndsvisning" />
        {hasDrafts ? (
          <Tabs.Tab value="drafts" label={`Utkast av maltekstseksjoner (${draftMaltekstseksjonIdList.length})`} />
        ) : null}
        {hasPublished ? (
          <Tabs.Tab
            value="published"
            label={`Publiserte maltekstseksjoner (${publishedMaltekstseksjonIdList.length})`}
          />
        ) : null}
      </Tabs.List>

      <Tabs.Panel value="preview">
        <TextPreview textId={textId} />
      </Tabs.Panel>

      <Tabs.Panel value="drafts">
        <List>
          {draftMaltekstseksjonIdList.map((id) => (
            <MaltekstseksjonReadOnly key={id} id={id} textToHighlight={textId} />
          ))}
        </List>
      </Tabs.Panel>

      <Tabs.Panel value="published">
        <List>
          {publishedMaltekstseksjonIdList.map((id) => (
            <MaltekstseksjonReadOnly key={id} id={id} textToHighlight={textId} />
          ))}
        </List>
      </Tabs.Panel>
    </Tabs>
  );

  return (
    <Table.ExpandableRow content={open ? content : null} open={open} onOpenChange={setOpen}>
      {children}
    </Table.ExpandableRow>
  );
};

const List = styled.ul`
  list-style: none;
  padding: 0;
  padding-left: var(--a-spacing-4);
  margin: 0;
`;
