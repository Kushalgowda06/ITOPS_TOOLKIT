import React, { useEffect } from 'react';
import { useForm, Controller, ValidateResult } from 'react-hook-form';
import { TextField, TextareaAutosize, FormControl, FormHelperText, InputLabel } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons";


interface FormData {
  id: any;
  OrderID: any;
  Cloud: any;
  region: any;
  resource_group_name: any;
  network_interface_name: any;
  network_security_group_name: any;
  virtual_network_name: any;
  subnet_name: any;
  vm_name: any;
  Prompt: any;
  ResourceType: any;
  GitHubLink: any;
  TFVarLocation: any;
  Catalog: any;
}

const ModularizationForm = ({ filterdData, fetchData, handleReset, setExistFormData, handleNavigation }) => {
  console.log("filterdData", filterdData)

  const defaultValues = filterdData[0] || { // Correct default values handling
    id: "",
    OrderID: "",
    Cloud: "",
    region: "",
    resource_group_name: "",
    network_interface_name: "",
    network_security_group_name: "",
    virtual_network_name: "",
    subnet_name: "",
    vm_name: "",
    Prompt: "",
    ResourceType: "",
    GitHubLink: "",
    TFVarLocation: "",
    Catalog: "",
  };

  console.log(filterdData[0] , "filterdData lllll")
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormData>({ defaultValues }); // Use calculated defaultValues


  useEffect(() => {
    if (!filterdData || filterdData.length === 0) {
      reset(defaultValues); // Use defaultValues with empty parameters
    } else {
      const clearedFilterdData = { ...filterdData[0] }; // Create a copy
      parameterFields.forEach(field => clearedFilterdData[field] = ""); // Clear parameters

      reset(clearedFilterdData); // Reset with cleared data
    }
  }, [filterdData, reset]);

  const onSubmit = (data: FormData) => {
    setExistFormData(data)
    // setResource(true)
    // fetchData()
    // alert("Form Submitted!");
    reset(); // Clear the form after submit
    // setShowCardDetails(false); // Optionally close the form

  };

  const validateRequired = (fieldName: string) => (value: string): ValidateResult => {
    return value ? true : `The ${fieldName} field is required`; // Return a string error message
  };

  const configFields = ["Cloud", "GitHubLink", "TFVarLocation"];
  const parameterFields = ["ResourceType", "resource_group_name", "location", "cluster_name", "dns_prefix", "node_pool_name", "vm_size"];


  console.log(configFields, "configFields")

  const tempParameterFields = Object.keys(filterdData[0]).filter(( curr) => { 
    if(!configFields.includes(curr) && (curr == "CatalogID"|| "OrderID")){
      return curr
    }
  })

  console.log(tempParameterFields , "tempParameterFields")

  const formStyle = {
    // maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2d2d8f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const errorStyle = {
    color: 'red',
    fontSize: '0.8em'
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="gen_form" style={formStyle}>
        <div className='row'>
          <div className=" mt-2 d-flex justify-content-end">
            {/* <div>
                            <TextField
                                type="text"
                                style={{ width: "34rem" }}
                                className="form-control "
                                value={filterdData[0]?.GitHubLink || ""}
                                // onChange={handleChange}
                                disabled
                                label="RepoLink"
                            />
                        </div> */}
            <div style={{ paddingRight: "1rem" }}>
              <span>OrderID :{filterdData[0]?.OrderID}</span>
            </div>
          </div>
          <div className='col-6'>

            <div >
              <div className=" mt-2">
                <div className="row">
                  <div className=""> {/* Parameter Area */}
                    <div className=" d-flex justify-content-between align-items-center" style={{ backgroundColor: "#2d2d8f", padding: "10px", color: "white" }}>
                      <label>Configuration Details</label>
                    </div>
                    <div className="card shadow" style={{ height: "19.98rem", borderRadius: "initial" }}>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
                        {configFields.map((key: keyof FormData) => {
                          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          return (
                            <div key={key} style={{ flex: '1 1 45%' }}> {/* Two columns */}
                              <FormControl fullWidth>
                                <div>
                                  <TextField
                                    type="text"
                                    style={{ width: "34rem" }}
                                    className="form-control "
                                    value={filterdData[0]?.[key] || ""}
                                    // onChange={handleChange}
                                    disabled
                                    label={`${label}`}
                                  />
                                </div>
                              </FormControl>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className='col-6'>
            <div >
              <div className=" mt-2">
                <div className="row">
                  <div className=""> {/* Parameter Area */}
                    <div className=" d-flex justify-content-between align-items-center" style={{ backgroundColor: "#2d2d8f", padding: "10px", color: "white" }}>
                      <label>Parameters</label>
                      {/* <FontAwesomeIcon
                                                icon={faUndoAlt}
                                                size="lg"
                                                style={{ cursor: "pointer" }}
                                                onClick={handleReset}
                                            /> */}
                    </div>
                    <div className="card shadow" style={{ height: "19.98rem", borderRadius: "initial" }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
                        {tempParameterFields.map((key: keyof FormData) => {
                          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ');
                          return (
                            <div key={key} style={{ flex: '1 1 45%' }}> {/* Two columns */}
                              <FormControl fullWidth>
                                <Controller
                                  name={key}
                                  control={control}
                                  rules={{ validate: validateRequired(label) }}
                                  render={({ field, fieldState: { error } }) => (
                                    <TextField
                                      {...field}
                                      label={label}
                                      value={filterdData[0]?.[key] || ""}
                                      error={!!error}
                                      helperText={error?.message}
                                      fullWidth
                                    />
                                  )}
                                />
                              </FormControl>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <div className="row pt-4">
            <div className="col gap-2  d-flex justify-content-end">
              <button onClick={(e) => handleNavigation('showCloudCards')} className="btn btn-outline-success btn-width font-weight-bold">Cancel</button>
              <button type="submit" className="btn btn-outline-primary btn-width font-weight-bold">Next</button>
            </div>
          </div>
        </div>
      </form>


    </>
  );
};

export default ModularizationForm;

{/* <form onSubmit={handleSubmit(onSubmit)} className="gen_form" style={formStyle}>
    <div className='row' style={{ padding: "12px 10rem 0 10rem" }}>
        {Object?.keys(defaultValues || {}).map((key: keyof FormData) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); 
            return (
                <div className='col-6 mt-4' key={key}>
                    <FormControl fullWidth>
                        {key === 'TFVarLocation' && <InputLabel id={`${key}-label`}>{label}</InputLabel>} 
                        <Controller
                            name={key}
                            control={control}
                           
                            rules={{
                                validate: validateRequired(label),
                            }}
                            render={({ field, fieldState: { error } }) => {
                                if (key === 'TFVarLocation') {
                                    return (
                                        <>
                                            <TextareaAutosize
                                                {...field}
                                                aria-labelledby={`${key}-label`} // Connect label to Textarea
                                                minRows={3}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', marginTop: "23px", borderRadius: '5px' }}
                                            />
                                            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                                        </>
                                    );
                                } else {
                                    return (
                                        <TextField
                                            {...field}
                                            label={label}
                                            error={!!error}
                                            helperText={error?.message}
                                            fullWidth
                                        />
                                    );
                                }
                            }}
                        />
                    </FormControl>
                </div>
            );
        })}
    </div>
    <div className="row pt-4">
        <div className="col d-flex justify-content-end">
            <button onClick={(e) => setShowTicketDetails(false)} className="btn btn-outline-success btn-width font-weight-bold">Back</button>
        </div>
        <div className="col d-flex justify-content-start">
            <button type="submit" className="btn btn-outline-primary btn-width font-weight-bold">Submit</button>
        </div>
    </div>
</form> */}