import { styled } from 'styled-components';
import { HISTORY_COLORS } from '@app/components/behandling/behandlingsdialog/history/common';
import { isoDateTimeToPretty } from '@app/domain/date';
import { HistoryEventTypes } from '@app/types/oppgavebehandling/response';

interface Props {
  type: HistoryEventTypes;
  color?: string;
  icon: React.FunctionComponent;
  tag: string;
  timestamp: string;
  children: React.ReactNode;
}

export const HistoryEvent = ({ type, tag, icon: Icon, color, timestamp, children }: Props) => {
  const defaultColor = HISTORY_COLORS[type];

  return (
    <Container $accent={color ?? defaultColor}>
      <Header>
        <Category style={{ backgroundColor: `var(${color ?? defaultColor})` }}>
          <Icon aria-hidden />
          {tag}
        </Category>
        <Time dateTime={timestamp}>{isoDateTimeToPretty(timestamp)}</Time>
      </Header>
      <ContentContainer>{children}</ContentContainer>
    </Container>
  );
};

const Container = styled.li<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  border-radius: var(--a-border-radius-medium);
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $accent }) => `var(${$accent})`};
  padding-bottom: var(--a-spacing-2);
  padding-right: 0;
  padding-left: 3px;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    width: var(--a-spacing-1);
    background-color: ${({ $accent }) => `var(${$accent})`};
    border-top-left-radius: var(--a-border-radius-medium);
    border-bottom-left-radius: var(--a-border-radius-medium);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--a-spacing-2);
`;

const Time = styled.time`
  font-size: var(--a-font-size-small);
  font-weight: normal;
  font-style: italic;
  line-height: 1;
  padding-top: var(--a-spacing-05);
  padding-right: 3px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-1);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
`;

const Category = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--a-spacing-1);
  padding-right: var(--a-spacing-2);
  padding-top: 0;
  padding-left: 0;
  padding-bottom: 1px;
  font-weight: normal;
  font-size: var(--a-spacing-4);
  border-bottom-right-radius: var(--a-border-radius-medium);
`;
