import React from 'react';
import { useAxiosFetch } from '../../../hooks/useAxiosFetch';
import { CiSliderHorizontal } from 'react-icons/ci';
import { cleanLeadingZeros } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';
import { response } from 'express';
import windows from '../../../assets/windows-icon.png';
import linux from '../../../assets/Linux.png';


interface PatchDetailsDataItem {
  _id: string;
  GroupName: string;
  Cloud: string;
  OS: string;
  ServerName: string;
  ServerIP: string;
  LastPatch: string;
  LastPatchBy: string;
  NewAvailable: string;
  AvailablePatches: { Size: string; Title: string }[];
  PatchDate: string;
  OSPatch: string;
  SecurityPatch: string;
  BugFix: string;
}

interface ApiResponse {
  data: PatchDetailsDataItem[];
  code: number;
  message: string;
}

const Preview = () => {
  const { data: apiResponse, loading, error } = useAxiosFetch<ApiResponse>(
    'http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/patch_dashboard/'
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiResponse || !apiResponse.data) {
    return <div>No data available</div>;
  }

  const osData = [
    { os: 'Windows', imgSrc: windows, osPatch: 0, securityPatch: 0, bugFix: 0, scheduled: 0 },
    { os: 'Linux', imgSrc: linux, osPatch: 0, securityPatch: 0, bugFix: 0, scheduled: 0 }
  ];

  apiResponse.data.forEach(item => {
    const osItem = osData.find(os => os.os === item.OS);
    if (osItem) {
      if (item.OSPatch) osItem.osPatch++;
      if (item.SecurityPatch) osItem.securityPatch++;
      if (item.BugFix) osItem.bugFix++;
      if (item.AvailablePatches && item.AvailablePatches.length > 0) {
        osItem.scheduled++;
      }
    }
  });

  return (
    <div style={{ fontSize: '11px' }}>
      {osData.map((os, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <img src={os.imgSrc} style={{ width: '25px', height: '20px' }} alt={`${os.os} logo`} />
          <ul style={{ paddingLeft: '30px' }}>
            <li>
              
              <ul>
                <li>
                  <strong>OS Patch</strong>: <span style={{ paddingLeft: '50px', color: 'var(--bs-nav-link-hover-color)', fontSize: '11px' }}>Patch: {os.osPatch} <span style={{ paddingLeft: '50px', color: '#0000DF', fontSize: '11px' }}></span>Scheduled: {os.scheduled}</span>
                </li>
                <li>
                  <strong>Security Patch</strong>: <span style={{ paddingLeft: '24px', color: 'var(--bs-nav-link-hover-color)', fontSize: '11px' }}>Patch: {os.securityPatch} <span style={{ paddingLeft: '50px', color: '#0000DF', fontSize: '11px' }}></span>Scheduled: {os.scheduled}</span>
                </li>
                <li>
                  <strong>Bug Fix</strong>: <span style={{ paddingLeft: '60px', color: 'var(--bs-nav-link-hover-color)', fontSize: '11px' }}>Patch: {os.bugFix} <span style={{ paddingLeft: '50px', color: '#0000DF', fontSize: '11px' }}></span>Scheduled: {os.scheduled}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Preview;
