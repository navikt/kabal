import { Skeleton, VStack } from '@navikt/ds-react';
import { useKvalitetsvurderingAnkeITRAfter2027State } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/hooks';
import { KjennelsensBetydningOgLæringsverdi } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/kjennelsens-betydning-og-læringsverdi';
import { Omgjøring } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/omgjøring';
import { RettensSammensetningSection } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/rettens-sammensetning';

export const KvalitetsskjemaAnkeITRAfter2027 = () => {
  const { isLoading } = useKvalitetsvurderingAnkeITRAfter2027State();

  if (isLoading) {
    return (
      <VStack gap="space-32 space-0">
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={32} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={96} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={340} />
        </div>
      </VStack>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Omgjøring />
      <RettensSammensetningSection />
      <KjennelsensBetydningOgLæringsverdi />
    </div>
  );
};
