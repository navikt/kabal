import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyButton } from '@/components/copy-button/copy-button';

interface Props {
  saksnummer: string;
}

export const SaksnummerHosTrygderetten = ({ saksnummer }: Props) => (
  <BehandlingSection label="Saksnummer hos Trygderetten">
    <CopyButton text={saksnummer} activeText={saksnummer} size="small" />
  </BehandlingSection>
);
