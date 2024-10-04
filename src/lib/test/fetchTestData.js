export async function fetchTestData() {
  const params = JSON.stringify({
    url: `http://localhost:1234/`,
    over18: localStorage.over18,
  });
  const text = await electron.request(params).then((r) => {
    return r
  });
  console.log(text);
  return text;
}