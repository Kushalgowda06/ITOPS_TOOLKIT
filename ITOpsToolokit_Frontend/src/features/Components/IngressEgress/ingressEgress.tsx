import { Tabs, Tab } from "react-bootstrap";
import Ingresstable from "./Ingresstable";
import Egresstable from "./Egresstable";

const IngressEgress = ({
  selectedData,
  setPort,
  port,
  setGatewayValue,
  gatewayvalue,
  cidrvalue,
  setCIDRValue,
  handleClose, getport
}) => {

  return (
    <div className="ingressegress">
      <Tabs
        id="controlled-tab-example"
        defaultActiveKey="ingress"
        className="px-3 mb-3 border-bottom-0 tab"
      >
        <Tab eventKey="ingress" title="Ingress">
          <div className="d-flex justify-content-center">
            <div className="px-3">
              <p className=" text-muted fw-bold mb-0 tab">Ingress</p>
              <p className="ps-4 text-muted mb-0 tab">
                Ingress refers to the process of routing external traffic into
                the Kubernetes cluster. It is the entry point for incoming
                traffic to the services running within the cluster.
              </p>
            </div>
          </div>
          <Ingresstable
            selectedData={selectedData}
            setPort={setPort}
            port={port}
            setGatewayValue={setGatewayValue}
            gatewayvalue={gatewayvalue}
            handleClose={handleClose}
            getport={getport}
          />
        </Tab>
        <Tab eventKey="egress" title="Egress">
          <div className="d-flex justify-content-center">
            <div className="px-3">
              <p className=" text-muted fw-bold mb-0 tab">Egress</p>
              <p className="ps-4 text-muted mb-0 tab">
                Egress refers to the process of traffic leaving the Kubernetes
                cluster and going to an external destination. This traffic can
                be initiated from within the cluster by a pod or service.
              </p>
            </div>
          </div>
          <Egresstable
            selectedData={selectedData}
            setPort={setPort}
            port={port}
            cidrvalue={cidrvalue}
            setCIDRValue={setCIDRValue}
            handleClose={handleClose}
            getport={getport}
          />
        </Tab>
      </Tabs>
      
    </div>
  );
};

export default IngressEgress;
