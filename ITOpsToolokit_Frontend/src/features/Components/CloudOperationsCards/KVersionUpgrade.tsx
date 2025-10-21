import React, { useState, useEffect } from "react";
import KubernitiesWrapperCard from "../CloudOperationsPage/KubernitiesWrapperCard";
import { useLocation } from "react-router-dom";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCommonConfig, setK8SData } from "../CommonConfig/commonConfigSlice";

const KVersionUpgrade = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const fetchData = () => {
      try {
        Api.getCall(testapi.clusterdetail).then((response: any) => {
          dispatch(setK8SData(response?.data));
         });
       
      } catch (error) {
       console.error(error)
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    {pathname.includes("version-upgrade") ? (
        <KubernitiesWrapperCard
          title="Kubernetes Version Manager"
          data={cloudData.k8sData}
        />
      ) : pathname.includes("ingress-egress") ? (
        <KubernitiesWrapperCard
          title="Kubernetes Ingress & Egress"
          data={cloudData.k8sData}
        />
      ) : pathname.includes("container-deployment") ? (
        <KubernitiesWrapperCard
          title="K8S Container Deployment"
          data={cloudData.k8sData}
        />
      ) : (
          <KubernitiesWrapperCard
              title="K8S Node Manager"
              data={cloudData.k8sData}
        />
      )
    }
    </>
  );
};

export default KVersionUpgrade;
