import { filterData } from "./filterData";

export const processAdvisoryData = (advisoryData) => {
  const keys = Object.keys(advisoryData).map((key) => key); // get the key names of advisoryData

  const flaggedResources = keys.flatMap((key) => {
    const innerObj = advisoryData[key];
    const resources = innerObj.FlaggedResources;
    return resources.map((resource) => {
      const updatedResource = { ...resource, ...innerObj };
      return updatedResource;
    });
  });
  const test = filterData("ResourceID", flaggedResources);

  const firstObjects = Object.values(test).map(([firstObject]) => firstObject);

  return [...firstObjects];
};
