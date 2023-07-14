
export function searchCleaner(search, method = true,isSearch=true) {
  let cleanInputField = search;
  let returnVal = "";


  if (cleanInputField.includes('reddit.com') || isSearch) {
    if (cleanInputField.includes('/r/')) cleanInputField = cleanInputField.split('/r/')[1];

    if (cleanInputField.substr(0, 2) == 'r/') cleanInputField = cleanInputField.substr(2);

    if (cleanInputField.includes('/comments/'))
      cleanInputField = cleanInputField.match(/([^/]+\/comments\/[^/]+)/)[1];

    if (cleanInputField.includes('reddit.com/'))
      cleanInputField = cleanInputField.split('reddit.com/')[1];

    if (
      window.location.pathname.includes('/scrape/') ||
      window.location.pathname == '/scrape' ||
      method
    )
      returnVal = `/scrape/${cleanInputField}`;
    else returnVal = `/r/${cleanInputField}`;
  }
  else
    returnVal = cleanInputField

  return returnVal;
}