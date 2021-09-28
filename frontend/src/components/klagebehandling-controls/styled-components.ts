import styled from 'styled-components';

const GENDER_ICON_SIZE = 40;

export const UserItem = styled.li`
  padding-right: 1em;
  margin: auto 0;
`;

export const GenderIcon = styled.div`
  border-radius: 50%;
  text-align: center;
  width: ${GENDER_ICON_SIZE}px;
  height: ${GENDER_ICON_SIZE}px;
  line-height: ${GENDER_ICON_SIZE}px;
`;

export const MaleGenderIcon = styled(GenderIcon)`
  background-color: red;
`;
export const FemaleGenderIcon = styled(GenderIcon)`
  background-color: blue;
`;
