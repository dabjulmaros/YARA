export function getTime(time,created) {
  if (time) return time;

  // time code times 1000 as js dates are on miliseconds
  const date = new Date(created * 1000);

  return date.toLocaleString('en-us', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}