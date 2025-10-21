import React, { useEffect } from "react";
import useApi from "../../../customhooks/useApi";
import getSubscription from "../../../api/subscription";
import Tree from "./Tree";
import {
  CloudState,
  selectCloud,
} from "../Cloudtoggle/CloudToggleSlice";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import findOcc from "../../Utilities/Findoccurence";
import { useLocation } from "react-router-dom";

const Treeview = (props: any) => {
  const location = useLocation();
  const pathname = location.pathname;
  const cloudData = useAppSelector(selectCommonConfig);
  const currentClouds: CloudState = useAppSelector(selectCloud);
  const subscriptionData: any = useApi(getSubscription.getSubscription);
  let cloudResourceTypes,  complainceType;
  useEffect(() => {
    subscriptionData.request();
  }, []);

  const segregatedData: any = {};

  subscriptionData?.data?.data.forEach((currElem: any) => {
    if (segregatedData.hasOwnProperty(currElem.Cloud)) {
    segregatedData[currElem.Cloud].push(currElem);
    } else {
      segregatedData[currElem.Cloud] = [currElem];
    }
  });
  if(pathname.includes("tagging-policy")){
  cloudResourceTypes = findOcc(cloudData.filteredTaggingData, "SubscriptionID");
  }
  if(pathname.includes("complaince-policy")){

    const initialData = cloudData.filteredComplainceData.filter((item: any) => {
      return item.Compliance === "Non-Compliant";
    });
    let complaincedata = findOcc(initialData, "SubscriptionID");
    complainceType = complaincedata.map((item) => ({
     ...item,
      count: item.tagged + item.untagged,
    }));
    }
  if(pathname.includes("orphan-objects")){
    const initialData = cloudData.filteredOrphanData.filter((item: any) => {
      return item.ResourceStatus === "Orphaned";
    });
    let orphandata = findOcc(initialData, "SubscriptionID");
    cloudResourceTypes = orphandata.map((item) => ({
     ...item,
      count: item.tagged + item.untagged,
    }));
  }

  if(pathname.includes("cloud-advisory")){
   const intialdata =  cloudData.filteredAdvisoryData.filter((ele)=>{
      return ele.Status!=="Approved" && ele.Status!=="Completed"
    })

   let advisorydata = findOcc(intialdata, "SubscriptionID");
    cloudResourceTypes = advisorydata.map((item) => ({
      ...item,
       count: item.tagged + item.untagged,
     }));
  }
 
  if (pathname.includes("complaince-policy")){
     complainceType.forEach((comparisonItem) => {
      for (const cloud in segregatedData) {
        segregatedData[cloud].forEach((cloudItem) => {
          if (cloudItem.SubscriptionID === comparisonItem.SubscriptionID) {
           
            let countLabel ;
            countLabel = "Non-Compliant"
             cloudItem.count = `${comparisonItem.count} ${countLabel}`;
          }
          
        });
      }
      
    })
  }
  else{
     cloudResourceTypes.forEach((comparisonItem) => {
      for (const cloud in segregatedData) {
        segregatedData[cloud].forEach((cloudItem) => {
          if (cloudItem.SubscriptionID === comparisonItem.SubscriptionID) {
       
            let countLabel ;
            if (pathname.includes('tagging-policy')) {
              countLabel = 'Untagged';
              cloudItem.count = `${comparisonItem.untagged} ${countLabel}`;
            } else if (pathname.includes('orphan-objects')) {
              countLabel = 'Orphaned';
              cloudItem.count = `${comparisonItem.count} ${countLabel}`;
            }
          
            else if (pathname.includes('cloud-advisory')) {
              countLabel = 'Advisories';
              cloudItem.count = `${comparisonItem.count} ${countLabel}`;
            }
          

          }
        });
      }
    });
  }
  const getSubscriptions = (subscription: any) => {
    return subscription.map((currElem: any, index: number) => {
      return {
        key: index,
        label: currElem.SubscriptionName,
        children: Array.isArray(currElem?.Subscriptions)
          ? getSubscriptions(currElem?.Subscriptions)
          : currElem?.ChildSubscription,
        ownerName: currElem.SubscriptionOwner,
      };
    });
  };

  const treeViewObjects = Object.keys(segregatedData).reduce((acc: any, cloudName: string) => {
    acc[cloudName] = segregatedData[cloudName].map((currElem: any, index: number) => {
      return {
        key: index,
        label: currElem.SubscriptionName,
        count: currElem.count? currElem.count: "",
        children: Array.isArray(currElem.Subscriptions)
          ? getSubscriptions(currElem.Subscriptions)
          : currElem.Subscriptions,
        ownerName: currElem.SubscriptionOwner,
      };
    });
    return acc;
  }, {});
//calculation
  const cloudIconMap = {
    'AWS': 'awsIcon.png',
    'Azure': 'azureIcon.png',
    'GCP': 'gcpIcon.png'
  };

  return (
    <div className={`w-100 ${pathname.includes("/complaince-policy") ? "comtree-height" :"tree-height" }  d-block overflow-scroll`}>
      {currentClouds.currentCloud?.map((cloud, index) => (
       
        <div key={index}>
          <li className="border-bottom-0 border-2 border-bottom">
            <span className="treeview-p bg-white top-2 fw-bold">
              <img className="cloud-icon" alt={`${cloud}Icon`} src={cloudIconMap[cloud]} />{" "}
            </span>
            <Tree
              treeData={treeViewObjects[cloud]}
            />
          </li>
        </div>
      ))}
    </div>
  );
};

export default Treeview;
