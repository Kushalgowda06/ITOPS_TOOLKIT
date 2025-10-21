const validationRules = {
  "Uppercase Letters": "A-Z",
  "Lowercase Letters": "a-z",
  "Characters Allowed": "/.+/",
  Alphabets: "a-zA-Z",
  "Include Special Characters": "a-zA-Z0-9s!@#$%^&*()-+=.,?",
  Alphanumeric: "a-zA-Z0-9",
};

function getCombinedRegex(selectedTypes) {
  let allowedChars = "";
  let positiveLookaheads = "";

  for (const type of selectedTypes) {
    const chars = validationRules[type];
    allowedChars += chars;
    positiveLookaheads += `(?=.*[${chars}])`;
  }

  return new RegExp(`^${positiveLookaheads}[${allowedChars}]+$`, "u");
}

export const validateUserInput = (userInput, validationTypes) => {
  console.log(userInput, validationTypes, "validtest");
  const combinedRegex = getCombinedRegex(validationTypes);
  console.log(validationTypes.length, "tester");
  if (!combinedRegex.test(userInput)) {
    return {
      isValid: false,
      message: `Please enter ${
        validationTypes.length === 1 ? "only" : ""
      }  ${validationTypes} .`,
    };
  }

  return true;
};
