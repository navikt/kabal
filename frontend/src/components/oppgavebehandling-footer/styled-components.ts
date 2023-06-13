import styled from 'styled-components';

export const ValidationSummaryContainer = styled.article`
  margin: 0;
  margin-top: 10px;
  padding: 0;
`;

export const StyledFieldList = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 1em;
`;

export const SectionTitle = styled.h1`
  margin: 0;
  font-size: 18px;
`;

export const StyledSection = styled.section`
  margin-top: 10px;
`;

export const StyledPopup = styled.div`
  position: absolute;
  width: 400px;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
`;

export const StyledButton = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

export const StyledIconButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  padding: 16px;
`;

export const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  gap: 16px;
`;

const StyledFooter = styled.div`
  display: flex;
  position: sticky;
  bottom: 0em;
  left: 0;
  width: 100%;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 0.5em;
  padding-top: 0.5em;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  z-index: 15;
`;

export const StyledFinishedFooter = styled(StyledFooter)`
  border-top: 1px solid #06893a;
  background-color: #cde7d8;
`;

export const StyledUnfinishedNoErrorFooter = styled(StyledFooter)`
  border-top: 1px solid #368da8;
  background-color: #e0f5fb;
`;

export const StyledUnfinishedErrorFooter = styled(StyledFooter)`
  border-top: 1px solid #d47b00;
  background-color: #ffe9cc;
`;

export const StyledFinishOppgaveButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledFinishOppgaveText = styled.p`
  margin: 0 0 1em;
  white-space: normal;
`;

export const StyledFinishOppgaveBox = styled.div`
  position: fixed;
  bottom: 1em;
  border: 1px solid #0067c5;
  padding: 1em;
  background-color: #fff;
  width: 400px;
  z-index: 1;
`;
