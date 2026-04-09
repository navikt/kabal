import { Skeleton, VStack } from '@navikt/ds-react';
import { Annet } from '@/components/kvalitetsvurdering/v2/annet';
import { BrukAvRaadgivendeLege } from '@/components/kvalitetsvurdering/v2/bruk-av-raadgivende';
import { useKvalitetsvurderingV2 } from '@/components/kvalitetsvurdering/v2/common/use-kvalitetsvurdering-v2';
import { Klageforberedelsen } from '@/components/kvalitetsvurdering/v2/klageforberedelsen';
import { Utredningen } from '@/components/kvalitetsvurdering/v2/utredningen';
import { Vedtaket } from '@/components/kvalitetsvurdering/v2/vedtaket';

export const KvalitetsskjemaV2 = () => {
  const { isLoading } = useKvalitetsvurderingV2();

  if (isLoading) {
    return (
      <VStack gap="space-32 space-0">
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={32} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={64} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={96} />
        </div>
        <div>
          <Skeleton variant="text" height={48} width="50%" />
          <Skeleton variant="rounded" height={132} />
        </div>
      </VStack>
    );
  }

  return (
    <VStack gap="space-32 space-0">
      <Klageforberedelsen />
      <Utredningen />
      <Vedtaket />
      <BrukAvRaadgivendeLege />
      <Annet />
    </VStack>
  );
};
