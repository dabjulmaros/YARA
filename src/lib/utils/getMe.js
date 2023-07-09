export function getMe(element, targetId,includeClass=false) {
  let ele = element;
  while (ele.parentElement != null) {
    if (ele.id == targetId || (includeClass && ele.classList.contains(targetId))) {
      return ele;
    }
    ele = ele.parentElement;
  }
}