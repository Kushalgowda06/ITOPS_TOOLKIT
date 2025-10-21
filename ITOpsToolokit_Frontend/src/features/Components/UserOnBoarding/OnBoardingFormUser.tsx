import React from "react";
import Tile from "../Tiles/Tile";

const InputField = ({ label, name, smallText, required }) => (
  <div className="pb-3">
    <label htmlFor={name} className="form-label">
      {label} <span className="text-danger">{required ? "*" : ""}</span>
    </label>
    <input
      type="text"
      className="form-control"
      id={name}
      name={name}
      required={required}
    />
    {smallText && <small className="form-text">{smallText}</small>}
  </div>
);

const OnBoardingFormUser = ({ title, fields }) => (
  <div className="p-2">
    <Tile>
      <div className="row container p-3">
        <h3 className="pb-5">{title}</h3>
        <div className="col-md-6  px-5">
          <form>
            {fields.slice(0, fields.length / 2).map((field) => (
              <InputField key={field.name} {...field} />
            ))}
          </form>
        </div>

        <div className="col-md-6 px-5">
          <form>
            {fields.slice(fields.length / 2).map((field) => (
              <InputField key={field.name} {...field} />
            ))}
          </form>
        </div>
      </div>
    </Tile>
  </div>
);

export default OnBoardingFormUser;
