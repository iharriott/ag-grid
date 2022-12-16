import React, { useState, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";

const App = () => {
  const [gridApi, setGridApi] = useState();
  const accessToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2dlaWNvMzY1Lm9ubWljcm9zb2Z0LmNvbS81MWE0ZWUyZC0yN2M0LTQyNWYtOTU0Mi1iMGY1MTE3ZjAwZTEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83Mzg5ZDhjMC0zNjA3LTQ2NWMtYTY5Zi03ZDQ0MjY1MDI5MTIvIiwiaWF0IjoxNjcxMTQ1MTA4LCJuYmYiOjE2NzExNDUxMDgsImV4cCI6MTY3MTE0OTczMSwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhUQUFBQTlPUUJ1QnR0WFFLUVlwNHVyaGdIV0ptTkY5ckp0QjhuUzZZcUhEUlpxM0QxUnJwUUhIV0c1R2ZPZllpZnV2djciLCJhbXIiOlsicHdkIiwicnNhIl0sImFwcGlkIjoiZWFmZmQ1OWMtY2MyZC00NTcwLTg5MmEtNzYzMGJlN2MwYTYyIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiIwNDVmNWJlNS0yZGUyLTQ4MGItYjk2MS0wZTk3YzhlNDE4YzEiLCJmYW1pbHlfbmFtZSI6IkhhcnJpb3R0IiwiZ2l2ZW5fbmFtZSI6IklhbiIsImlwYWRkciI6IjEyLjMzLjM1LjEyMSIsIm5hbWUiOiJIYXJyaW90dCwgSWFuKENvbnRyYWN0b3IpIiwib2lkIjoiYzc5ODQyN2ItYWQyNy00NmZjLTlkOTAtN2Y3N2Q0ZjdmY2Q4Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIyMDUyMzM4OC0xNDU0NDcxMTY1LTE4MDE2NzQ1MzEtMTQwMTA3MyIsInJoIjoiMC5BU2NBd05pSmN3YzJYRWFtbjMxRUpsQXBFbGpMWFMwbEZnbE9rQ0tfdHQ3TXhBTW5BTEkuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiQmJ1VEZjRFR1WEE2cEtqQjlIeXdTNUZRcXNEajlOM0dYZ1ZnT1o3ajd2ZyIsInRpZCI6IjczODlkOGMwLTM2MDctNDY1Yy1hNjlmLTdkNDQyNjUwMjkxMiIsInVuaXF1ZV9uYW1lIjoiSUhhcnJpb3R0QGdlaWNvLmNvbSIsInVwbiI6IklIYXJyaW90dEBnZWljby5jb20iLCJ1dGkiOiI5X1hUTVhGS1lVbU85TlMyczd3R0FBIiwidmVyIjoiMS4wIn0.XTa63IvKqVgxYF37A0Np7iWz8elPqbCa5ryabwMbJQXlmx6PWQBooUz2jCf2ucpaRukRFOejjk1MKVpmnPOLweRm8f7pdxlaCNYtSq5cDbs60tvi9iD-e1rS4qOt4DUyOazG8RbQmpcftx0s1pz4PYX_muPkjbXoMqN5DVUNMptgIyKsXstD5LcNXkA1ZiTZ4fFO1bc8ViuxAVlSEmi5-P2f4B_MmHqqlg8u1stkGCCGRQIl-0PlJD9Enpn_DU3JZV09Zd0oMwSOW-v_ppRUESq5a2LCNH8CINRdM3XZRT3vvsCYIFOl4GzQcwQ51grt6DeuQpT5cm770PEP3dOfEw";
  const apiUrl = "https://pdmapi.dv1.apstks.aks.aze1.cloud.geico.net";
  const apiAction = "GetRatingTables";
  const version = "CW";
  const includeContent = false;
  const endpoint = `${apiUrl}/${apiAction}/${version}?includeContent=${includeContent}`;
  const [result, setResult] = useState([]);
  const [heading, setHeading] = useState([]);
  const [requestError, setRequestError] = useState("");
  const gridRef = useRef();

  const defaultColDef = {
    sortable: true,
    editable: true,
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  axios.interceptors.request.use(
    (config) => {
      config.headers.authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getColumnHeadings = (dataArray) => {
    const columnheadings = Object.keys(dataArray[0]).map((key) => ({
      field: key,
      headerName: capitalize(key),
      resizable: true,
      rowDrag: true,
      //checkboxSelection: true,
    }));
    return columnheadings;
  };

  const onGridReady = (params) => {
    setGridApi(params);
    axios.get(endpoint).then((resp) => {
      const { result } = resp.data;
      const json = JSON.stringify(result);
      let parsedResult = JSON.parse(json);
      setResult(parsedResult);
      let headings = getColumnHeadings(parsedResult);
      headings = headings.filter((x) => x !== "fileContent");
      setHeading(headings);
      params.api.setColumnDefs(headings);
      params.api.applyTransaction({ add: result });
      // params.api.paginationGoToPage(3);
    });
  };

  const capitalize = (value) => {
    return value && value[0].toUpperCase() + value.slice(1);
  };

  const onPaginationPageSizeChange = (pageSize) => {
    gridApi.api.paginationSetPageSize(pageSize);
  };

  const cellClickedListener = useCallback((e) => {
    console.log("cellClicked", e);
  });

  const clearGridClicked = useCallback((e) => {
    gridRef.current.api.deselectAll();
  });

  return (
    <div className="App">
      <h2 align="center">Dynamic AG Grid</h2>
      <select onChange={(e) => onPaginationPageSizeChange(e.target.value)}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <button onClick={clearGridClicked}>Clear Selection</button>
      <div className="ag-theme-alpine" style={{ height: "500px" }}>
        <AgGridReact
          ref={gridRef}
          onCellClicked={cellClickedListener}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
          animateRows={true}
          //paginationAutoPageSize={true}
        />
      </div>
    </div>
  );
};

export default App;
