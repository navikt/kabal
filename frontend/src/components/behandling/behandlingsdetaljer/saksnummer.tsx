import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyButton } from '@/components/copy-button/copy-button';

interface Props {
  saksnummer: string;
}

export const Saksnummer = ({ saksnummer }: Props) => (
  <BehandlingSection label="Saksnummer">
    <CopyButton text={saksnummer} activeText={saksnummer} size="small" />
  </BehandlingSection>
);
