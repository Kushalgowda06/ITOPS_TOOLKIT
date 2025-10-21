
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";


const ConfigurationManagement = () => {
    const types = ['TYPE 1', 'TYPE 2', 'TYPE 3', 'TYPE 4', 'TYPE 5'];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const urgencyOptions = ["1 - High", "2 - Medium", "3 - Low"];
    const impactOptions = ["1 - High", "2 - Medium", "3 - Low"];


    const [assignmentGroups, setAssignmentGroups] = useState([]);
    const [assignTo, setAssignTo] = useState([]);
    const [state, setState] = useState([]);


    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { isDirty, errors },
    } = useForm({
        mode: "onChange",

    });

    const onSubmit = async (data) => {
        if (!isDirty) {
            setSubmitMessage("No changes detected.");
            setMessageType("info");
            return;
        }

        const options = {
            auth: {
                username: "ServicenowAPI",
                password: "Qwerty@123",
            },
        };



        try {
            setIsSubmitting(true);


        } catch (err) {
            console.error("Update error:", err);
            setSubmitMessage("Failed to update ticket.");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);

        }
    };


    return (
        <div className="bg-white rounded-top itsm_form shadow-lg text-dark custom-rounded me-2" >
            <div className="d-flex align-items-center justify-content-center px-3 py-2 rounded-top background istm_header_height box-shadow text-primary">
                <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold ">
                    Configuration Management
                </div>
            </div>
            <div className="bg_color">

                <div className="card_p px-3 py-3 d-flex justify-content-end">
                    Total Cost <strong className="fw-bold"> $ 200</strong>
                    {/* <p className="text-end text-primary fw-bold mb-4">Total Cost: <span className="text-dark">$200</span></hp> */}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="row px-5 g-4 mb-4">

                        <div className="row g-3">

                            <div className="col-12 col-md-12">
                                <TextField
                                    id="FullName"
                                    label="Full Name"
                                    variant="outlined"

                                    fullWidth
                                    {...register("priority", { required: "priority is required" })}
                                    error={!!errors.priority}
                                />
                            </div>


                            <div className="col-12 col-md-12">
                                <TextField
                                    id="SelectRegion"
                                    label="Select Region"
                                    variant="outlined"

                                    fullWidth
                                    {...register("priority", { required: "priority is required" })}
                                    error={!!errors.priority}
                                />
                            </div>


                            <div className="col-12 col-md-12">
                                <Controller
                                    name="assignTo"
                                    control={control}
                                    rules={{ required: "Assigned To is required" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            value={assignTo.find((item) => item.user_name === field.value) || null}
                                            options={types}
                                            getOptionLabel={(option) => option.user_name}
                                            onChange={(_, value) => field.onChange(value ? value.user_name : "")}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Type"
                                                    variant="outlined"
                                                    className="tv-autocomplete"
                                                    error={!!errors.assignTo}
                                                    helperText={errors.assignTo?.message as string}
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </div>


                            <div className="col-12 col-md-12">
                                <TextField
                                    id="EnterVPC"
                                    label="Enter VPC"
                                    variant="outlined"

                                    fullWidth
                                    {...register("priority", { required: "priority is required" })}
                                    error={!!errors.priority}
                                />
                            </div>


                            <div className="col-12 col-md-12">
                                <TextField
                                    id="EnterSubnet"
                                    label="Enter Subnet"
                                    variant="outlined"

                                    fullWidth
                                    {...register("priority", { required: "priority is required" })}
                                    error={!!errors.priority}
                                />
                            </div>


                            <div className="col-12 col-md-12">
                                <TextField
                                    id="EnableBackup"
                                    label="Enable Backup"
                                    variant="outlined"

                                    fullWidth
                                    {...register("priority", { required: "priority is required" })}
                                    error={!!errors.priority}
                                />
                            </div>
                        </div>
                    </div>




                    <div className="mt-5 pb-5 text-center">
                        <button
                            type="submit"
                            className="btn btn-primary px-5 py-2 rounded-3 shadow-sm"
                            disabled={isSubmitting || !isDirty}
                        >
                            {isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Submit
                                </>
                            ) : (
                                "Update Ticket"
                            )}
                        </button>
                    </div>
                </form>
            </div>

        </div>

    );
};

export default ConfigurationManagement;
