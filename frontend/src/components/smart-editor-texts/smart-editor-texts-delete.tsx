import { Close, Delete } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDeleteTextMutation } from '../../redux-api/texts';
import { useTextNavigate } from './hooks/use-text-navigate';
import { useTextQuery } from './hooks/use-text-query';

interface Props {
  id: string;
}

export const DeleteTextButton = ({ id }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useDeleteTextMutation({ fixedCacheKey: id });

  if (isOpen) {
    return (
      <Container>
        <Button
          size="small"
          variant="secondary"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
        <ConfirmDeleleTextButton id={id} />
      </Container>
    );
  }

  return (
    <Container>
      <Button size="small" variant="danger" onClick={() => setIsOpen(true)} icon={<Delete aria-hidden />}>
        Slett
      </Button>
    </Container>
  );
};

const ConfirmDeleleTextButton = ({ id }: Props) => {
  const [deleteText, { isLoading }] = useDeleteTextMutation({ fixedCacheKey: id });
  const navigate = useTextNavigate();
  const query = useTextQuery();

  const onClick = async () => {
    await deleteText({ id, query });
    navigate();
  };

  return (
    <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<Delete aria-hidden />}>
      Slett
    </Button>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 16px;
`;
