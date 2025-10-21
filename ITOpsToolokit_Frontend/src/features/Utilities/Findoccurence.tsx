// function to fiter the cloud data.
const findOcc = (arr: any, key: any) => {
  let tempArray: any = [];
  const checkNullValues: any = (element: any) => {
    return element === null || element === "Null";
  };
  arr?.forEach((currentObject: any) => {
    // Checking if there is any object in tempArray
    // which contains the key value
    if (
      tempArray.some((val: any) => {
        return val[key] === currentObject[key];
      })
    ) {
      // If yes! then increase the occurrence by 1
      tempArray.forEach((k: any) => {
        if (k[key] === currentObject[key]) {
          k["occurrence"]++;
        }
      });
      // Check and increment the counter if tagged or untagged.
      tempArray.forEach((k: any) => {
        let objectValues = Object.values(currentObject);
        if (
          !objectValues.some(checkNullValues) &&
          k[key] === currentObject[key]
        ) {
          k["tagged"]++;
        } else if (k[key] === currentObject[key]) {
          k["untagged"]++;
        }
      });
    } else {
      // If not! Then create a new object initialize
      // it with the present iteration key's value and
      // initialize the occurrence , tagged and untagged to 1
      let a: any = {};
      a[key] = currentObject[key];
      a["occurrence"] = 0;
      // a["untagged"] = 0
      // a["tagged"] = 1

      let objectValues = Object.values(currentObject);

      a[key] === currentObject[key] && !objectValues.some(checkNullValues)
        ? (a["tagged"] = 1)
        : (a["tagged"] = 0);

      objectValues.some(checkNullValues) && a[key] === currentObject[key]
        ? (a["untagged"] = 1)
        : (a["untagged"] = 0);

      tempArray.push(a);
    }
  });
  return tempArray;
};

export default findOcc;
