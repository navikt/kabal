import React from 'react';
import { useSelector } from 'react-redux';
import { velgOppgaver } from '../../tilstand/moduler/oppgave.velgere';
import { velgMeg } from '../../tilstand/moduler/meg.velgere';
import { EtikettMedunderskriver } from '../../styled-components/Etiketter';

function MedunderskriverStatus({ id, children }: { id: any; children: any }) {
  const rader = useSelector(velgOppgaver).rader;
  const meg = useSelector(velgMeg);
  if (!rader) return null;

  const oppgaveMedunderskriver = Object.values(rader)
    .filter((o) => o.id === id)
    .map((t) => [t.id, t.medunderskriverident, t.erMedunderskriver])
    .reduce(Object.assign, {});

  if (!oppgaveMedunderskriver) {
    return children;
  }

  if (oppgaveMedunderskriver[0] && oppgaveMedunderskriver[0][1]) {
    if (oppgaveMedunderskriver[0][1] === meg.graphData.id) {
      return (
        <td data-testid={`${id}-text`}>
          <EtikettMedunderskriver>Medunderskriver</EtikettMedunderskriver>
        </td>
      );
    } else {
      return (
        <td data-testid={`${id}-text`}>
          <EtikettMedunderskriver>Sendt til medunderskriver</EtikettMedunderskriver>
        </td>
      );
    }
  } else return children;
}

export default MedunderskriverStatus;
