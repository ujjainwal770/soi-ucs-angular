import { ConvertToLocalDatePipe } from './convert-to-local-date.pipe';

describe('ConvertToLocalDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertToLocalDatePipe();
    expect(pipe).toBeTruthy();
  });
});
