
export function htmlDecode(s) {
  const text = document.createElement("text");
  text.innerHTML = s;
  return text.textContent;
}