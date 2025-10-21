import { useEffect, useState } from "react";
import { Api } from "../../Utilities/api";
import { LuCloudCog, LuDisc, LuServer, LuServerCrash, LuCpu, LuPowerOff, LuTimer, LuDisc2 } from "react-icons/lu";
import { FaWindows, FaMemory, FaServer, FaStackOverflow } from "react-icons/fa";
import WindowsBot from "./WindowsBot";
import { wrapIcon } from "../../Utilities/WrapIcons";

const WindowData = ({ selectedData }) => {

    const [showBot, setShowBot] = useState(false);
    const [title, setTitle] = useState("")
    const [sysData, setSysData] = useState([]);

    const selectedSysId = selectedData[0].sys_id

    const handleClose = () => setShowBot(false);

    const handleShowBot = (text) => {
        setTitle(text)
        setShowBot(true);
    }


    const customData = () => {
        const username = "ServicenowAPI";
        const password = "Qwerty@123";
        const options = {
            auth: {
                username: username,
                password: password,
            },
        };

        try {
            Api.getCallOptions(`https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_query=state!%3D6%5EOR7%5EOR8%5ENcmdb_ci%3D${selectedSysId}&sysparm_limit=10`, options).then((response: any) => {
                setSysData(response.data.result);
            });
            setSysData([])
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        customData()
    }, [])

    const LuCloudCogIcon = wrapIcon(LuCloudCog);
    // LuDisc, LuServer, LuServerCrash, LuCpu, LuPowerOff, LuTimer, LuDisc2 
    const LuDiscIcon = wrapIcon(LuDisc);
    const LuServerIcon = wrapIcon(LuServer);
    const LuServerCrashIcon = wrapIcon(LuServerCrash);
    const LuCpuIcon = wrapIcon(LuCpu);
    const LuPowerOffIcon = wrapIcon(LuPowerOff);
    const LuTimerIcon = wrapIcon(LuTimer);
    const LuDisc2Icon = wrapIcon(LuDisc2);
    const FaWindowsIcon = wrapIcon(FaWindows);
    const FaMemoryIcon = wrapIcon(FaMemory);
    const FaServerIcon = wrapIcon(FaServer);


    







    return (
        <>
            <div>
                <div className="d-flex  align-items-center justify-content-between align-items-center">
                    <div>
                        <FaWindowsIcon
                            className=" mx-1 bot_icon"
                        />
                        <span className="fw-bolder">Windows Bots</span>
                    </div>
                    <button className="btn btn-outline-success btn-width font-weight-bold">Create New Ticket</button>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="px-3">
                        <p className=" text-muted fw-bold mb-0 nav-font">Windows Bots</p>
                        <p className="ps-4 text-muted role_fnt">
                            You can upgrade your cluster to a newer version of Kubernetes or configure automatic upgrade settings.
                            If you upgrade your cluster, you can choose whether to upgrade only the control plane or to also upgrade all node
                            pools. To upgrade individual node pools, go to the 'Node pools' menu item instead.
                        </p>
                    </div>
                </div>
                <div className="row d-flex ps-5  align-items-start  bots_fnt">
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Windows Server Not Reachable")}>
                            <FaWindowsIcon
                                className="mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Windows Server Not Reachable</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("CPU usage is high")}>
                            <LuCpuIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">CPU usage is high</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Disk clean-up")}>
                            <LuDiscIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Disk clean-up</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Memory Utilization High")}>
                            <FaMemoryIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Memory Utilization High</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Server Reboot")}>
                            <FaServerIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Server Reboot</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Service Down/Service Restart")}>
                            <LuServerIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Service Down/Service Restart</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("CPU Usage is high – ESXi Host")}>
                            <LuServerCrashIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">CPU Usage is high – ESXi Host</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Memory Utilization High - ESXi Host")}>
                            <LuPowerOffIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Memory Utilization High - ESXi Host</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Windows Citrix Service Down")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Windows Citrix Service Down</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("NTP Sync time Issue")}>
                            <LuTimerIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">NTP Sync time Issue</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Disk Modification/Expantion")}>
                            <LuDisc2Icon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Disk Modification/Expantion</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Windows Patching")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Windows Patching</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Windows VM Decommision")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Windows VM Decommision</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Windows Splunk Agent Installation")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Windows Splunk Agent Installation</span>
                        </div>
                    </div>
                </div>
                <WindowsBot show={showBot} onHide={handleClose} title={title} sysData={sysData} />
            </div>
        </>
    );
};
export default WindowData;
