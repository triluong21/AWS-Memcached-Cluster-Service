module.exports.getUniqueId = () => {
  const utcDate = new Date();
  const timeZoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
  const localDate = utcDate - timeZoneOffset;
  const myDate = new Date(localDate).toISOString();
  const myId = myDate.concat(String(Math.floor(Math.random() * Math.floor(100000000))));
  return myId;
};
