import { CopyButton } from '@app/components/copy-button/copy-button';
import { BehandlingSection } from './behandling-section';

interface Props {
  saksnummer: string;
}

export const Saksnummer = ({ saksnummer }: Props) => (
  <BehandlingSection label="Saksnummer">
    <CopyButton text={saksnummer} activeText={saksnummer} size="small" />
  </BehandlingSection>
);
