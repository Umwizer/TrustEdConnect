
import {formatDate} from './formatDate';

test('formats a date as MM/DD/YYYY', () => {
  expect(formatDate(new Date(2026, 0, 15))).toBe('01/15/2026');
});