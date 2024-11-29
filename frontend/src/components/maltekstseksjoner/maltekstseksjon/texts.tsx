import { MaltekstseksjonPreview } from '@app/components/maltekstseksjoner/maltekstseksjon/preview';
import { TextList } from '@app/components/maltekstseksjoner/texts/text-list';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { DocPencilIcon, MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Tabs, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

enum TabsEnum {
  PREVIEW = 'PREVIEW',
  EDIT = 'EDIT',
}

export const MaltekstseksjonTexts = ({ maltekstseksjon, query }: Props) => {
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.PREVIEW);
  const textCount = maltekstseksjon.textIdList.length;
  const [previousTextCount, setPreviousTextCount] = useState(textCount);

  useEffect(() => {
    if (textCount > previousTextCount) {
      setActiveTab(TabsEnum.EDIT);
    }
    setPreviousTextCount(textCount);
  }, [previousTextCount, textCount]);

  const onChange = useCallback(
    (tabId: string) => setActiveTab(tabId === TabsEnum.EDIT ? TabsEnum.EDIT : TabsEnum.PREVIEW),
    [],
  );

  return (
    <VStack asChild gridColumn="text-list" overflow="hidden" paddingInline="0 2">
      <Tabs value={activeTab} onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab value={TabsEnum.EDIT} label="Redigering" icon={<DocPencilIcon aria-hidden />} />
          <Tabs.Tab value={TabsEnum.PREVIEW} label="Forhåndsvisning" icon={<MagnifyingGlassIcon aria-hidden />} />
        </Tabs.List>
        <StyledTabPanel value={TabsEnum.PREVIEW}>
          <MaltekstseksjonPreview maltekstseksjon={maltekstseksjon} />
        </StyledTabPanel>
        <StyledTabPanel value={TabsEnum.EDIT}>
          <TextList maltekstseksjon={maltekstseksjon} query={query} />
        </StyledTabPanel>
      </Tabs>
    </VStack>
  );
};

const StyledTabPanel = styled(Tabs.Panel)`
  display: flex;
  flex-direction: row;
  overflow-y: auto;

  &[data-state='active'] {
    flex-grow: 1;
  }
`;
