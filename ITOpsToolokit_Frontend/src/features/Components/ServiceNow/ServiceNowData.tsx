import React, { useState, useEffect } from "react";

interface Item {
  number: string;
  sys_created_on: string;
  state: string;
  sys_id: string;
  short_description: string;
  description: string;
}

interface ServiceNowDataProps {
  Items: Item[];
  finalArray: string[];
}

const ServiceNowData: React.FC<ServiceNowDataProps> = (props) => {
  const [filterdata, setfiltered] = useState<Item[]>(props.Items);
  const [search, setSearch] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    search.length === 0
      ? setfiltered(props.Items)
      : setfiltered([...searchData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, props.Items]);

  const stopHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const searchData = props.Items.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
    )
  );
  //absolute working
  return (
    <>
      {props.finalArray.length === 0 ? (
        <div className=" pt-5 mx-auto ">
          <p className="alert alert-primary px-5 ">No Data Found!!!</p>
        </div>
      ) : (
        <div className="w-100 treeview-height d-block ">
          <div className="">
            <form
              onSubmit={stopHandler}
              className="py-1 d-flex border-bottom justify-content-end"
            >
              <input
                className="form-control w-25 ser-h me-2"
                type="search"
                placeholder="Search "
                value={search}
                onChange={handleChange}
              />
            </form>
          </div>
          <div className="overflow-scroll service" >
            <table className="table ">
              {filterdata.map((val, key) => {
                return (
                  <tbody>
                    <tr key={key}>
                      <tr className="d-flex justify-content-between border-0 bg-white f-size text-primary">
                        <td className=" fw-bold ">
                          <a
                            href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.number}
                          </a>
                        </td>
                        <td>
                          <a
                            href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.sys_created_on.split(" ")[0]}
                          </a>
                        </td>
                        <td>
                          <a
                            href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.state}
                          </a>
                        </td>
                        <td>
                          <a
                            href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.sys_id}
                          </a>
                        </td>
                      </tr>
                      <tr className="d-flex pt-0 pb-2 bg-white f-size text-primary">
                        <td
                          className="tr-size  text-truncate text-hover pe-1"
                          style={{ height: "40px", width: "225px" }}
                        >
                          <a
                            href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.short_description}
                          </a>
                        </td>
                        {"|"}
                        <td
                          className="ps-3 text-truncate  text-hover"
                          style={{ height: "40px", width: "204px" }}
                        >
                          <a
                            href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {val.description}
                          </a>
                        </td>
                      </tr>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      )}
    </>
  );
};
export default ServiceNowData;
