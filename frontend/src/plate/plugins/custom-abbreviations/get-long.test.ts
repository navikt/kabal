import { describe, expect, it } from '@jest/globals';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { getLong } from './get-long';

describe('get long', () => {
  it('should find ftrl', () => {
    expect.assertions(1);

    const short = 'ftrl';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: 'ftrl', long: 'Folketrygdloven' });
    const actual = getLong(short, 'previous');
    ABBREVIATIONS.clear();

    expect(actual).toBe('Folketrygdloven');
  });

  it('should find and capitalise ftrl at start of line', () => {
    expect.assertions(1);

    const short = 'ftrl';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: 'ftrl', long: 'folketrygdloven' });
    const actual = getLong(short, undefined);
    ABBREVIATIONS.clear();

    expect(actual).toBe('Folketrygdloven');
  });

  it('should find and capitalise ftrl after full stop', () => {
    expect.assertions(1);

    const short = 'ftrl';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: 'ftrl', long: 'folketrygdloven' });
    const actual = getLong(short, 'previous.');
    ABBREVIATIONS.clear();

    expect(actual).toBe('Folketrygdloven');
  });

  it('should find and capitalise Ftrl', () => {
    expect.assertions(1);

    const short = 'Ftrl';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: 'ftrl', long: 'folketrygdloven' });
    const actual = getLong(short, 'previous');
    ABBREVIATIONS.clear();

    expect(actual).toBe('Folketrygdloven');
  });

  it('should find and capitalise FTRL not at start of sentence', () => {
    expect.assertions(1);

    const short = 'FTRL';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: 'ftrl', long: 'folketrygdloven' });
    const actual = getLong(short, 'previous');
    ABBREVIATIONS.clear();

    expect(actual).toBe('FOLKETRYGDLOVEN');
  });

  it('should find and capitalise FTRL at start of line', () => {
    expect.assertions(1);

    const short = 'FTRL';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: 'ftrl', long: 'folketrygdloven' });
    const actual = getLong(short, undefined);
    ABBREVIATIONS.clear();

    expect(actual).toBe('FOLKETRYGDLOVEN');
  });

  it('should find and capitalise $om at start of line', () => {
    expect.assertions(1);

    const short = '$om';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: '$om', long: 'omsorg' });
    const actual = getLong(short, undefined);
    ABBREVIATIONS.clear();

    expect(actual).toBe('Omsorg');
  });

  it('should find and manually capitalise $Om', () => {
    expect.assertions(1);

    const short = '$Om';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: '$om', long: 'omsorg' });
    const actual = getLong(short, undefined);
    ABBREVIATIONS.clear();

    expect(actual).toBe('Omsorg');
  });

  it('should not find $oM', () => {
    expect.assertions(1);

    const short = '$oM';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: '$om', long: 'omsorg' });
    const actual = getLong(short, undefined);
    ABBREVIATIONS.clear();

    expect(actual).toBeNull();
  });

  it('should not find $OM and all caps it', () => {
    expect.assertions(1);

    const short = '$OM';
    ABBREVIATIONS.addAbbreviation({ id: randomId(), short: '$om', long: 'omsorg' });
    const actual = getLong(short, undefined);
    ABBREVIATIONS.clear();

    expect(actual).toBe('OMSORG');
  });
});

const randomId = () => Math.random().toString(36).substring(2);
