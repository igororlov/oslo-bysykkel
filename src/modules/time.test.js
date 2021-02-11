import { formatTimestampToTime } from './time'

test('Formats time on 11.02.2021 22:26:27 to 22:26:27', () => {
  expect(formatTimestampToTime(1613078787)).toBe('22:26:27');
});

test('Empty string is not accepted', () => {
  expect(() => formatTimestampToTime('')).toThrow(Error);
});

test('Timestamp must be provided', () => {
  expect(() => formatTimestampToTime()).toThrow(Error);
});
