import {
  Autocomplete,
  DialogActions,
  MenuItem,
  Radio,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Api } from "../../Utilities/api";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { filterData } from "../../Utilities/filterData";
import { Form, Spinner } from "react-bootstrap";
import CustomAutoCompleteRadio from "../../Utilities/CustomAutoCompleteRadio";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";
import { Loader } from "../../Utilities/Loader";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import testapi from "../../../api/testapi.json";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
const Forms = (props: any) => {
  const [formData, setFormData] = useState<any>(props.feilds);
  const storeData = useAppSelector(selectCommonConfig);
  const menuListCapabilities =
    storeData.loginDetails.capabilities.LaunchStack[0];
  const [finalFormData, setFinalFormData] = useState<any>();
  const [showValidation, setShowValidation] = useState<any>(
    props.showValidation
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showTextField, setShowTextField] = useState(false);
  const [textFieldData, setTextFieldData] = useState<any>("");
  const location = useLocation();
  const pathname = location.pathname;
  const [Awsdropdowndata, setAwsdropdowndata] = useState<any>([]);
  const [dns, setDns] = useState([]);
  const [sharedLevel, setSharedLevel] = useState("");
  const [lowValError, setLowValError] = useState(false);
  const params = useParams();
  const dispatch = useAppDispatch();
  const [param, setParam] = useState(params);
  const [isLoading, setIsLoading] = useState(false);
  const [TotalVmCost, setTotalVmCost] = useState("");
  const [NatIpName, setNatIpName] = useState<any>([]);
  const [isSpinLoad, setSpinLoad] = useState(false);
  const [vpcDetails, setVpcDetails] = useState([]);
  const [passDBdetails, setpassDBdetails] = useState([]);
  const excludedKeys = ["OrganizationId", "SecurityAccountId", "IamRoleStack"];
  useEffect(() => {
    props.handleFormData(props.activeKey, formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);
  useEffect(() => {
    // execute on location change
    setParam(params);
  }, [params]);
  useEffect(() => {
    setFormData(props.feilds);
    setFinalFormData(props.feilds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  useEffect(() => {
    setFormData(props.feilds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let tempApiData: any = {};
  formData?.forEach((curr: any, index: number) => {
    tempApiData[curr.name] = curr.value;
  });

  const instanceNames = storeData?.awsVmData.map((instance) => instance.Name);

  const clusterName = storeData?.Cluster?.map((ele) => ele.Name);
  const clusterPoolName = storeData?.Cluster?.flatMap((cluster) =>
    cluster.NodePoolInfo?.map((node) => node.NodePoolNames)
  );

  const handleFormChange = (index, event, name, inputType) => {
    if (!menuListCapabilities[params.Cloud].includes("Update")) {
      return;
    }
    let data: any = [...formData];
    data.forEach((ele) => {
      ele.errordescription = "";
    });
    if (name === "Virtual_Network") {
      data.forEach((ele, index) => {
        if (ele.name === "Subnet") {
          data[index].inputType = "text";
        }
      });
    }
    if (name === "Network_Interface") {
      data.forEach((ele, index) => {
        if (ele.name === "Public_ip" || ele.name === "Dns") {
          data[index].inputType = "text";
        }
      });
    }
    if (name === "Availability_Zone1") {
      data.forEach((ele, index) => {
        if (ele.name === "DB_Subnet_Group") {
          data[index].inputType = "text";
        }
      });
    }

    if (
      instanceNames?.includes(event?.target?.value) &&
      (name === "name" || name === "Identifier" || name === "Name")
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (
            ele.name === "name" ||
            ele.name === "Identifier" ||
            ele.name === "Name"
          ) {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      storeData?.GcpNetwork?.includes(event?.target?.value) &&
      name === "NetworkName"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "NetworkName") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      NatIpName?.includes(event?.target?.value) &&
      name === "NATIPName"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "NATIPName") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      storeData?.AwsPassDb?.[0]?.DBname?.includes(event?.target?.value) &&
      name === "Identifier"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "Identifier") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      storeData?.GcpDbName?.includes(event?.target?.value) &&
      name === "DBInstanceName"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "DBInstanceName") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      clusterName?.includes(event?.target?.value) &&
      name === "Cluster_Name"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "Cluster_Name") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      storeData?.GcpVm?.includes(event?.target?.value) &&
      name === "VirtualMachineName"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "VirtualMachineName") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      storeData?.GcpCluster?.includes(event?.target?.value) &&
      name === "ClusterName"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "ClusterName") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      clusterPoolName?.includes(event?.target?.value) &&
      name === "Clusternode_Pool_Name"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "Clusternode_Pool_Name") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else if (
      storeData?.AzureVmlist?.includes(event?.target?.value) &&
      name === "Virtual_Machine_Name"
    ) {
      setSpinLoad(true);
      setTimeout(() => {
        data.forEach((ele, index) => {
          if (ele.name === "Virtual_Machine_Name") {
            data[index].errordescription = "Name already exists";
          }
        });
        setSpinLoad(false);
      }, 1000);
    } else {
      data.forEach((ele, index) => {
        if (
          ele.name === "name" ||
          ele.name === "Identifier" ||
          ele.name === "Name" ||
          ele.name === "Virtual_Machine_Name" ||
          ele.name === "Clusternode_Pool_Name" ||
          (ele.name === "Cluster_Name" && name === "ClusterName") ||
          ele.name === "VirtualMachineName" ||
          ele.name === "ClusterName" ||
          (ele.name === "NetworkName" && name === "NetworkName") ||
          ele.name === "DBInstanceName" ||
          (ele.name === "NATIPName" && name === "NATIPName")
        ) {
          if (event.target.value === "") {
            data[index].errordescription = "";
          } else {
            data[index].errordescription = "Available";
          }
        }
      });
    }
    inputType === "number"
      ? (data[index].value = parseInt(event.target.value))
      : (data[index].value = event.target.value);
    setFormData(data);
  };
  const handleFormData = (event) => {
    event.preventDefault();
    props.handleFormData(props.activeKey, formData);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setShowValidation(true);
    props.handleFormData(props.activeKey, formData);
    props.submitFormData();
  };

  const handleNextData = (event) => {
    event.preventDefault();
    // console.log(tempApiData.,"my test")

    if (
      Object.entries(tempApiData).some(
        ([key, value]) => !excludedKeys.includes(key) && value === ""
      )
    ) {
      props.setModalMessage("Please fill all the fields");
      props.setShowModal(true);
    } else {
      handlestagsTabChange(event);
    }
    handleFormData(event);
    setShowValidation(true);
    let subformdata = [...formData];
    formData.forEach((element, index) => {
      if (element.name === "SubscriptionID") {
        subformdata[index].value = element?.value.split("|")[1].trim();
      }
      if (
        element.name === "instance_type" ||
        element.name === "InstanceType" ||
        element.name === "ami" ||
        element.name === "AMI" ||
        element.name === "vpc_id" ||
        element.name === "VPC_ID" ||
        element.name === "subnet_id" ||
        element.name === "Subnet"
      ) {
        subformdata[index].value = element?.value.split("|")[0].trim();
      }
    });
    setFormData(subformdata);
  };
  const handlestagsTabChange = (event) => {
    event.preventDefault();
    if (props.activeKey === "stackDetails") {
      props.handleTabChange("stackTags");
    }
    if (props.activeKey === "stackTags") {
      props.handleTabChange("stackDetails");
    }
  };

  const getData = (propertyName: string, name: string) => {
    // Check if dropdownsApiData has the property
    if (
      !storeData?.dropdownsApiData ||
      !storeData?.dropdownsApiData.hasOwnProperty(propertyName)
    ) {
      return []; // Return empty array if property doesn't exist
    }
    const items = storeData?.dropdownsApiData[propertyName];
    // Check if the property value is an array
    if (!Array.isArray(items)) {
      console.error(
        `Error: "${propertyName}" in dropdownsApiData is not an array`
      );
      return []; // Return empty array for error handling
    }
    const names = [];
    for (const item of items) {
      names.push(item[name]);
    }
    return names;
  };
  const buNames = getData("BU", "BUName");
  const appNames = getData("Application", "AppName");
  const costNames = getData("costCode", "CostCode");
  const userNames = getData("users", "FullName");
  const dropdownsObject = {
    BU: Object.keys(filterData("BUName", storeData?.dropdownsApiData["BU"])),
    Application: Object.keys(
      filterData("AppName", storeData?.dropdownsApiData["Application"])
    ),
    project: Object.keys(
      filterData("ProjectName", storeData?.dropdownsApiData["project"])
    ),
  };
  const toggleSharedResources = (index) => {
    props.setShowSharedResources(!props.showSharedResources);
    setSharedLevel("");
    setShowTextField(false);
    const temptoggle = formData[index];
    temptoggle.value = "";
    formData[index] = temptoggle;
  };
  const handleSharedLevel = (index, newValue) => {
    setSharedLevel(newValue);
    setIsPopupOpen(true);
    setAllocationPercentages({});
    setSelectedResources({});
    setErrorMessage(null);
    newValue === null ? setShowTextField(false) : setShowTextField(true);
  };
  useEffect(() => {
    let tempformdata = [...formData];
    formData.forEach((element, index) => {
      if (element.name === "Location" && param.Cloud === "Azure") {
        tempformdata[index].source = storeData.AzureLocation;
      }
      if (element.name === "Container") {
        tempformdata[index].source = storeData?.Container;
      }
      // check from ani
      // if (element.name === "AvailabilityZone") {
      //   tempformdata[index].source = [
      //     "ap-northeast-1a",
      //     "ap-northeast-1c",
      //     "ap-northeast-1d",
      //   ];
      // }
      else if (element.name === "Size" && param.Cloud === "Azure") {
        tempformdata[index].source = storeData?.AzureSize;
      }
    });
    setFormData(tempformdata);
  }, [finalFormData, storeData]);
  // console.log(storeData,"store")
  //tag integration
  let subscriptionIds;
  useEffect(() => {
    const subData = storeData?.dropdownsApiData?.mastersubscriptions?.filter(
      (item: any) => param?.Cloud.toLowerCase() === item?.Cloud.toLowerCase()
    );

    subscriptionIds = subData?.map((ele: any) => {
      return `${ele?.SubscriptionName} | ${ele?.SubscriptionID}`;
    });
  }, [storeData?.dropdownsApiData?.mastersubscriptions, finalFormData]);

  useEffect(() => {
    let gcpformdata = [...formData];
    formData.forEach((gcpelement, gcpindex) => {
      if (gcpelement.name === "Region" || gcpelement.name === "region") {
        gcpformdata[gcpindex].source = storeData.GcpRegion;
      } else if (gcpelement.name === "Image") {
        gcpformdata[gcpindex].source = storeData.GcpImage;
      } else if (gcpelement.name === "NATGKEAddressType") {
        gcpformdata[gcpindex].source = ["EXTERNAL"];
      } else if (gcpelement.name === "DiskType") {
        gcpformdata[gcpindex].source = [
          "PD_SSD",
          "HDD",
          "PD-Balanced",
          "PD-Extreme",
        ];
      } else if (gcpelement.name === "NATGKENetworkTier") {
        gcpformdata[gcpindex].source = ["STANDARD", "PREMIUM"];
      }
    });
    setFormData(gcpformdata);
  }, [finalFormData, storeData]);

  useEffect(() => {
    let tagformdata = [...formData];
    formData.forEach((tagelement, tagindex) => {
      if (tagelement.name === "Application") {
        tagformdata[tagindex].source = appNames;
      } else if (tagelement.name === "BU") {
        tagformdata[tagindex].source = buNames;
      } else if (tagelement.name === "CostCenter") {
        tagformdata[tagindex].source = costNames;
      } else if (tagelement.name === "Owner") {
        tagformdata[tagindex].source = userNames;
      } else if (tagelement.name === "SubscriptionID") {
        tagformdata[tagindex].source = subscriptionIds;
      }
    });
    setFormData(tagformdata);
  }, [storeData, finalFormData, subscriptionIds]);
  useEffect(() => {
    setShowValidation(false);
    props.setShowSharedResources(false);
    setTotalVmCost("");
  }, [param]);
  useEffect(() => {
    let tempformdata = [...formData];
    formData.forEach((element, awsindex) => {
      if (
        (element.name === "region" || element.name === "Region") &&
        param.Cloud === "AWS"
      ) {
        tempformdata[awsindex].source = Object.keys(storeData?.AwsRegion);
        // storeData?.AwsDropdowndata?.[0]?.Regions;
      }
      // else if (
      //   element.name === "instance_type" ||
      //   element.name === "InstanceType"
      // ) {
      //   tempformdata[awsindex].source = storeData?.AwsSize;
      // }
      // else if (element.name === "ami" || element.name === "AMI") {
      //   tempformdata[awsindex].source = storeData?.AwsDropdowndata?.[7]?.AMIs;
      // }
      // else if (
      //   (element.name === "subnet_id" || element.name === "Subnet") &&
      //   param.Cloud === "AWS"
      // ) {
      //   tempformdata[awsindex].source =
      //     storeData?.AwsDropdowndata?.[2]?.Subnets;
      // }
      // else if (element.name === "key_name" || element.name === "KeyName") {
      //   tempformdata[awsindex].source =
      //     storeData?.AwsDropdowndata?.[1]?.keypairname;
      // }
      else if (
        element.name === "volume_type" ||
        element.name === "VolumeType"
      ) {
        tempformdata[awsindex].source = ["gp2", "gp3", "io2", "io1"];
      }
      //  else if (element.name === "vpc_id" || element.name === "VPC_ID") {
      //   tempformdata[awsindex].source = storeData?.AwsDropdowndata?.[5]?.Vpc;
      // }
      else if (element.name === "Size" && param.Cloud === "AWS") {
        tempformdata[awsindex].source = storeData?.AwsSize;
      }
      //  else if (element.name === "Engine") {
      //   tempformdata[awsindex].source = storeData?.AwsPassDb?.[3]?.db_engine;
      // }
      // else if (element.name === "Engine_Version") {
      //   tempformdata[awsindex].source =
      //     storeData?.AwsPassDb?.[6]?.EngineVersion;
      // }

      // else if (element.name === "Instance_Class") {
      //   tempformdata[awsindex].source = storeData?.AwsPassDb?.[1]?.dbtype;
      // } else if (element.name === "Storage_Type") {
      //   tempformdata[awsindex].source = storeData?.AwsPassDb?.[5]?.StorageType;
      // }
      // else if (element.name === "DB_Subnet_Group") {
      //   tempformdata[awsindex].source =
      //     storeData?.AwsPassDb?.[4]?.db_sbunet_group;
      // }
    });
    setFormData(tempformdata);
  }, [finalFormData, storeData]);
  const handleDropdownChange = (
    index,
    newValue,
    event,
    name,
    value,
    sourcedata
  ) => {
    let data = [...formData];
    name === "AvailabilityTime"
      ? (data[index].value = event.target.value)
      : (data[index].value = event);
    setFormData(data);
    if (name === "Location") {
      setIsLoading(true);
      Api.getCall(
        `https://azure-resources-list.azurewebsites.net/api/rg_httptrigger2?location=${event}&code=KN9R_MUWauAV6jtUEW3yPY4jfSseBFM78ecb-tgQTFrVAzFujScw3A%3D%3D`
      ).then((response) => {
        setIsLoading(false);

        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "ResourceGroup") {
            tempformdata[innerindex].source =
              response.data.data[0].ResourceGroups;
          }
        });
        setFormData(tempformdata);
      });
      setIsLoading(true);
      Api.getCall(
        `https://resourcegrplist.azurewebsites.net/api/publisher?location=${event}&code=oNJOMX-pHn6oFI9_bfP8xkW9A_Zv7z-c5tmmyJFZijCyAzFu1NdE3w%3D%3D`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "Publisher") {
            tempformdata[innerindex].source = response.data.data[0].Publishers;
          }
        });
        setFormData(tempformdata);
      });
      setIsLoading(true);
      Api.getCall(
        `https://location-versions.azurewebsites.net/api/azureversion_trigger?location=${event}&code=SSjP_E6ja2sN2V-cTJHUmEM1Gu8umXJ-0uu0oq7Bz4JAAzFuMYHyXg%3D%3D`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "Kubernetes_version") {
            tempformdata[innerindex].source = response?.data?.versions;
          }
        });
        setFormData(tempformdata);
      });
    }
    if (name === "ResourceGroup") {
      setIsLoading(true);
      Api.getCall(
        `https://azure-resources-list.azurewebsites.net/api/httptrigger1?resource_group=${event}&location=${tempApiData.Location}&code=_w5A3wHxUhQb9YE1vl7oDkt12yHkQeXrdoMLjuJ7sH3XAzFuIAtFrQ%3D%3D`
        // `https://resourcegrplist.azurewebsites.net/api/offer?location=${tempApiData.Location}&publisherName=${event}&code=YqgLHdJSQV7jPSgzENTcK-flQeXTCLGuxKYmGtVjYqLXAzFu1VdD2Q%3D%3D`
      ).then((response) => {
        setAwsdropdowndata(response.data.data);
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "Virtual_Network") {
            if (response.data.data[0].VirtualNetworks[0] === "NA") {
              tempformdata[innerindex].inputType = "text";
            } else {
              tempformdata[innerindex].inputType = "dropdown";
              tempformdata[innerindex].source = Object.keys(
                response.data.data[0].VirtualNetworks
              );
            }
          }
          if (element.name === "Network_Interface") {
            if (response.data.data[2].NetworkInterfaceCard[0] === "NA") {
              tempformdata[innerindex].inputType = "text";
            } else {
              tempformdata[innerindex].inputType = "dropdown";
              tempformdata[innerindex].source = Object.keys(
                response.data.data[2].NetworkInterfaceCard
              );
            }
          }

          if (element.name === "Network_Security_Group") {
            if (response.data.data[1].NetworkSecurityGroups[0] === "NA") {
              tempformdata[innerindex].inputType = "text";
            } else {
              tempformdata[innerindex].inputType = "dropdown";
              tempformdata[innerindex].source =
                response.data.data[1].NetworkSecurityGroups;
            }
          }
        });
        setFormData(tempformdata);
      });
    }
    if (name === "Publisher") {
      setIsLoading(true);
      Api.getCall(
        `https://resourcegrplist.azurewebsites.net/api/offer?location=${tempApiData.Location}&publisherName=${event}&code=YqgLHdJSQV7jPSgzENTcK-flQeXTCLGuxKYmGtVjYqLXAzFu1VdD2Q%3D%3D`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "Offer") {
            tempformdata[innerindex].source = response.data.data[0].Offers;
          }
        });
        setFormData(tempformdata);
      });
    }
    if (name === "Offer") {
      setIsLoading(true);
      Api.getCall(
        `https://resourcegrplist.azurewebsites.net/api/skus?location=${tempApiData.Location}&publisherName=${tempApiData.Publisher}&offerName=${event}&code=B2rJfD8H0KC7q09XKajERbbuU7Pgo-D4GMGCwnbv81btAzFu_2noPQ%3D%3D`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "Sku") {
            tempformdata[innerindex].source = response.data.data[0].Skus;
          }
        });
        setFormData(tempformdata);
      });
    }
    if (name === "Subnet") {
      let tempformdata = [...formData];
      formData.forEach((element, innerindex) => {
        if (element.name === "Public_ip") {
          if (Awsdropdowndata[2].NetworkInterfaceCard[0] === "NA") {
            tempformdata[innerindex].inputType = "text";
          } else if (
            Awsdropdowndata[2].NetworkInterfaceCard[
              tempApiData.Network_Interface
            ][0].Public_IP[0] === "NA"
          ) {
            tempformdata[innerindex].inputType = "text";
          } else {
            tempformdata[innerindex].inputType = "dropdown";
            tempformdata[innerindex].source = [
              Awsdropdowndata[2].NetworkInterfaceCard[
                tempApiData.Network_Interface
              ][0].Public_IP,
            ];
          }
        }
      });
      setFormData(tempformdata);
    }

    if (name === "Subnet") {
      let tempformdata = [...formData];
      formData.forEach((element, innerindex) => {
        if (element.name === "Dns") {
          if (Awsdropdowndata[2].NetworkInterfaceCard[0] === "NA") {
            tempformdata[innerindex].inputType = "text";
          } else if (
            Object.values(
              Awsdropdowndata[2].NetworkInterfaceCard[
                tempApiData.Network_Interface
              ][0].Dns === "NA"
            )
          ) {
            tempformdata[innerindex].inputType = "text";
          } else {
            tempformdata[innerindex].inputType = "dropdown";
            tempformdata[innerindex].source = Object.values(
              Awsdropdowndata[2].NetworkInterfaceCard[
                tempApiData.Network_Interface
              ][0].Dns
            );
          }
        }
      });
      setFormData(tempformdata);
    }

    if (name === "Network_Security_Group") {
      let tempformdata = [...formData];
      formData.forEach((element, subnetindex) => {
        if (element.name === "Subnet") {
          tempformdata[subnetindex].inputType = "dropdown";
          tempformdata[subnetindex].source =
            Awsdropdowndata[0].VirtualNetworks[tempApiData.Virtual_Network];
        }
      });
      setFormData(tempformdata);
    }
    if ((name === "Region" || name === "region") && param.Cloud === "GCP") {
      setIsLoading(true);
      Api.getCall(
        `https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/list_of_region_zone?region=${event}`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "Zone" || element.name === "zone") {
            tempformdata[innerindex].source = response.data[0].zones;
          }
        });
        setFormData(tempformdata);
      });
      setIsLoading(true);
      Api.getCall(
        `https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/list_of_db_tier?region=${event}`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "DBTier") {
            tempformdata[innerindex].source = response?.data[event];
          }
        });
        setFormData(tempformdata);
      });
      setIsLoading(true);
      Api.getCall(
        `https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/list_of_nat_ip_external_name?region=${event}`
      ).then((response) => {
        setIsLoading(false);
        setNatIpName(response.data.map((ele) => ele.nat_ip_name));
      });
    }
    if (name === "Zone") {
      setIsLoading(true);
      Api.getCall(
        `https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/list_of_machine_type_region_zone?region=${tempApiData.Region}&zone=${event}`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "MachineType") {
            tempformdata[innerindex].source = response?.data;
          }
        });
        setFormData(tempformdata);
      });
    }

    if (name === "Region" && param.Cloud === "GCP") {
      setIsLoading(true);
      Api.getCall(
        `https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/list_of_natname_region?region_name=${event}`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "NATName") {
            tempformdata[innerindex].source = response?.data?.map(
              (item) => item?.nat_name
            );
          }
        });
        setFormData(tempformdata);
      });
      setIsLoading(true);
      Api.getCall(
        `https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/list_of_machinetype_region?region=${event}`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "NodeConfigMachineType") {
            tempformdata[innerindex].source = Object.values(
              response.data[event]
            )[0];
          }
        });
        setFormData(tempformdata);
      });
    }
    //aws api

    if ((name === "Region" || name === "region") && param.Cloud === "AWS") {
      setIsLoading(true);
      if (
        pathname.includes("launch-stack/AWS/VMBuild") ||
        pathname.includes("launch-stack/AWS/UI_Deployment")
      ) {
        Api.getCall(
          `https://demoapi.intelligentservicedeliveryplatform.com/vm_build?region=${event}`
        ).then((response) => {
          setVpcDetails(response?.data?.data?.VPCs);
          setIsLoading(false);
          let tempformdata = [...formData];
          formData.forEach((element, innerindex) => {
            if (element.name === "ami" || element.name === "AMI") {
              tempformdata[innerindex].source = response?.data?.data?.AMIs;
            }
            if (
              element.name === "instance_type" ||
              element.name === "InstanceType"
            ) {
              tempformdata[innerindex].source =
                response?.data?.data?.InstanceTypes;
            }
            if (element.name === "key_name" || element.name === "KeyName") {
              tempformdata[innerindex].source = response?.data?.data?.KeyPairs;
            }
            if (element.name === "vpc_id" || element.name === "VPC_ID") {
              tempformdata[innerindex].source = Object.keys(
                response?.data?.data?.VPCs
              );
            }
          });
          setFormData(tempformdata);
        });
      }
      if (pathname.includes("launch-stack/AWS/PassDBMySQL")) {
        Api.getCall(
          `https://demoapi.intelligentservicedeliveryplatform.com/paasdb_engine/?region=${event}`
        ).then((response) => {
          setIsLoading(false);
          setpassDBdetails(response?.data?.data?.EngineVersions);
          let tempformdata = [...formData];
          formData.forEach((element, innerindex) => {
            if (element.name === "Engine") {
              tempformdata[innerindex].source = Object.keys(
                response.data.data.EngineVersions
              );
            }
            if (element.name === "DB_Subnet_Group") {
              if (response.data.data.DBSubnetGroups.length === 0) {
                tempformdata[innerindex].value = "";
                tempformdata[innerindex].inputType = "text";
              } else {
                tempformdata[innerindex].value = "";
                tempformdata[innerindex].inputType = "dropdown";
                tempformdata[innerindex].source =
                  response?.data?.data?.DBSubnetGroups;
              }
            }
          });
          setFormData(tempformdata);
        });
      } else {
        setIsLoading(false);
      }
    }

    if (
      (name === "Region" || name === "region") &&
      param.Cloud === "AWS" &&
      (pathname.includes("launch-stack/AWS/PassDBMySQL") ||
        pathname.includes("launch-stack/AWS/UI_Deployment"))
    ) {
      let tempformdata = [...formData];
      formData.forEach((element, innerindex) => {
        if (
          element.name === "Availability_Zone1" ||
          element.name === "AvailabilityZone"
        ) {
          tempformdata[innerindex].source = storeData?.AwsRegion[event];
        }
      });
      setFormData(tempformdata);
    }
    if (
      name === "launch_type" &&
      param.Cloud === "AWS" &&
      pathname.includes("launch-stack/AWS/AWS_Migration")
    ) {
      setIsLoading(true);
      Api.getCall(
        `https://demoapi.intelligentservicedeliveryplatform.com/mgm_serverlist/`
      ).then((response) => {
        setIsLoading(false);
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "server_list") {
            tempformdata[innerindex].source = response?.data?.data?.body;
          }
        });
        setFormData(tempformdata);
      });
    }

    if (
      name === "Availability_Zone1" &&
      param.Cloud === "AWS" &&
      pathname.includes("launch-stack/AWS/PassDBMySQL")
    ) {
      let tempformdata = [...formData];
      formData.forEach((element, innerindex) => {
        if (element.name === "Availability_Zone2") {
          tempformdata[innerindex].source = sourcedata.filter(
            (key) => key !== event
          );
        }
      });
      setFormData(tempformdata);
    }
    if (
      name === "Engine" &&
      param.Cloud === "AWS" &&
      pathname.includes("launch-stack/AWS/PassDBMySQL")
    ) {
      let tempformdata = [...formData];
      formData.forEach((element, innerindex) => {
        if (element.name === "Engine_Version") {
          tempformdata[innerindex].source = Object.values(passDBdetails[event]);
        }
      });
      setFormData(tempformdata);
    }
    if (
      name === "Engine_Version" &&
      param.Cloud === "AWS" &&
      pathname.includes("launch-stack/AWS/PassDBMySQL")
    ) {
      setIsLoading(true);
      Api.getCall(
        `https://demoapi.intelligentservicedeliveryplatform.com/paasdb_rds_types/?region=${tempApiData.Region}&engine_name=${tempApiData.Engine}&engine_version=${event}`
      ).then((response) => {
        setIsLoading(false);
        // console.log(response.data.data,"sap balwan")
        let tempformdata = [...formData];
        formData.forEach((element, innerindex) => {
          if (element.name === "Instance_Class") {
            tempformdata[innerindex].source =
              response.data.data.DBInstanceTypes;
          }
          if (element.name === "Storage_Type") {
            tempformdata[innerindex].source = response.data.data.StorageTypes;
          }
        });
        setFormData(tempformdata);
      });
    }

    if (
      (name === "volume_type" || name === "VolumeType") &&
      param.Cloud === "AWS"
    ) {
      let tempformdata = [...formData];
      formData.forEach((element, innerindex) => {
        if (element.name === "subnet_id" || element.name === "Subnet") {
          tempformdata[innerindex].source =
            vpcDetails[tempApiData.vpc_id || tempApiData.VPC_ID];
        }
      });
      setFormData(tempformdata);
    }

    // aws pricing
    if (
      (name === "InstanceType" || name === "instance_type") &&
      (pathname.includes("launch-stack/AWS/TerraformCloud") ||
        pathname.includes("launch-stack/AWS/VMBuild") ||
        pathname.includes("launch-stack/AWS/UI_Deployment"))
    ) {
      const region = tempApiData?.region || tempApiData?.Region;
      setIsLoading(true);
      Api.getCall(
        `${testapi.baseURL}/aws_pricing/?Region=${region}&Type=${event
          ?.split("|")[0]
          .trim()}&OperatingSystem=${
          tempApiData?.ami?.split("|")[1].trim() ||
          tempApiData?.AMI?.split("|")[1].trim()
        }`
      ).then((response) => {
        setIsLoading(false);
        setTotalVmCost(` $ ${Number(response?.data?.data[0].Cost).toFixed(2)}`);
      });
    }
    // azure pricing
    if (name === "Size" && param.Cloud === "Azure") {
      setIsLoading(true);
      Api.getCall(
        `https://costdetails.azurewebsites.net/api/Cost4Sizes?region=${tempApiData.Location}&size=${event}&code=v-f7i8y_XYUR2Uq_g2gCijLx_RORX-JOYeJpg7Vx7IQLAzFuKghPtQ==`
      ).then((response) => {
        setIsLoading(false);
        setTotalVmCost(
          ` $ ${(Number(Object.values(response.data)) * 720).toFixed(2)}`
        );
      });
    }
  };

  console.log(formData, "formdata");
  const [allocationPercentages, setAllocationPercentages] = useState({}); // Object to store allocation percentages
  const [errorMessage, setErrorMessage] = useState(null);
  const updateAllocation = (event, resource) => {
    const newAllocation = { ...allocationPercentages }; // Create a copy

    newAllocation[resource] = parseInt(event.target.value); // Update allocation for specific resource
    const totalAllocated: any = Object.values(newAllocation).reduce(
      (sum: number, val: number) => {
        const nonNaNValue = isNaN(val) ? 0 : val;
        return sum + nonNaNValue;
      },
      0
    );
    const remaining = 100 - totalAllocated;
    if (totalAllocated > 100) {
      setErrorMessage(
        `You are trying to surpass the maximum limit of 100% for ${resource} by ${Math.abs(
          remaining
        )}%`
      );
    } else if (totalAllocated < 100) {
      setLowValError(true);
      setErrorMessage(
        `Allocation for ${resource} less than the maximum limit of 100. Lesser by ${remaining}%`
      );
    } else {
      setLowValError(false);
      setErrorMessage(null);
    }

    setAllocationPercentages(newAllocation);
  };

  const handlePopUpSave = () => {
    let codedata;
    if (sharedLevel === "Application") {
      codedata = storeData?.dropdownsApiData?.Application.filter((code) =>
        allocationPercentages.hasOwnProperty(code.AppName)
      );
    } else if (sharedLevel === "BU") {
      codedata = storeData?.dropdownsApiData?.BU.filter((code) =>
        allocationPercentages.hasOwnProperty(code.BUName)
      );
    } else if (sharedLevel === "project") {
      codedata = storeData?.dropdownsApiData?.project.filter((code) =>
        allocationPercentages.hasOwnProperty(code.ProjectName)
      );
    }

    const getSharedCode = (appId, allocated) => {
      return `${appId}-${allocated}`;
    };
    const allAppNames = [];
    const sharedCodes = codedata?.map((code) => {
      const appName =
        sharedLevel === "Application"
          ? code.AppName
          : sharedLevel === "BU"
          ? code.BUName
          : code.ProjectName;
      const appId =
        sharedLevel === "Application"
          ? code.AppID
          : sharedLevel === "BU"
          ? code.BuID
          : code.ProjectID;
      const allocated = allocationPercentages[appName];

      allAppNames.push(appName);

      return getSharedCode(appId, allocated);
    });
    setTextFieldData(allAppNames);

    const codeprefix =
      sharedLevel === "BU" ? "B" : sharedLevel === "project" ? "P" : "A";
    const FinalCode = `${codeprefix}${sharedCodes.join("|")}`;
    let sharedFormData = [...formData];
    formData.forEach((shareele, shareindex) => {
      if (shareele.name === "SharedCost") {
        sharedFormData[shareindex].value = FinalCode;
      }
    });
    setFormData(sharedFormData);
    if (sharedCodes.length === 0) {
      setErrorMessage("Please select atleast one resource"); // change to modal
      return;
    } else if (lowValError) {
      setErrorMessage(`Allocation for less than the maximum limit of 100.`);
      return;
    } else {
      setErrorMessage(null);
      setIsPopupOpen(false);
    }
    setShowTextField(true);
  };
  const handlePopUpCancel = () => {
    setIsPopupOpen(false);
    setAllocationPercentages({});
    setSelectedResources({});
    setErrorMessage(null);
    setSharedLevel("");
  };
  const [selectedResources, setSelectedResources] = useState({}); // State to store selected resources
  const handleResourceChange = (resource) => {
    setSelectedResources({
      ...selectedResources,
      [resource]: !selectedResources[resource],
    });
  };
  const handleCancel = (event) => {
    event.preventDefault();
    let canceldata = [...formData];
    formData.forEach((element) => {
      element.value = "";
    });
    setFormData(canceldata);
    setTotalVmCost("");
  };

  return (
    <>
      {/***add "" if we instead nor applicable and add ) $ as cost */}
      {(pathname.includes("AWS/VMBuild") ||
        pathname.includes("AWS/TerraformCloud") ||
        pathname.includes("AWS/UI_Deployment") ||
        pathname.includes("/Azure/VMBuild") ||
        pathname.includes("Azure/WAMPServer") ||
        pathname.includes("Azure/MarklogicDBCluster") ||
        pathname.includes("Azure/TerraformCloud")) &&
      props.activeKey === "stackDetails" ? (
        <div className="d-flex d-inline  justify-content-end">
          {TotalVmCost === "Not Applicable" ? (
            <></>
          ) : (
            <p className=" fw-bolder mt-1 pe-1 footer_size">Cost :</p>
          )}
          <h3 className="fw-bolder pe-2 footer_size ">
            {TotalVmCost === ""
              ? "$ 0"
              : TotalVmCost === "Not Applicable"
              ? TotalVmCost
              : ` ${TotalVmCost}`}
          </h3>
          <p className=" fw-bolder mt-1 pe-5 footer_size">per month</p>
        </div>
      ) : (
        <></>
      )}
      <form
        onSubmit={handleSubmit}
        className={`row gy-2 launchStackFormSpacing gx-4 align-items-center ${
          (pathname.includes("AWS/VMBuild") ||
            pathname.includes("AWS/TerraformCloud")) &&
          props.activeKey === "stackDetails"
            ? ""
            : "pt-4"
        }`}
      >
        {formData?.map((curr: any, index: number) => {
          if (curr.name === "SharedCost") {
            return (
              <div className="ms-4 mt-5">
                <div className="d-flex d-inline footer_size">
                  <label>Shared Resources ?</label>
                  <Form.Check
                    type="switch"
                    id="sharedResources-switch"
                    checked={props.showSharedResources}
                    onChange={() => toggleSharedResources(index)}
                    className="mx-3 mb-3"
                  />
                </div>

                {props.showSharedResources && (
                  <div>
                    <label className="form-label label-width w-75">
                      <span>Select the levels of shared Resources </span>
                      <span className="text-danger">*</span>
                    </label>
                    <CustomAutoCompleteRadio
                      id="radio-autocomplete"
                      options={["BU", "Application", "project"]}
                      value={sharedLevel}
                      clearvalue={sharedLevel === ""}
                      onChange={(newValue) => {
                        handleSharedLevel(index, newValue);
                      }}
                      placeholder={"Levels of shared Resources"}
                      widthStyle={{ width: "410px" }}
                      error={
                        showValidation &&
                        (sharedLevel?.length === 0 ||
                          sharedLevel?.length === undefined)
                      }
                      PaperStyle={{ width: 410, overflow: "hidden" }}
                    />
                  </div>
                )}

                {showTextField ? (
                  <div className="py-3">
                    <label className="form-label label-width w-75">
                      <span>{sharedLevel} shared Resources are</span>
                    </label>
                    <div>
                      <TextField
                        id="filled-multiline-flexible"
                        InputProps={{
                          readOnly: true,
                        }}
                        multiline
                        value={textFieldData}
                        maxRows={4}
                        variant="standard"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {isPopupOpen && (
                  <KubernetesPopupWrapper
                    height={"430px"}
                    width={"900px"}
                    title="Select the shared Resource"
                    handleSave={handlePopUpSave}
                    handleClose={handlePopUpCancel}
                  >
                    <div className="py-3">
                      <label className="form-label label-width w-75">
                        <span>
                          Allocate {sharedLevel} shared Resources (Total: 100%)
                        </span>
                        <span className="text-danger">*</span>
                        <div>
                          {errorMessage && (
                            <span className="text-danger">{errorMessage}</span>
                          )}
                        </div>
                      </label>
                      <div className="shared-height">
                        {dropdownsObject[sharedLevel]?.map((resource) => (
                          <div
                            key={resource}
                            className="d-flex align-items-center pb-2 row"
                          >
                            <div className="col-2 ps-4">
                              <div className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  id={`${resource}-checkbox`}
                                  checked={selectedResources[resource] || false} // Default unchecked
                                  onChange={() =>
                                    handleResourceChange(resource)
                                  }
                                  className="me-2"
                                />
                                <label
                                  htmlFor={`${resource}-checkbox`}
                                  className="mb-0"
                                >
                                  {resource}:
                                </label>
                              </div>
                            </div>

                            <div className="col-8 d-flex d-inline">
                              {selectedResources[resource] && ( // Show input only if checked
                                <>
                                  <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    defaultValue={0}
                                    id={`${resource}-allocation`} // Unique ID for each input
                                    value={allocationPercentages[resource]} // Set initial value from allocationPercentages
                                    onChange={(event) =>
                                      updateAllocation(event, resource)
                                    }
                                    className="form-control launch-width h-25 allocation-input p-2"
                                  ></input>
                                  <span
                                    className="input-group-text bg-white border-0 p-0"
                                    style={{ marginLeft: "-20px" }}
                                  >
                                    %
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </KubernetesPopupWrapper>
                )}
              </div>
            );
          }
          if (curr.name === "AvailabilityTime") {
            return (
              <div
                key={index} //curr.key
                className={`col-${props.col_width} d-flex justify-content-center  mt_xxl_4 `}
              >
                <label className="form-label label-width">
                  {curr.name}
                  {"  "}

                  <span className="text-danger">*</span>
                  {/* <FormControl sx={{ mt:1, minWidth: 320  }}> */}
                  <Select
                    sx={{ height: "40%", mt: 1 }}
                    placeholder="Please select a value"
                    className={` p-0 launchfield-width  `}
                    value={curr?.value}
                    onChange={(event) => {
                      handleDropdownChange(
                        index,
                        "",
                        event,
                        curr.name,
                        curr.value,
                        curr.source
                      );
                    }}
                    error={showValidation && curr?.value?.length < 1}
                    renderValue={(selected) =>
                      selected || "Please select a value"
                    } // Custom render value
                  >
                    <MenuItem
                      key="Create New"
                      style={{ fontWeight: "bold", color: "#007bff" }}
                    >
                      <Typography variant="body2" className="create_new">
                        Create New
                      </Typography>
                    </MenuItem>
                    {curr.source?.map((item, idx) => (
                      <MenuItem key={idx} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>

                  <small className="form-text">{curr.description}</small>
                </label>
              </div>
            );
          } else if (curr.inputType === "dropdown") {
            return (
              <div
                key={index} //curr.key
                className={`col-${props.col_width} d-flex justify-content-center  mt_xxl_4 `}
              >
                <label className="form-label label-width pb-3">
                  {capitalizeFirstLetter(curr.name)}
                  {"  "}
                  <span className="text-danger">*</span>
                  <Autocomplete
                    freeSolo={curr?.name === "Owner"}
                    disablePortal
                    disableClearable={curr?.value === "" ? true : false}
                    disabled={curr?.source?.length === 0}
                    autoHighlight
                    id="autocomplete"
                    options={curr?.source?.length > 0 ? curr?.source : []}
                    sx={{ height: "32px" }}
                    value={curr?.value}
                    onChange={(event: any, newValue: string | null) => {
                      if (newValue !== null && newValue !== undefined) {
                        handleDropdownChange(
                          index,
                          event,
                          newValue,
                          curr.name,
                          curr.value,
                          curr.source
                        );
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={"Please select a value"}
                        className={`form-control p-0 form-control-sm launchfield-width pt-2 footer_size `}
                        size="medium"
                        error={showValidation && curr.value.length < 1}
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        {curr.name === "Owner" ? (
                          <></>
                        ) : (
                          <Radio checked={selected} />
                        )}

                        <span className="description_font ">{option}</span>
                      </li>
                    )}
                  />
                  <small className="form-text">{curr.description}</small>
                </label>
              </div>
            );
          } else if (curr.inputType === "multiselectdropdown") {
            return (
              <div
                key={index} //curr.key
                className={`col-${props.col_width} d-flex justify-content-center  mt_xxl_4 `}
              >
                <label className="form-label label-width pb-3">
                  {capitalizeFirstLetter(curr.name)}
                  {"  "}
                  <span className="text-danger">*</span>
                  <CustomAutoComplete
                    id="multiple-limit-tags"
                    limitTags={2}
                    disabled={curr?.source?.length === 0}
                    options={curr?.source?.length > 0 ? curr?.source : []}
                    value={curr?.value === "" ? [] : curr?.value}
                    onChange={(event: any, newValue: string | null) => {
                      if (newValue !== null && newValue !== undefined) {
                        handleDropdownChange(
                          index,
                          event,
                          newValue,
                          curr.name,
                          curr.value,
                          curr.source
                        );
                      }
                    }}
                    placeholder={"Please select a value"}
                    error={showValidation && curr.value.length < 1}
                    TextFieldSx={{ width: 320 }}
                  />
                  {/* </div> */}
                </label>
              </div>
            );
          } else if (curr.inputType === "number") {
            return (
              <div
                key={index} //curr.key
                className={`col-${props.col_width} d-flex justify-content-center  mt_xxl_4 `}
              >
                <label className="form-label label-width pb-3">
                  {capitalizeFirstLetter(curr.name)}
                  {"  "}
                  <span className="text-danger">*</span>
                  <input
                    className={`form-control form-control-sm launchfield-width mt-2 ${
                      showValidation && curr.value.length < 1
                        ? "border border-danger"
                        : ""
                    }`}
                    type={curr.inputType}
                    value={curr.value}
                    onChange={(event) =>
                      handleFormChange(index, event, curr.name, curr.inputType)
                    }
                  />
                  <small className="form-text">{curr.description}</small>
                </label>
              </div>
            );
          } else if (curr.inputType === "radio") {
            return (
              <div
                key={index}
                className={`col-${props.col_width} d-flex justify-content-center  mt_xxl_4 `}
              >
                <label className="form-label label-width pb-3">
                  {capitalizeFirstLetter(curr.name)}
                  {"  "}
                  <span className="text-danger">*</span>
                  <div className="form-check form-check-inline d-flex pt-2">
                    {" "}
                    {curr.source.map((sourceValue, i) => (
                      <div key={i} className="form-check">
                        <input
                          className="form-check-input "
                          type={curr.inputType}
                          value={sourceValue}
                          checked={sourceValue === curr.value}
                          onChange={(event) =>
                            handleFormChange(
                              index,
                              event,
                              curr.name,
                              curr.inputType
                            )
                          }
                        />
                        <label className="form-check-label pe-3">
                          {capitalizeFirstLetter(sourceValue)}
                        </label>
                      </div>
                    ))}
                  </div>
                  <small className="form-text">{curr.description}</small>
                </label>
              </div>
            );
          } else {
            return (
              <div
                className={`col-${props.col_width} d-flex justify-content-center  mt_xxl_4 `}
              >
                <label className="form-label label-width pb-3">
                  {capitalizeFirstLetter(curr.name)}
                  {"  "}
                  <span className="text-danger">
                    {curr.name === "OrganizationId" ||
                    curr.name === "SecurityAccountId" ||
                    curr.name === "IamRoleStack"
                      ? ""
                      : "*"}
                  </span>
                  <div className="d-flex d-inline align-items-center">
                    <input
                      className={`form-control form-control-sm launchfield-width mt-2 $${
                        showValidation &&
                        curr.value.length < 1 &&
                        !excludedKeys.includes(curr.name)
                          ? "border border-danger"
                          : ""
                      }`}
                      type={curr.inputType}
                      value={curr.value}
                      onChange={(event) =>
                        handleFormChange(
                          index,
                          event,
                          curr.name,
                          curr.inputType
                        )
                      }
                    />
                    <>
                      {isSpinLoad &&
                        (curr.name === "name" ||
                          curr.name === "Name" ||
                          curr.name === "Identifier" ||
                          curr.name === "Virtual_Machine_Name" ||
                          curr.name === "Clusternode_Pool_Name" ||
                          curr.name === "Cluster_Name" ||
                          curr.name === "VirtualMachineName" ||
                          curr.name === "ClusterName" ||
                          curr.name === "NetworkName" ||
                          curr.name === "DBInstanceName" ||
                          curr.name === "NATIPName") && (
                          <span className="spinner">
                            <Spinner color="primary" size="sm" />
                          </span>
                        )}
                    </>
                  </div>

                  <span
                    className={`${
                      curr.errordescription === "Available"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {curr.errordescription}
                  </span>
                  <small className="form-text">{curr.description}</small>
                </label>
              </div>
            );
          }
        })}

        <div className="d-flex justify-content-center">
          <div className="col-10 m-4">
            <DialogActions>
              <div className="d-grid col-5 mx-auto px-2 ">
                {props.activeKey === "stackDetails" ? (
                  <button
                    onClick={(event) => {
                      handleCancel(event);
                    }}
                    className="btn btn-outline-danger footer_size"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={handlestagsTabChange}
                    className="btn btn-outline-danger footer_size"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="d-grid col-5 mx-auto px-2 py-3">
                {props.activeKey === "stackDetails" ? (
                  <button
                    onClick={(e) => {
                      handleNextData(e);
                    }}
                    className="btn btn-outline-primary footer_size"
                  >
                    {"Next >"}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-outline-success footer_size"
                  >
                    Submit
                  </button>
                )}
              </div>
            </DialogActions>
          </div>
        </div>
        <Loader isLoading={isLoading} load={null} />
      </form>
    </>
  );
};
export default Forms;
