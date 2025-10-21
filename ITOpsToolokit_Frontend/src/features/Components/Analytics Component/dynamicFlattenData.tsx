
interface FlatData {
    [key: string]: any; // Allows for dynamic keys
  }
  
  /**
   * Dynamically flattens a JSON object or array.
   * Handles nested objects by concatenating keys (e.g., 'parent_child').
   * Handles arrays:
   * - If an array contains primitive values, they are joined into a string.
   * - If an array contains objects, it creates multiple flattened records,
   * duplicating parent-level data for each object in the array.
   *
   * @param data The JSON data (object or array) to flatten.
   * @param prefix The prefix for keys in recursive calls (internal use).
   * @param separator The separator for concatenating keys (default: '_').
   * @returns An array of flattened dictionaries (objects).
   */
  export const dynamicFlattenData = (
    data: any,
    prefix: string = "",
    separator: string = "_"
  ): FlatData[] => {
    const flattenedRows: FlatData[] = [];
  
    if (Array.isArray(data)) {
      if (data.length === 0) {
        if (prefix) {
          return [{ [prefix]: null }];
        }
        return [];
      }
  
      data.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          const nestedFlattened = dynamicFlattenData(
            item,
            `${prefix ? prefix + separator : ""}${index}`,
            separator
          );
  
          if (nestedFlattened.length > 0) {
            if (flattenedRows.length === 0) {
              flattenedRows.push(...nestedFlattened);
            } else {
              const tempCombined: FlatData[] = [];
              flattenedRows.forEach((row) => {
                nestedFlattened.forEach((nestedRow) => {
                  tempCombined.push({ ...row, ...nestedRow });
                });
              });
              flattenedRows.splice(0, flattenedRows.length, ...tempCombined);
            }
          }
        } else {
          const currentPrimitiveKey = prefix || "value";
          const valueToJoin = data
            .map((val: any) => String(val))
            .join(", ");
          
          if (flattenedRows.length === 0) {
              flattenedRows.push({ [currentPrimitiveKey]: valueToJoin });
          } else {
              flattenedRows.forEach(row => {
                  row[currentPrimitiveKey] = valueToJoin;
              });
          }
          return;
        }
      });
    } else if (typeof data === "object" && data !== null) {
      let currentObjectFlattened: FlatData = {};
      let hasNestedList = false;
  
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          const newKey = prefix ? `${prefix}${separator}${key}` : key;
  
          if (typeof value === "object" && value !== null) {
            const nestedResults = dynamicFlattenData(value, newKey, separator);
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
              hasNestedList = true;
              if (flattenedRows.length === 0) {
                flattenedRows.push(...nestedResults);
              } else {
                const tempCombined: FlatData[] = [];
                flattenedRows.forEach((row) => {
                  nestedResults.forEach((nestedRow) => {
                    tempCombined.push({ ...row, ...nestedRow });
                  });
                });
                flattenedRows.splice(0, flattenedRows.length, ...tempCombined);
              }
            } else {
              if (nestedResults.length > 0) {
                  currentObjectFlattened = { ...currentObjectFlattened, ...nestedResults[0] };
              } else {
                  currentObjectFlattened[newKey] = null;
              }
            }
          } else {
            currentObjectFlattened[newKey] = value;
          }
        }
      }
  
      if (!hasNestedList) {
          if (flattenedRows.length === 0) {
              flattenedRows.push(currentObjectFlattened);
          } else {
              flattenedRows.forEach(row => {
                  Object.assign(row, currentObjectFlattened);
              });
          }
      } else {
          flattenedRows.forEach(row => {
              Object.assign(row, currentObjectFlattened);
          });
      }
  
    } else {
      flattenedRows.push({ [prefix || "value"]: data });
    }
  
    return flattenedRows;
  };