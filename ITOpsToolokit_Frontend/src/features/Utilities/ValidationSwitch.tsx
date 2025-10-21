export const validationSwitch = (field, data) => {
  switch (field) {
    case "Text":
    case "Password":
      return data.every((item) => {
        switch (item.name) {
          case "Field Name":
            return item.value !== "";
          case "Field Type":
            return item.value !== "";
          case "Add Min & Max Value":
            return item.min > 0 && item.max > 0;
          case "Select Validation":
            return item.value.length > 0;
          default:
            return true;
        }
      });

    case "Boolean":
      return data.every((item) => {
        switch (item.name) {
          case "Field Name":
            return item.value !== "";
          case "Field Type":
            return item.value !== "";
          case "Add Boolean Value":
            return item.source[0] !== "" && item.source[1] !== "";
          default:
            return true;
        }
      });

    case "Number":
      return data.every((item) => {
        switch (item.name) {
          case "Field Name":
            return item.value !== "";
          case "Field Type":
            return item.value !== "";
          case "Add Min & Max Value":
            return item.min > 0 && item.max > 0;
          default:
            return true;
        }
      });

    case "Text Area":
      return data.every((item) => {
        switch (item.name) {
          case "Field Name":
            return item.value !== "";
          case "Field Type":
            return item.value !== "";
          case "Add Min & Max Value":
            return item.max > 0;
          default:
            return true;
        }
      });

    case "Dropdown":
      return data.every((item) => {
        switch (item.name) {
          case "Field Name":
            return item.value !== "";
          case "Field Type":
            return item.value !== "";
          case "Type of Dropdown":
            return item.value !== "";
          case "Dropdown Values":
            return item.value.some((ele) => ele.trim() !== "");
          default:
            return true;
        }
      });

    case "Email":
    case "IP Address":
      return data.every((item) => {
        switch (item.name) {
          case "Field Name":
            return item.value !== "";
          case "Field Type":
            return item.value !== "";
          default:
            return true;
        }
      });

    default:
      return data.every((item) => item.value !== "");
  }
};
