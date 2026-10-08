import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyButton } from '@/components/copy-button/copy-button';

interface Props {
  saksnummer: string | null;
}

export const SaksnummerHosTrygderetten = ({ saksnummer }: Props) => (
  <BehandlingSection label="Saksnummer hos Trygderetten">
    {saksnummer === null ? 'Ikke satt' : <CopyButton text={saksnummer} activeText={saksnummer} size="small" />}
  </BehandlingSection>
);
