import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import CategoryCard from "../Analytics AI/CardWrapper";
import kuberneteslogo from "./../../../assets/Kubernetes.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../ImplementationGroupForm/CustomSelect";
import ProjectCard from "./ProjectCard";
import { MdAddCircleOutline } from "react-icons/md";
import { Api } from "../../Utilities/api";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectCommonConfig,
  setOrderId,
} from "../CommonConfig/commonConfigSlice";
import { wrapIcon } from "../../Utilities/WrapIcons";
// Removed Redux orderId usage

const MigrationDashboard = () => {
  const MdAddCircleOutlineIcon = wrapIcon(MdAddCircleOutline);

  const [value, setValue] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const commonStore = useAppSelector(selectCommonConfig);
  const reduxOrderId = commonStore?.orderId ?? null;
  useEffect(() => {
    if (!reduxOrderId) {
      dispatch(setOrderId(`${Date.now()}`));
    }
  }, [reduxOrderId, dispatch]);

  const onHandleChange = (e) => {
    setValue(e.target.value);
  };

  // Load projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = `http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_session_details/all`;
        const res = await Api.postData(url, {});
        const payload: any = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.result)
              ? payload.result
              : payload
                ? [payload]
                : [];
        const mapped = (list || []).map((item: any, idx: number) => {
          // Prefer new schema: Applications: [{ OrderID, ApplicationName }]
          const appsFromApplications = Array.isArray(item.Applications)
            ? item.Applications.map((a: any, i: number) => ({
              id: `${item.id ?? idx}-${i}`,
              name: a?.ApplicationName ?? "",
              description: "",
              orderId: a?.OrderID,
              status: a?.Status ?? a?.Status ?? "",
            }))
            : [];
          // Backward-compatible fallbacks
          const apps =
            appsFromApplications.length > 0
              ? appsFromApplications
              : Array.isArray(item.applications)
                ? item.applications
                : Array.isArray(item.ApplicationName)
                  ? item.ApplicationName.map((name: string, i: number) => ({
                    id: `${item.id ?? idx}-${i}`,
                    name,
                    description: "",
                    Status: "",
                  }))
                  : [];
          return {
            id: item.id ?? item.ProjectID ?? item.project_id ?? idx,
            title:
              item.Project ??
              item.title ??
              item.ProjectName ??
              item.project_name ??
              item.name ??
              `Project ${idx + 1}`,
            description:
              item.description ??
              item.ProjectDescription ??
              item.project_description ??
              "",
            applications: apps,
            // Raw fields for downstream POST
            userId: item.UserID ?? item.user_id ?? "",
            cloud: item.Cloud ?? item.cloud ?? "",
            projectName:
              item.Project ??
              item.title ??
              item.ProjectName ??
              item.project_name ??
              item.name ??
              "",
            applicationNames: Array.isArray(item.Applications)
              ? item.Applications.map((a: any) => a?.ApplicationName).filter(
                Boolean
              )
              : Array.isArray(item.ApplicationName)
                ? item.ApplicationName
                : Array.isArray(item.applications)
                  ? item.applications.map((a: any) => a?.name).filter(Boolean)
                  : [],
          };
        });
        setProjectsData(mapped);
      } catch (e) {
        console.error("[MigrationDashboard] Failed to load projects:", e);
        setProjectsData([]);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
  };

  const handleApplicationClick = (app: any, project: any) => {
    console.log("projectId", project?.id);
    if (!app?.orderId) {
      console.warn("[MigrationDashboard] Missing orderId on application");
      return;
    }
    navigate("/CloudAssessmentReport", {
      state: {
        orderId: String(app.orderId),
        projectId: String(project?.id ?? ""),
      },
    });
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleInitiateClick = () => {
    // From projects page: show Applications view with just the Initiate card
    // setSelectedProject({
    //   id: 'new-migration',
    //   title: 'New Migration',
    //   description: '',
    //   applications: [],
    //   userId: '',
    //   cloud: '',
    //   projectName: '',
    // });
    navigate("/AssessmentReport");
  };

  const filteredProjects = projectsData.filter(
    (project) =>
      project.title.toLowerCase().includes(value.toLowerCase()) ||
      project.description.toLowerCase().includes(value.toLowerCase())
  );

  const filteredApplications =
    selectedProject?.applications.filter(
      (app) =>
        app.name.toLowerCase().includes(value.toLowerCase()) ||
        app.description.toLowerCase().includes(value.toLowerCase())
    ) || [];

  return (
    <div className="container-fluid overflow-scroll h-100 d-flex flex-column py-1 px-1 Analytics_Ai AksCluster bg_color">
      <div className="position-relative bg-container mt-1">
        <div className="d-flex justify-content-center align-items-center text-center">
          <h1 className="fw-semibold text-light display-5 pt-4 mt-4">
            Cloud Migration Platform
          </h1>
        </div>

        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-n4 z-3 w-100">
          <div className="d-flex justify-content-center">
            <div className="input-group input-group-lg w-50 shadow rounded">
              <span className="input-group-text bg-white border-0">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </span>
              <input
                type="text"
                className="form-control border-0 search-input"
                placeholder="Search for the migration plans"
                value={value}
                onChange={onHandleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-0 w-100 px-4 mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="row pl-3 pt-2">
              {!selectedProject ? (
                // Show Projects
                <>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                      <div
                        key={project.project_id}
                        className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
                      >
                        <ProjectCard
                          title={project.title}
                          description={project.description}
                          onClick={() => handleProjectClick(project)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-muted text-center w-100 p-3">
                      No Projects, Let's begin the migration journey
                    </div>
                  )}
                  <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                    <div
                      // className="card custom-card text-center m-3 p-3"
                      className="card custom-card text-center p-3"
                      onClick={handleInitiateClick}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center h-100">
                        <div>
                          <MdAddCircleOutlineIcon size={24} />
                          <h5 className="card-title fs-6 fw-bold mb-0">
                            Initaite new Application Process
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Show Applications for selected project
                <>
                  <div className="w-100 mb-3">
                    <button
                      className="btn btn-link text-primary p-0 mb-3"
                      onClick={handleBackToProjects}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Projects
                    </button>
                  </div>

                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app, index) => (
                      <div
                        key={app.id}
                        className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
                      >
                        <ProjectCard
                          title={app.name}
                          description={app.description}
                          Status={app.Status}
                          onClick={() =>
                            handleApplicationClick(app, selectedProject)
                          }
                          isActive={index === 0}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-muted text-center w-100 p-3">
                      No Applications found
                    </div>
                  )}
                  <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                    <div
                      className="card custom-card text-center m-3 p-3"
                      onClick={() =>
                        navigate("/CloudAssessmentReport", {
                          state: {
                            projectId: String(selectedProject?.id ?? ""),
                          },
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center h-100">
                        <div>
                          <MdAddCircleOutlineIcon size={24} />
                          <h5 className="card-title fs-6 fw-bold mb-0">
                            Initaite new Application Process
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
