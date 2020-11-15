export const splitLogToLines = (text) => {
  let tempArray = [];
  console.log(text);
  text
    .split('  "endLine": "1"\n' + '}')
    .map((logLine) => tempArray.push(logLine.trim()));
  return tempArray.reverse();
};
