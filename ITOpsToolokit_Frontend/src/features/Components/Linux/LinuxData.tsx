import { useEffect, useState } from "react";
import { Api } from "../../Utilities/api";
import { LuCloudCog, LuDisc, LuServer, LuServerCrash, LuCpu, LuPowerOff, LuTimer, LuDisc2 } from "react-icons/lu";
import { FaLinux, FaMemory, FaServer, FaStackOverflow } from "react-icons/fa";
import LinuxBot from "./LinuxBot";
import { wrapIcon } from "../../Utilities/WrapIcons";

const LinuxData = ({ selectedData }) => {
    const FaLinuxIcon = wrapIcon(FaLinux);
    const LuDiscIcon = wrapIcon(LuDisc);
    const LuServerIcon = wrapIcon(LuServer);
    const LuServerCrashIcon = wrapIcon(LuServerCrash);
    const LuCpuIcon = wrapIcon(LuCpu);
    const LuPowerOffIcon = wrapIcon(LuPowerOff);
    const LuTimerIcon = wrapIcon(LuTimer);
    const LuDisc2Icon = wrapIcon(LuDisc2);
    const FaMemoryIcon = wrapIcon(FaMemory);
    const FaServerIcon = wrapIcon(FaServer);
    const LuCloudCogIcon = wrapIcon(LuCloudCog);


    const [showBot, setShowBot] = useState(false);
    const [title, setTitle] = useState("")
    const [sysData, setSysData] = useState([]);

    const selectedSysId = selectedData[0].sys_id

    const handleClose = () => setShowBot(false);

    const handleShowBot = (text) => {
        setTitle(text)
        setShowBot(true);
    }

    const customData1 = () => {
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
        customData1()
    }, [])

    return (
        <>
            <div>
                <div className="d-flex  align-items-center justify-content-between align-items-center">
                    <div>
                        <FaLinuxIcon
                            className=" mx-1 bot_icon"
                        />
                        <span className="fw-bolder">Linux Bots</span>
                    </div>
                    <button className="btn btn-outline-success btn-width font-weight-bold">Create New Ticket</button>
                </div>
                <div className="d-flex justify-content-center" >
                    <div className="px-3">
                        <p className=" text-muted fw-bold mb-0 nav-font">Linux Bots</p>
                        <p className="ps-4 text-muted role_fnt">
                            You can upgrade your cluster to a newer version of Kubernetes or configure automatic upgrade settings.
                            If you upgrade your cluster, you can choose whether to upgrade only the control plane or to also upgrade all node
                            pools. To upgrade individual node pools, go to the 'Node pools' menu item instead.
                        </p>
                    </div>
                </div>
                <div className="row d-flex ps-5  align-items-start  bots_fnt" >
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Add user to Group")}>
                            <LuCloudCogIcon
                                className="mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Add user to Group</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Provide Root access to User")}>
                            <LuCpuIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Provide Root access to User</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Revoke Root Acccess to User")}>
                            <LuDiscIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Revoke Root Acccess to User</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Generate RSA key")}>
                            <FaMemoryIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Generate RSA key</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Remove user from a Group")}>
                            <FaServerIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Remove user from a Group</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("List current logged on users")}>
                            <LuServerIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">List current logged on users</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Kill user session")}>
                            <LuServerCrashIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Kill user session</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Linux file copy same server")}>
                            <LuPowerOffIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Linux file copy same server</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Linux file copy different servers")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Linux file copy different servers</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Linux move file same server")}>
                            <LuTimerIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Linux move file same server</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Linux move file different servers")}>
                            <LuDisc2Icon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Linux move file different servers</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Linux Server Health Check")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Linux Server Health Check</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("User Account Management")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">User Account Management</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Package Deployment")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Package Deployment</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Pre and Post Patching Checks")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Pre and Post Patching Checks</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Log Rotation")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Log Rotation</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Server Reboot")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Server Reboot</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Service Restart")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Service Restart</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Change file permission")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Change file permission</span>
                        </div>
                    </div>
                    <div className=" col-xl-4 col-lg-4 col-md-6 py-2">
                        <div className="d-flex" onClick={() => handleShowBot("Update file ownership ")}>
                            <LuCloudCogIcon
                                className=" mx-1 icon_font"
                            />
                            <span className="fw-bold bot_cursor">Update file ownership </span>
                        </div>
                    </div>
                </div>
                <LinuxBot show={showBot} onHide={handleClose} title={title} sysData={sysData} />
            </div>
        </>
    );
};

export default LinuxData;
