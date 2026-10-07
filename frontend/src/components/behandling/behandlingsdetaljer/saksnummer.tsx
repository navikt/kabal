import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { CopySaksnummerButton } from '@/components/copy-button/copy-saksnummer-button';

interface Props {
  saksnummer: string;
}

export const Saksnummer = ({ saksnummer }: Props) => (
  <BehandlingSection label="Saksnummer">
    <CopySaksnummerButton saksnummer={saksnummer} className="max-w-full" />
  </BehandlingSection>
);
