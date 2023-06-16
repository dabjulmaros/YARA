export function getMe(element, targetId) {
  let ele = element;
  while (ele.parentElement != null) {
    if (ele.id == targetId) {
      return ele;
    }
    ele = ele.parentElement;
  }
}