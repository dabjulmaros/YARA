export function getTime(time, created) {
  if (time) return time;

  // time code times 1000 as js dates are on miliseconds
  const date = new Date(created * 1000);
  const now = new Date();
  let diff = now - date;
  diff /= (1000 * 60); //minutes
  if (diff < 1)
    return "Just Now"
  
  if (diff < 60)
    return Math.floor(diff) + ` minute${Math.floor(diff)>1?'s':''} ago`;

  diff /= 60 // hours 
  if (diff < 24) 
    return Math.floor(diff) + ` hour${Math.floor(diff)>1?'s':''} ago`;

  diff /= 24 // days 
  if (diff < 31) 
      return Math.floor(diff) + ` day${Math.floor(diff)>1?'s':''} ago`; 

  diff /= 30.5 // months
  if (diff < 12)
    return Math.floor(diff) + ` month${Math.floor(diff)>1?'s':''} ago`;

  diff /= 12; //years
  return Math.floor(diff) + ` year${Math.floor(diff)>1?'s':''} ago`;

}