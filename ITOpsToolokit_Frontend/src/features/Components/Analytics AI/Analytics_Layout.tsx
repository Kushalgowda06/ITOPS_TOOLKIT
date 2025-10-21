const Analytics_Layout = ({ leftSidebar, mainContent, rightSidebar }) => {
  return (
    <div className="container-fluid Analytics_Ai mh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        <div
           className="col-12 col-md-2 p-0 d-flex flex-column "
        >
          {leftSidebar}
        </div>
        <div className="col-12 col-md-8 p-0 px-1 d-flex flex-column">
          {mainContent}
        </div>
        <div className="col-12 col-md-2 p-0  d-flex flex-column">
          {rightSidebar}
        </div>
      </div>
    </div>
  );
};

export default Analytics_Layout;
