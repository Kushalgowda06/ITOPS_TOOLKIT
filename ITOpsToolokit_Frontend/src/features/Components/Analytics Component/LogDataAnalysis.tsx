import HeaderBar from "../AksCluster/TitleHeader";
import DataAnalysisChart from "./DataAnalysisChart";

const LogDataAnalysis = () => {
  return (

    <div className="content-height  d-flex flex-column  ">
      <HeaderBar content="Log Summary" position="center" />
      {/* <div className=" px-1 py-1 rounded-top text-center text-sm text-md text-lg text-xl text-xxl text-big fw-semibold shadow log_sum_header">
        Log Summary
      </div> */}

      <div className="row rounded content-scroll p-1 flex-grow-1 mx-0 g-1">
        <div className="col-12 pb-1">
          <div className=" rounded h-100">
            <DataAnalysisChart />
          </div>
        </div>

        <div className="col-12 pb-1">
          <div className="card_layout_links  rounded text-white p-3 h-100">
            <h6 className="f-size  fw-semibold">Legend:</h6>
            <p className="f-size ps-1">Total Errors Logged: tdrgd</p>
            <ul className="list-unstyled f-size ">
              <li>
                <span style={{ color: "#011A80" }}>●</span> New Errors
              </li>
              <li>
                <span style={{ color: "#6895F4" }}>●</span> Existing Errors
              </li>
              <li>
                <span style={{ color: "#B8D9FF" }}>●</span> Solutions Available
              </li>
              <li>
                <span style={{ color: "#3F3F3F" }}>●</span> New Solutions Under
                Development
              </li>
            </ul>
            <div className="text-center">
              <a
                href="#test"
                className="text-decoration-underline text-white fw-semibold f-size "
              >
                View detailed report
              </a>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className=" card_layout_links text-white rounded p-3 h-100">
            <p className="f-size fw-semibold">Explore other links::</p>
            <ul className="list-unstyled f-size ">
              <li>
                •
                <a href="#link1" className="text-decoration-underline text-white ms-2">
                  Detailed error analysis
                </a>
              </li>
              <li>
                •
                <a href="#link2" className="text-decoration-underline text-white ms-2">
                  JVM name directory
                </a>
              </li>
              <li>
                •
                <a href="#link3" className="text-decoration-underline text-white  ms-2">
                  Host name directory
                </a>
              </li>
              <li>
                •
                <a href="#link4" className="text-decoration-underline text-white  ms-2">
                  AI Docs analysis report
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogDataAnalysis;
