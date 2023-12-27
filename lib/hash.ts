export function toAjail(text: string) {
  const result = btoa(encodeURIComponent(text));
  let hash = 0;

  for (let i = 0; i < result.length; i++) {
    hash = (hash >> 4) ^ (hash << 5) - hash + result.charCodeAt(i);
  }

  const finalHash = Math.log10(Math.abs(Math.floor(hash)));
  const decimalPart = finalHash % 1;

  const formattedResult = decimalPart.toFixed(6).substring(2);

  return formattedResult;
}
