const getId = (args) => {
  const idRegex = /id=([^&]+)/;
  const match = args[0].url.match(idRegex);
  const id = match ? match[1] : null;
  return id;
};

export default getId;
