export function getTime(time, created) {
  if (time) return time;

  // time code times 1000 as js dates are on miliseconds
  const date = new Date(created * 1000);
  const now = new Date();
  let diff = now - date;
  diff /= (1000 * 60);
  if (diff < 1)
    return "Just Now"

  if (diff < 60)
    return Math.round(diff) + ` minute${Math.round(diff)>1?'s':''} ago`;

  diff /= 60
  if (diff < 24)
    return Math.round(diff) + ` hour${Math.round(diff)>1?'s':''} ago`;

  diff /= 30.5
  if (diff < 12)
    return Math.round(diff) + ` month${Math.round(diff)>1?'s':''} ago`;

  diff /= 365;
  return Math.round(diff) + ` year${Math.round(diff)>1?'s':''} ago`;

}