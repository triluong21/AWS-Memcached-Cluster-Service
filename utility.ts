export const getUniqueId = () => {
  const utcDate: any = new Date();
  const timeZoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
  const localDate = utcDate - timeZoneOffset;
  const myDate = new Date(localDate).toISOString();
  const myId = myDate.concat(String(Math.floor(Math.random() * Math.floor(100000000))));
  return myId;
};

export const isKeyInCache = (memcached: any, inputKey: string) => {
  const returnObject = {
    returnStatus: "",
    returnData: "",
  };
  console.log("Start to get");
  memcached.get(inputKey, (err: any, data: any) => {
    console.log("Get okey 1: ", data);
    if (err) {
      returnObject.returnStatus = "NotFound";
    } else {
      console.log("Get okey 2: ", data);
      returnObject.returnStatus = "Ok";
      returnObject.returnData = data;
      console.log("Get okey Object: ", returnObject);
    }
  });
  return returnObject;
};

// module.exports.setKeyInCache = (memcached, inputKey, inputData) {
//   memcached.set()
// };
