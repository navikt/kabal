import { Person, PersonQuery } from '@app/components/search/fnr/person';
import { Oppgaver, OppgaverQuery } from '../common/oppgaver';

interface Props {
  personQuery: PersonQuery;
  oppgaverQuery: OppgaverQuery;
  fnr: string;
}

export const FnrSearch = ({ oppgaverQuery, personQuery, fnr }: Props) => (
  <>
    <Person {...personQuery} fnr={fnr} />
    <Oppgaver {...oppgaverQuery} />
  </>
);
