import { useGetMaltekstseksjonQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { GOD_FORMULERING_TYPE, REGELVERK_TYPE } from '@app/types/common-text-types';
import type { TextType } from '@app/types/texts/common';
import { DocPencilIcon, ExternalLinkIcon, EyeIcon, FileSearchIcon, UploadIcon } from '@navikt/aksel-icons';
import { Button, HStack, Link, List, Loader, Modal, Tooltip } from '@navikt/ds-react';
import { useRef, useState } from 'react';
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
    <HStack align="center" gap="1" position="relative" className={className}>
      <Tooltip content={tooltip}>
        <Button
          size="xsmall"
          onClick={() => {
            if (noReferences) {
              return;
            }

            ref.current?.showModal();
          }}
          variant="tertiary-neutral"
          icon={icon}
          iconPosition="right"
          className="whitespace-nowrap"
        >
          {children}
        </Button>
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
    </HStack>
  );
};

const getTitle = (title: string) => (title.length > 0 ? title : '<Ingen tittel>');

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
      <HStack align="center" gap="05" className={selected ? 'font-bold' : 'font-normal'}>
        <Button
          onClick={onClick}
          variant="tertiary-neutral"
          size="xsmall"
          icon={selected ? <EyeIcon aria-hidden /> : <FileSearchIcon aria-hidden />}
          title={selected ? 'Forhåndsvisning åpnet' : 'Forhåndsvis'}
          disabled={selected}
        />
        {getTitle(maltekstseksjon.title)}
        <Link href={`/maltekstseksjoner/${id}`} target="_blank" className="whitespace-nowrap">
          <ExternalLinkIcon aria-hidden />
        </Link>
      </HStack>
    </List.Item>
  );
};
