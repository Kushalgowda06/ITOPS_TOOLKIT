import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import {
  selectCommonConfig,
  setActiveUserDetails,
  setLocalStorageUsers,
  setLoginDetails,
  setUserRolesApiData,
  setUsersApiData,
} from "../CommonConfig/commonConfigSlice";
import users from "../../Utilities/users";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { setFinopsToken } from "../FinOpsPage/FinOpsDataSlice";
// import fs from './'
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import eye icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import the icons
import { useAuth } from "../../../contexts/AuthContext";
import serviceNowAxios from "../../../api/ServicenowAxios";


interface FormData {
  email: string;
  password: string;
}

function LoginPage() {
  const [enterValidCreds, setEnterValidCreds] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const location = useLocation();
  const navigate = useNavigate();
  // const getUserData: any = useApi(getUser.getUser);
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  async function loginUser(credentials) {
    console.log(credentials, "ServicenowAPI")

    var apiUser = cloudData.usersApiData.map(curr => curr).find((x) => (x.UserName === "dushyanth@cognizant.com"))

    if (!apiUser) {
      return {
        token: 'test123',
        validation: false,
      }
    }

    const result = await login(credentials.email, credentials.password);



    // const existsUser = users.find((x) => (x.userName === credentials.email && x.password === credentials.password))
    const capabilitiesAPI: any[] = cloudData.userRolesApiData.filter((curr: any) => {
      return curr.RoleName.toLowerCase() == apiUser.Roles[0][Object.keys(apiUser?.Roles[0])[0]][0].toLowerCase()
    })
    // const currentUser = credentials.email

    // const existsUser = cloudData.usersLocalStorage?.find(
    //   (x) =>
    //     x.userName === credentials.email && x.password === credentials.password
    // );
    var existsUser = false;

    // if (existsUser === undefined) {
    //   setEnterValidCreds(true);
    //   return;
    // }
    // const capabilities = await userRoles.filter((currentUser) => {
    //   return existsUser?.role == currentUser.roleName;
    // });

    const currentUser = credentials.email;


    const response = await serviceNowAxios.get(
      `https://cisicmpengineering1.service-now.com/api/now/table/sys_user?sysparm_query=user_name%3D${currentUser}&sysparm_fields=sys_id%2Cname&sysparm_limit=1`
    );

    const currentuserData = response?.data?.result || [];
    console.log("loginincidents : ", currentuserData)


    if (result.success) {
      // if (true) {

      // setLoginSuccess(true);
      // setIsLoading(false);

      // Start Netflix "Tudum" transition immediately after success
      // setTimeout(() => {
      //   setShowCinematicTransition(true);
      // }, 600);
      existsUser = true
      // Navigate after "Tudum" animation completes (2.5s total)
      setTimeout(() => {
        navigate('/home');
      }, 3100);
    } else {
      // setIsLoading(false);
      existsUser = false
      console.log("Not valid user")
      setEnterValidCreds(true);
    }

    return {
      token: "test123",
      validation: existsUser ? true : false,
      role: apiUser.Roles[0][Object.keys(apiUser?.Roles[0])[0]][0],
      capabilities: capabilitiesAPI[0]?.MenuList[0],
      roles: response.data.data,
      permission: capabilitiesAPI[0].Permissions,
      currentUser: currentUser,
      currentuserDetails: currentuserData[0]
    };
  }


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setEnterValidCreds(false); // Reset error message on submit
    console.log("onSubmit Data", data)
    const token = await loginUser(data);

    console.log(token, "token")

    if (token?.validation) {
      dispatch(setLoginDetails(token));

      // useEffect(() => {
      var projectNames = [];

      cloudData.usersApiData.map((item) => {
        if (item.UserName === token.currentUser) {
          Object.keys(item.Projects[0]).forEach((projectName) => {
            projectNames.push(projectName);
          });
        }
      });

      projectNames = [...new Set(projectNames)];

      // useEffect(() => {
      var subscriptionNames = [];
      var tempSubscriptionKeys = []; // Declare the tempSubscriptionKeys variable
      let tempDemo = {}; // Declare a temporary demo variable

      cloudData.usersApiData.forEach((item) => {
        item.Projects.forEach((project) => {
          Object.entries(project).forEach(([projectName, cloudArray]) => {
            if (projectNames.includes(projectName)) {
              (cloudArray as any[]).forEach((cloud) => {
                Object.entries(cloud).forEach(([cloudName, subscriptions]) => {
                  (subscriptions as any[]).forEach((subscription) => {
                    Object.entries(subscription).forEach(
                      ([subscriptionKey, subscriptionValue]) => {
                        subscriptionNames.push(
                          `${subscriptionKey}-${subscriptionValue}`
                        );
                        tempSubscriptionKeys.push(subscriptionValue); // Store the subscriptionValue in tempSubscriptionKeys
                        if (!tempDemo[projectName]) {
                          tempDemo[projectName] = []; // Initialize the array if it doesn't exist
                        }
                        tempDemo[projectName].push(subscriptionValue);
                      }
                    );
                  });
                });
              });
            }
          });
        });
      });

      for (let project in tempDemo) {
        tempDemo[project] = [...new Set(tempDemo[project])];
      }

      // Remove duplicates
      subscriptionNames = [...new Set(tempSubscriptionKeys)]; // Remove duplicates from subscriptionKeys

      dispatch(setActiveUserDetails({ "projects": projectNames, "subscriptionsID": subscriptionNames, "tempDemo": tempDemo }))

      // console.log(token.capabilities , 'ss')
      // console.log(Object.keys(token.capabilities) , "ss")
      // console.log(Object.keys(token.capabilities).includes('Dashboard') , "ss")
      // console.log((Object.keys(token.capabilities).includes['FinOps']) , "ss");
      // console.log((Object.keys(token.capabilities).includes['Dashboard'] )&& (Object.keys(token.capabilities).includes['FinOps']) , "ss")


      if ((Object.keys(token.capabilities).includes('Dashboard')) && (Object.keys(token.capabilities).includes('FinOps'))) {

        navigate({
          pathname: location?.pathname,
        });
      } else {
        navigate({
          pathname: "/welcome",
        });
      }
    }
  };

  // const activeUser = cloudData.loginDetails.validation
  //   ? currentUsers.loginDetails.currentUser
  //   : null;

  // const userNames = cloudData.loginDetails.validation
  //   ? cloudData.usersApiData.map((curr: any, index: number) =>
  //     curr.UserName
  //   )
  //   : null;

  const userNames = cloudData.loginDetails.validation
    ? cloudData.usersApiData.map((curr: any, index: number) => curr.UserName)
    : null;

  useEffect(() => {
    Api.getData("/users/").then((response) => {
      console.log("users", response)
      // console.log(response.map( curr => curr.UserName))
      dispatch(setUsersApiData(response));
    }
    )
    Api.getData("/roles/").then((res) => {
      dispatch(setUserRolesApiData(res))
    })

    var tokenRequestBody = {
      username: "api_user",
      password: "foodielife",
      grant_type: "",
      client_secret: "",
      client_id: "",
      scope: "",
    };

    try {
      Api.postAuthData(testapi.authtoken, tokenRequestBody).then(
        (response: any) => {
          dispatch(setFinopsToken(response?.data?.access_token));
        }
      );
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }, []);



  useEffect(() => {
    var localStoarageUsers = JSON.parse(localStorage.getItem('users'));
    // dispatch(setLocalStorageUsers(localStoarageUsers))
    if (!localStoarageUsers) {
      localStorage.setItem('users', JSON.stringify(users));
      dispatch(setLocalStorageUsers(users))
    } else {
      dispatch(setLocalStorageUsers(localStoarageUsers))
    }
  }, []);


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  return (
    <div className="login-container d-flex Itsm_bg_image align-items-center justify-content-center">
      <div className="login-content shadow-lg rounded d-flex bg-light">
        <div className="w-75 d-flex align-items-center p-4 justify-content-center">
          {/* <img src="cloud360logo.png" alt="Logo" className="h-auto w-100" /> */}
          <h2 className="text-primary fw-bold">Autonomous ITOps Toolkit</h2>
        </div>
        <div className="form-section p-4 d-flex align-items-center justify-content-center bg-light rounded">
          <form id="loginform" className="w-100" onSubmit={handleSubmit(onSubmit)}>
            <div className="pb-3">
              <TextField
                label="Email address"
                // type="email"
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                {...register("email", {
                  required: "Email is required",
                })}
              // error={!!errors.email}
              // helperText={errors.email?.message}
              />
            </div>
            <div className="pb-5">
              {/* <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" }, // Corrected minLength
                  maxLength: { value: 22, message: "Password must be at most 22 characters" } // Added maxLength
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              /> */}
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  maxLength: { value: 22, message: "Password must be at most 22 characters" }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        // aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size="sm" /> {/* Use FontAwesome icon */}
                      </IconButton>
                    </InputAdornment>
                  ),

                }}
              />

              {(errors.email == undefined && errors.password == undefined) && enterValidCreds && (
                <small id="passworderror" className="text-danger form-text">
                  Please Enter Valid Email or Password
                </small>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;