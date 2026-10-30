// A date-only ISO string is parsed as UTC midnight, so it has to be formatted
// in UTC too. In a local zone west of UTC it would show the previous day.
export const formatPostDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
