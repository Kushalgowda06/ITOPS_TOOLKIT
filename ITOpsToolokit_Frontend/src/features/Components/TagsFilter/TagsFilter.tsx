import React, { useEffect, useState } from 'react';
import CustomAutoComplete from '../../Utilities/CustomAutoComplete';
import { filterData } from '../../Utilities/filterData';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCommonConfig, setFilteredAdvisoryData, setFilteredOrphanData, setFilteredTaggingData, setTagsFilterData, } from '../CommonConfig/commonConfigSlice';

const TagsFilter = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const [owner, setOwner] = useState([]);
  const [selectedBu, setSelectedBu] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState([]);
  const [application, setApplication] = useState([]);
  const [costCenter, setCostCenter] = useState([]);
  const [support, setSupport] = useState([]);
  const dispatch = useAppDispatch();


  var allData = [...cloudData.filteredTaggingData, ...cloudData.filteredOrphanData, ...cloudData?.filteredAdvisoryData];

  useEffect(() => {

    const filteredData = allData.filter((item) => {
      const isBU = !selectedBu.length || selectedBu.includes(item.BU);
      const isOwner = !owner.length || owner.includes(item.Owner);
      const isSelectedEnv = !selectedEnv.length || selectedEnv.includes(item.Environment);
      const isApplication = !application.length || application.includes(item.Application);
      const isCostCenter = !costCenter.length || costCenter.includes(item.CostCenter);
      const isSupport = !support.length || support.includes(item.Support);
      return isBU && isOwner && isSelectedEnv && isApplication && isCostCenter && isSupport;

    });

    const checkCon = [selectedBu, owner, selectedEnv, application, costCenter, support]

    const check = checkCon.map((item) => {
      return item.length !== 0 ? true : false;
    })
    if (check.every(item => item === false)) {
      dispatch(setFilteredTaggingData(cloudData?.cloudData));
      dispatch(setFilteredOrphanData(cloudData?.orphanData));
      dispatch(setFilteredAdvisoryData(cloudData?.advisoryData));
    }
    else {
      let filteredCloudData = filterData("Cloud", filteredData);
      let availableClouds = Object.keys(filteredCloudData);
      if (availableClouds.length > 0) {
        var orphanData = filteredData.filter((item) => {
          return Object.keys(item).includes("ResourceStatus");
        });
        orphanData.length > 0 && dispatch(setFilteredOrphanData(orphanData))
        var advisoryData = filteredData.filter((item) => {
          return Object.keys(item).includes("AdvisoryStatus");
        });
        advisoryData.length > 0 && dispatch(setFilteredAdvisoryData(advisoryData))
        var tagsData = filteredData.filter((item) => {
          return Object.keys(item).includes("CustomerName");
        });
        tagsData.length > 0 && dispatch(setFilteredTaggingData(tagsData))
  
      }
    }
  }, [selectedBu, owner, selectedEnv, support, costCenter, application]);

  return (
    <div className="tab-content position-absolute top-99 end-0 myRequest-dropdown tag_filter" id="myTabContent">
      <div className="d-flex h-100 bg-white p_2  border border-primary shadow-lg rounded-2">
        <div className="tab-pane fade show active d-flex align-items-center" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab">
          <span className="px-2">
            <CustomAutoComplete
              options={Object.keys(filterData("BU", allData))}
              value={selectedBu}
              onChange={(event, newValue) => {
                if (newValue !== null && newValue !== undefined) {
                  setSelectedBu(newValue);
                }
              }}
              error={false}
              placeholder="BU"
              TextFieldSx={{ width: 150 }}
              id="multiple-limit-tags"
              limitTags={2}
              PaperStyle={{ width: 210, overflow: "auto" }}
            />
          </span>
          <span className="px-2">
            <CustomAutoComplete
              options={Object.keys(filterData("Environment", allData))}
              value={selectedEnv}
              onChange={(event, newValue) => {
                if (newValue !== null && newValue !== undefined) {
                  setSelectedEnv(newValue);
                }
              }}
              error={false}
              placeholder="Environment"
              TextFieldSx={{ width: 180 }}
              id="multiple-limit-tags"
              limitTags={2}
              PaperStyle={{ width: 230, overflow: "auto" }}
            />
          </span>
          <span className="px-2">
            <CustomAutoComplete
              id="multiple-limit-tags"
              limitTags={1}
              options={Object.keys(filterData("Owner", allData))}
              value={owner}
              onChange={(event, newValue) => {
                if (newValue !== null && newValue !== undefined) {
                  setOwner(newValue);
                }
              }}
              placeholder="Owner"
              TextFieldSx={{ width: 200 }}
              showTooltip={{ show: true, range: 1 }}
              PaperStyle={{ width: 240, overflow: "auto" }}
              error={false}
            />
          </span>
          <span className="px-2">
            <CustomAutoComplete
              id="multiple-limit-tags"
              limitTags={1}
              options={Object.keys(filterData("Application", allData))}
              value={application}
              onChange={(event, newValue) => {
                if (newValue !== null && newValue !== undefined) {
                  setApplication(newValue);
                }
              }}
              placeholder="Application"
              TextFieldSx={{ width: 200 }}
              error={false}
            />
          </span>
          <span className="px-2">
            <CustomAutoComplete
              id="multiple-limit-tags"
              limitTags={1}
              options={Object.keys(filterData("CostCenter", allData))}
              value={costCenter}
              onChange={(event, newValue) => {
                if (newValue !== null && newValue !== undefined) {
                  setCostCenter(newValue);
                }
              }}
              placeholder="CostCenter"
              TextFieldSx={{ width: 200 }}
              error={false}
            />
          </span>
          <span className="px-2">
            <CustomAutoComplete
              id="multiple-limit-tags"
              limitTags={1}
              options={Object.keys(filterData("Support", allData))}
              value={support}
              onChange={(event, newValue) => {
                if (newValue !== null && newValue !== undefined) {
                  setSupport(newValue);
                }
              }}
              placeholder="Support"
              TextFieldSx={{ width: 200 }}
              error={false}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default TagsFilter;
