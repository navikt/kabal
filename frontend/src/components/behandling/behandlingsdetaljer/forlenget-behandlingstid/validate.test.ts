import { describe, expect, it } from 'bun:test';
import { validateBehandlingstid } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/validate';
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import type { IForlengetBehandlingstid } from '@app/redux-api/forlenget-behandlingstid';
import { BehandlingstidUnitType } from '@app/types/svarbrev';
import { addDays, addMonths, addWeeks, format, startOfDay } from 'date-fns';

const createBehandlingstid = ({
  varsletFrist = null,
  varsletBehandlingstidUnitTypeId = WEEKS,
  varsletBehandlingstidUnits = null,
}: Partial<IForlengetBehandlingstid['behandlingstid']>): IForlengetBehandlingstid['behandlingstid'] => ({
  varsletBehandlingstidUnitTypeId,
  varsletBehandlingstidUnits,
  varsletFrist,
  calculatedFrist: null,
});

const { MONTHS, WEEKS } = BehandlingstidUnitType;

const NOW = startOfDay(new Date());

describe('validate', () => {
  describe('with no previous varslet first', () => {
    it('should return undefined if varslet frist is 4 months from now', () => {
      const varsletFrist = format(addMonths(NOW, 4), ISO_FORMAT);
      const result = validateBehandlingstid(createBehandlingstid({ varsletFrist }), null, false);

      expect(result).toBeUndefined();
    });

    it('should return error string if varslet frist is more than 4 months from now', () => {
      const varsletFrist = format(addDays(addMonths(NOW, 4), 1), ISO_FORMAT);
      const result = validateBehandlingstid(createBehandlingstid({ varsletFrist }), null, false);

      expect(result).toBe('Fristen kan ikke være mer enn fire måneder frem i tid');
    });

    it('should return undefined if added months is 4 months from now', () => {
      const result = validateBehandlingstid(
        createBehandlingstid({ varsletBehandlingstidUnits: 4, varsletBehandlingstidUnitTypeId: MONTHS }),
        null,
        false,
      );

      expect(result).toBeUndefined();
    });

    it('should return error string if added months is 5 months from now', () => {
      const result = validateBehandlingstid(
        createBehandlingstid({ varsletBehandlingstidUnits: 5, varsletBehandlingstidUnitTypeId: MONTHS }),
        null,
        false,
      );

      expect(result).toBe('Fristen kan ikke være mer enn fire måneder frem i tid');
    });

    it('should return undefined if added months is 17 weeks (just under 4 months) from now', () => {
      const result = validateBehandlingstid(createBehandlingstid({ varsletBehandlingstidUnits: 17 }), null, false);

      expect(result).toBeUndefined();
    });

    it('should return error string if added months is 18 weeks (just over 4 months) from now', () => {
      const result = validateBehandlingstid(createBehandlingstid({ varsletBehandlingstidUnits: 18 }), null, false);

      expect(result).toBe('Fristen kan ikke være mer enn fire måneder frem i tid');
    });

    it('shoud not return error when units/varsletFrist is not yet set', () => {
      const result = validateBehandlingstid(createBehandlingstid({}), null, false);

      expect(result).toBeUndefined();
    });
  });

  describe('with previous varslet first', () => {
    describe('varselTypeIsOriginal: true', () => {
      it('should not return error string if varselTypeIsOriginal is true', () => {
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 3, varsletBehandlingstidUnitTypeId: MONTHS }),
          null,
          true,
        );

        expect(result).toBeUndefined();
      });
    });

    describe('varselTypeIsOriginal: false', () => {
      const varselTypeIsOriginal = false;

      it('should return undefined if varslet frist is after prev varslet frist and max 4 months from now', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const varsletFrist = format(addMonths(NOW, 4), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletFrist }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBeUndefined();
      });

      it('should return error string if varslet frist is before prev varslet frist', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const varsletFrist = format(addMonths(NOW, 2), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletFrist }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Ny frist må være senere enn forrige varslet frist');
      });

      it('should return error string if varslet frist is equal to prev varslet frist', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const varsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletFrist }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Ny frist må være senere enn forrige varslet frist');
      });

      it('should return error string if varslet frist is after prev varslet frist, but more than 4 months from now', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const varsletFrist = format(addDays(addMonths(NOW, 4), 1), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletFrist }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Fristen kan ikke være mer enn fire måneder frem i tid');
      });

      it('should return undefined if added months is after prev varslet frist and max 4 months from now', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 4, varsletBehandlingstidUnitTypeId: MONTHS }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBeUndefined();
      });

      it('should return error string if added months is before prev varslet frist', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 2, varsletBehandlingstidUnitTypeId: MONTHS }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Ny frist må være senere enn forrige varslet frist');
      });

      it('should return error string if added months is equal to prev varslet frist', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);

        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 3, varsletBehandlingstidUnitTypeId: MONTHS }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Ny frist må være senere enn forrige varslet frist');
      });

      it('should return error string if added months is after prev varslet frist, but more than 4 months from now', () => {
        const prevVarsletFrist = format(addMonths(NOW, 3), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 5, varsletBehandlingstidUnitTypeId: MONTHS }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Fristen kan ikke være mer enn fire måneder frem i tid');
      });

      it('should return undefined if added weeks is after prev varslet frist and max 4 months from now', () => {
        const prevVarsletFrist = format(addWeeks(NOW, 3), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 17 }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBeUndefined();
      });

      it('should return error string if added weeks is before prev varslet frist', () => {
        const prevVarsletFrist = format(addWeeks(NOW, 17), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 16 }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Ny frist må være senere enn forrige varslet frist');
      });

      it('should return error string if added weeks is equal to prev varslet frist', () => {
        const prevVarsletFrist = format(addWeeks(NOW, 17), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 17 }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Ny frist må være senere enn forrige varslet frist');
      });

      it('should return error string if added weeks is after prev varslet frist, but more than 4 months from now', () => {
        const prevVarsletFrist = format(addWeeks(NOW, 17), ISO_FORMAT);
        const result = validateBehandlingstid(
          createBehandlingstid({ varsletBehandlingstidUnits: 18 }),
          prevVarsletFrist,
          varselTypeIsOriginal,
        );

        expect(result).toBe('Fristen kan ikke være mer enn fire måneder frem i tid');
      });
    });
  });
});
