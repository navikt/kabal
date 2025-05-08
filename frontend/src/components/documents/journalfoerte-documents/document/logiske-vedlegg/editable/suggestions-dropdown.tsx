import { merge } from '@app/functions/classes';
import { Button, type ButtonProps } from '@navikt/ds-react';
import { type HTMLAttributes, useEffect, useRef } from 'react';

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
    <li key={suggestion} ref={ref} className="w-full overflow-hidden">
      <Option
        size="xsmall"
        variant={isActive ? 'primary' : 'tertiary-neutral'}
        onMouseDown={() => onSelect(suggestion)}
      >
        <OptionText>{suggestion}</OptionText>
      </Option>
    </li>
  );
};

const Container = ({ children }: { children: React.ReactNode }) => (
  <ul className="absolute top-full right-0 left-0 z-1 m-0 max-h-50 w-fit max-w-100 list-none overflow-y-auto overflow-x-hidden rounded-medium bg-bg-default p-0 shadow-medium">
    {children}
  </ul>
);

const Option = ({ children, ...rest }: Omit<ButtonProps, 'className'>) => (
  <Button className="w-full cursor-pointer justify-start overflow-hidden" {...rest}>
    {children}
  </Button>
);

const OptionText = ({ children, className, ...rest }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={merge(className, 'block w-full overflow-hidden text-ellipsis whitespace-nowrap text-left font-normal')}
    {...rest}
  >
    {children}
  </span>
);

const NoOptionText = ({ children, className, ...rest }: HTMLAttributes<HTMLSpanElement>) => (
  <OptionText className="italic" {...rest}>
    {children}
  </OptionText>
);
