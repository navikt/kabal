import { BoxNew, HGrid, VStack, type VStackProps } from '@navikt/ds-react';

interface ElementProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ElementProps) => (
  <HGrid
    asChild
    columns="440px 882px"
    gap="space-8"
    style={{ gridTemplateRows: 'min-content 1fr', gridTemplateAreas: "'header header' 'sidebar text-list'" }}
  >
    <BoxNew as="section" borderRadius="medium" shadow="dialog" overflow="hidden" flexGrow="1" height="100%">
      {children}
    </BoxNew>
  </HGrid>
);

export const Header = ({ children }: ElementProps) => (
  <HGrid
    gap="space-8"
    paddingBlock="space-4 space-0"
    paddingInline="space-0 space-8"
    columns="1fr fit-content"
    style={{
      gridArea: 'header',
      gridTemplateAreas: `
        'title actions'
        'metadata actions'
        'filters actions'
        'tags tags'`,
    }}
  >
    {children}
  </HGrid>
);

export const SidebarContainer = (props: VStackProps) => (
  <VStack
    position="sticky"
    top="0"
    height="fit-content"
    overflow="auto"
    className="[grid-area:sidebar]"
    gap="2"
    paddingBlock="1 0"
    {...props}
  />
);

interface ListProps {
  children: React.ReactNode;
}

export const List = ({ children }: ListProps) => (
  <ul className="m-0 list-none overflow-y-auto overflow-x-hidden whitespace-nowrap p-0">{children}</ul>
);
