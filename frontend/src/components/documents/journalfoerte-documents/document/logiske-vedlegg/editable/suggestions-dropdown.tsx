import { Button } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

interface BaseProps {
  onSelect: (suggestion: string) => void;
}

interface Props extends BaseProps {
  suggestions: string[];
  activeIndex: number;
  customValue: string;
}

export const Suggestions = ({ suggestions, activeIndex, onSelect, customValue }: Props) =>
  suggestions.length === 0 ? (
    <Container>
      <li>
        <Option size="xsmall" variant="tertiary-neutral">
          <NoOptionText>Bruk «{customValue}» - Ingen forslag</NoOptionText>
        </Option>
      </li>
    </Container>
  ) : (
    <Container>
      {suggestions.map((suggestion, i) => (
        <Suggestion key={suggestion} isActive={i === activeIndex} suggestion={suggestion} onSelect={onSelect} />
      ))}
    </Container>
  );

interface SuggestionProps extends BaseProps {
  suggestion: string;
  isActive: boolean;
}

const Suggestion = ({ suggestion, isActive, onSelect }: SuggestionProps) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isActive && ref.current !== null) {
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isActive]);

  return (
    <ListItem key={suggestion} ref={ref}>
      <Option
        size="xsmall"
        variant={isActive ? 'primary' : 'tertiary-neutral'}
        onMouseDown={() => onSelect(suggestion)}
      >
        <OptionText>{suggestion}</OptionText>
      </Option>
    </ListItem>
  );
};

const Container = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: fit-content;
  background-color: var(--a-bg-default);
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  padding: 0;
  margin: 0;
  list-style: none;
  z-index: 1;
  max-height: 200px;
  overflow-y: auto;
  max-width: 400px;
  overflow-x: hidden;
`;

const ListItem = styled.li`
  width: 100%;
  overflow: hidden;
`;

const Option = styled(Button)`
  width: 100%;
  justify-content: left;
  cursor: pointer;
  overflow: hidden;
`;

const OptionText = styled.span`
  display: block;
  text-align: left;
  font-weight: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const NoOptionText = styled(OptionText)`
  font-style: italic;
`;
