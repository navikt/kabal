import { MaltekstseksjonPreview } from '@app/components/maltekstseksjoner/maltekstseksjon/preview';
import { TextList } from '@app/components/maltekstseksjoner/texts/text-list';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { DocPencilIcon, MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Tabs, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';

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
    <VStack asChild overflow="hidden" paddingInline="0 2" className="[grid-area:text-list]">
      <Tabs value={activeTab} onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab value={TabsEnum.EDIT} label="Redigering" icon={<DocPencilIcon aria-hidden />} />
          <Tabs.Tab value={TabsEnum.PREVIEW} label="Forhåndsvisning" icon={<MagnifyingGlassIcon aria-hidden />} />
        </Tabs.List>
        <Tabs.Panel value={TabsEnum.PREVIEW} className='flex flex-row overflow-y-auto data-[state="active"]:grow'>
          <MaltekstseksjonPreview maltekstseksjon={maltekstseksjon} />
        </Tabs.Panel>
        <Tabs.Panel value={TabsEnum.EDIT} className='flex flex-row overflow-y-auto data-[state="active"]:grow'>
          <TextList maltekstseksjon={maltekstseksjon} query={query} />
        </Tabs.Panel>
      </Tabs>
    </VStack>
  );
};
