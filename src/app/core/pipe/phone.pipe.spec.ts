import { PhonePipe } from './phone.pipe';

describe('PhonePipe', () => {
  it('create an instance', () => {
    const pipe = new PhonePipe();
    expect(pipe).toBeTruthy();
  });

  it('should display in phone format', () => {
    const phoneNumber = '9163539491';
    const pipe = new PhonePipe();
    const result = pipe.transform(phoneNumber);
    expect(result).toBe('(916) 353-9491');
  });
});