export default function transformForm(form) {
    return form
      .filter((field) => field.name !== "Name Of Stack")
      .map((field) => {
        const { name, type, value, ...rest } = field;

        if (name === "Select Cloud") {
          return { name: "Cloud", value };
        } else if (name === "SubscriptionID") {
          return {
            name,
            type: "Single Select",
            value: "",
            mandatory: true,
            source: value,
          };
        } else {
          const filteredField = { name, type, value, ...rest };
          if (type === "Text" || type === "Password") {
            delete filteredField.source;
            delete filteredField.typedropdown;
            delete filteredField.dropdownoptions;
          } else if (type === "Boolean") {
            delete filteredField.validation;
            delete filteredField.min;
            delete filteredField.max;
            delete filteredField.dropdownoptions;
            delete filteredField.typedropdown;
          } else if (type === "Number" || type === "Text Area") {
            delete filteredField.source;
            delete filteredField.validation;
            delete filteredField.dropdownoptions;
            delete filteredField.typedropdown;
          } else if (type === "Email" || type === "IP Address") {
            delete filteredField.source;
            delete filteredField.validation;
            delete filteredField.dropdownoptions;
            delete filteredField.typedropdown;
            delete filteredField.min;
            delete filteredField.max;
          } else if (type === "Dropdown") {
            filteredField.source = filteredField.dropdownoptions;
            delete filteredField.validation;
            delete filteredField.min;
            delete filteredField.max;
            delete filteredField.dropdownoptions;
            filteredField.type = filteredField.typedropdown;
            delete filteredField.typedropdown;
          }
          return filteredField;
        }
      });
  }
  