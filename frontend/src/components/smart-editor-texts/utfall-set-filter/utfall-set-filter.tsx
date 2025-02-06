import { SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { EditUtfallSet } from '@app/components/smart-editor-texts/utfall-set-filter/edit-utfall-set';
import { ReadUtfallSet } from '@app/components/smart-editor-texts/utfall-set-filter/read-utfall-set';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { isUtfall } from '@app/functions/is-utfall';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import type { UtfallEnum } from '@app/types/kodeverk';
import { PencilIcon, PlusIcon } from '@navikt/aksel-icons';
import { Box, Button, VStack } from '@navikt/ds-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  selected: string[];
  onChange: (value: string[]) => void;
}

export const UtfallSetFilter = ({ selected, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false), true);

  const _onChange = useCallback(
    (newValue: UtfallEnum[][]) => onChange(newValue.map((utfallSet) => utfallSet.join(SET_DELIMITER))),
    [onChange],
  );
  const utfallSets = useMemo(
    () => selected.map((utfallSet) => utfallSet.split(SET_DELIMITER).filter(isUtfall)),
    [selected],
  );

  return (
    <Container ref={ref}>
      <ToggleButton $open={isOpen} onClick={() => setIsOpen(!isOpen)}>
        Utfallsett ({selected.length})
      </ToggleButton>
      {isOpen ? <UtfallSets onChange={_onChange} utfallSets={utfallSets} /> : null}
    </Container>
  );
};

interface UtfallSetsProps {
  utfallSets: UtfallEnum[][];
  onChange: (utfallSets: UtfallEnum[][]) => void;
}

const NONE_INDEX = -1;

const UtfallSets = ({ utfallSets, onChange }: UtfallSetsProps) => {
  const [editingIndex, setEditingIndex] = useState(NONE_INDEX);
  const [isAddingSet, setIsAddingSet] = useState(false);

  const onAddSet = (newSet: UtfallEnum[]) => onChange([...utfallSets, newSet]);
  const toggleIsAddingSet = useCallback(() => setIsAddingSet((current) => !current), []);

  const toggleIsEditing = useCallback(
    (newIndex: number) => setEditingIndex((currentIndex) => (currentIndex === newIndex ? NONE_INDEX : newIndex)),
    [],
  );

  return (
    <VStack asChild gap="2 0" width="400px" position="absolute" left="0" style={{ top: '100%', zIndex: 100 }}>
      <Box
        background="bg-default"
        padding="2"
        shadow="medium"
        borderWidth="1"
        borderColor="border-divider"
        borderRadius="medium"
        overflow="auto"
      >
        <VStack as="ul" gap="1 0" padding="0" margin="0" style={{ listStyle: 'none' }}>
          {utfallSets.map((utfallSet, index) => (
            <StyledListItem key={utfallSet.join('-')}>
              <UtfallSet
                utfallSet={utfallSet}
                onDelete={() => onChange(utfallSets.filter((_, i) => i !== index))}
                onChange={(set) => onChange(utfallSets.map((e, i) => (i === index ? set : e)))}
                isEditing={index === editingIndex}
                toggleIsEditing={() => toggleIsEditing(index)}
              />
            </StyledListItem>
          ))}
          {isAddingSet ? (
            <AddListItem key="add-set">
              <EditUtfallSet
                title="Legg til nytt utfallsett"
                icon={<PlusIcon aria-hidden />}
                utfallSet={[]}
                onChange={onAddSet}
                onCancel={toggleIsAddingSet}
              />
            </AddListItem>
          ) : null}
        </VStack>
        {isAddingSet ? null : (
          <Button size="small" variant="secondary" onClick={toggleIsAddingSet} icon={<PlusIcon aria-hidden />}>
            Legg til nytt utfallsett
          </Button>
        )}
      </Box>
    </VStack>
  );
};

interface UtfallSetProps {
  utfallSet: UtfallEnum[];
  onChange: (utfallSet: UtfallEnum[]) => void;
  onDelete: () => void;
  isEditing: boolean;
  toggleIsEditing: () => void;
}

const UtfallSet = ({ utfallSet, onChange, onDelete, isEditing, toggleIsEditing }: UtfallSetProps) => {
  if (isEditing) {
    return (
      <EditUtfallSet
        title="Endre utfallsett"
        icon={<PencilIcon aria-hidden />}
        utfallSet={utfallSet}
        onChange={onChange}
        onCancel={toggleIsEditing}
      />
    );
  }

  return <ReadUtfallSet utfallSet={utfallSet} onDelete={onDelete} editUtfallSet={toggleIsEditing} />;
};

const Container = styled.div`
  position: relative;
`;

const BaseListItem = styled.li`
  border-radius: var(--a-border-radius-medium);
  padding: var(--a-spacing-2);
`;

const StyledListItem = styled(BaseListItem)`
  &:nth-child(odd) {
    background-color: var(--a-bg-subtle);
  }
`;

const AddListItem = styled(BaseListItem)`
  background-color: var(--a-surface-action-subtle);
`;
