import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { CopyButton } from '@app/components/copy-button/copy-button';

interface Props {
  saksnummer: string;
}

export const Saksnummer = ({ saksnummer }: Props) => (
  <BehandlingSection label="Saksnummer">
    <CopyButton text={saksnummer} activeText={saksnummer} size="small" />
  </BehandlingSection>
);
