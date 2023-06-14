
export function htmlDecode(s) {
  const text = document.createElement("text");
  text.innerHTML = s;
  text.textContent=text.textContent.replaceAll('<a','<a target="_blank"');
  return text.textContent;
}