import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { GOD_FORMULERING_TYPE, REGELVERK_TYPE } from '@app/types/common-text-types';
import type { TextType } from '@app/types/texts/common';
import { DocPencilIcon, ExternalLinkIcon, EyeIcon, FileSearchIcon, UploadIcon } from '@navikt/aksel-icons';
import { Button, Link, List, Loader, Modal, Tooltip } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Preview } from './preview';

interface Props {
  textType: TextType;
  publishedMaltekstseksjonIdList: string[];
  draftMaltekstseksjonIdList: string[];
  currentMaltekstseksjonId?: string;
}

export const AllMaltekstseksjonReferences = ({
  textType,
  draftMaltekstseksjonIdList,
  publishedMaltekstseksjonIdList,
  currentMaltekstseksjonId,
}: Props) => {
  if (textType === GOD_FORMULERING_TYPE || textType === REGELVERK_TYPE) {
    return null;
  }

  const draftReferences = draftMaltekstseksjonIdList.filter((id) => id !== currentMaltekstseksjonId);
  const publishedReferences = publishedMaltekstseksjonIdList.filter((id) => id !== currentMaltekstseksjonId);

  return (
    <>
      <MaltekstseksjonReferences
        currentMaltekstseksjonId={currentMaltekstseksjonId}
        maltekstseksjonIdList={draftReferences}
        type={MaltekstseksjonType.DRAFT}
      >
        {draftReferences.length.toString(10)}
      </MaltekstseksjonReferences>
      <MaltekstseksjonReferences
        currentMaltekstseksjonId={currentMaltekstseksjonId}
        maltekstseksjonIdList={publishedReferences}
        type={MaltekstseksjonType.PUBLISHED}
      >
        {publishedReferences.length.toString(10)}
      </MaltekstseksjonReferences>
    </>
  );
};

export enum MaltekstseksjonType {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

interface MaltekstseksjonReferences {
  maltekstseksjonIdList: string[];
  currentMaltekstseksjonId?: string;
  type: MaltekstseksjonType;
  children: React.ReactNode;
  className?: string;
}

export const MaltekstseksjonReferences = ({
  maltekstseksjonIdList: references,
  currentMaltekstseksjonId,
  className,
  type,
  children,
}: MaltekstseksjonReferences) => {
  const [first] = references;
  const [previewedReference, setPreviewedReference] = useState<string | null>(first ?? null);
  const ref = useRef<HTMLDialogElement>(null);

  const noReferences = references.length === 0;

  const tooltip = `${type === MaltekstseksjonType.DRAFT ? 'Utkast' : 'Publiseringer'} av ${
    currentMaltekstseksjonId === undefined ? '' : 'andre '
  }maltekstseksjoner denne teksten er benyttet i.`;

  const heading = `${type === MaltekstseksjonType.DRAFT ? 'Utkast' : 'Publiseringer'}`;

  const icon = type === MaltekstseksjonType.DRAFT ? <DocPencilIcon aria-hidden /> : <UploadIcon aria-hidden />;

  return (
    <Container className={className}>
      <Tooltip content={tooltip}>
        <StyledButton
          size="xsmall"
          onClick={() => {
            if (noReferences) {
              return;
            }

            ref.current?.showModal();
          }}
          variant="tertiary"
          icon={icon}
          iconPosition="right"
        >
          {children}
        </StyledButton>
      </Tooltip>

      <Modal ref={ref} header={{ heading }} width={900} closeOnBackdropClick>
        <Modal.Body>
          <List>
            {references.map((maltekstseksjonId) => (
              <ListItem
                key={maltekstseksjonId}
                id={maltekstseksjonId}
                onClick={() => setPreviewedReference(maltekstseksjonId)}
                selected={maltekstseksjonId === previewedReference}
              />
            ))}
          </List>
          <Preview id={previewedReference} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

const getTitle = (title: string) => (title.length > 0 ? title : '<Ingen tittel>');

const ListItemContent = styled.div<{ $selected: boolean }>`
  font-weight: ${({ $selected }) => ($selected ? 'bold' : 'normal')};
  display: flex;
  align-items: center;
  gap: var(--a-spacing-05);
`;

interface ListItemProps {
  id: string;
  onClick: () => void;
  selected: boolean;
}

const ListItem = ({ id, onClick, selected }: ListItemProps) => {
  const { data: maltekstseksjon } = useGetMaltekstseksjonQuery(id);

  if (maltekstseksjon === undefined) {
    return <Loader title="Laster..." />;
  }

  return (
    <List.Item>
      <ListItemContent $selected={selected}>
        <Button
          onClick={onClick}
          variant="tertiary"
          size="xsmall"
          icon={selected ? <EyeIcon aria-hidden /> : <FileSearchIcon aria-hidden />}
          title={selected ? 'Forhåndsvisning åpnet' : 'Forhåndsvis'}
          disabled={selected}
        />
        {getTitle(maltekstseksjon.title)}
        <StyledLink href={`/maltekstseksjoner/${id}`} target="_blank">
          <ExternalLinkIcon aria-hidden />
        </StyledLink>
      </ListItemContent>
    </List.Item>
  );
};

const StyledButton = styled(Button)`
  white-space: nowrap;
`;

const StyledLink = styled(Link)`
  white-space: nowrap;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
`;
