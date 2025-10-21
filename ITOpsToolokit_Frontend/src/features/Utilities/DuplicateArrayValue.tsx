export const checkForDuplicates = (array) => {
  const uniqueItems = new Set(array);
  if (uniqueItems.size !== array.length) {
    return true;
  }
  return false;
};
export const checkForDuplicateFieldName = (array, targetArray) => {
  // Extract values from targetArray where name is "Field Name"
  const targetValues = targetArray
    .filter((item) => item.name === "Field Name")
    .map((item) => item.value);

  // Check if any of these values exist in the name keys of the array
  const nameExists = targetValues.some((targetValue) =>
    array.some((item) => item.name === targetValue)
  );
  if (nameExists) {
    return true;
  }
  return false;
};
