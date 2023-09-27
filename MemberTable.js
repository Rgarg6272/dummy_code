import { forwardRef } from "react";
import React, { useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import SimpleSnackbar from "../../../common/AlertMessage";
import "jspdf-autotable";
import { TablePagination } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CsvBuilder } from "filefy";
import jsPDF from "jspdf";
import { commonFontSizes } from "../../../css/FontSizes";
import { MemberInformation } from "../MemberInformation/MemberInformation";
import SearchDialog from "../../../common/SearchDialog";
import { serviceUrls } from "../../../../utils/serviceUrls";
import { requestWrapper } from "../../../../utils/requestWrapper";
import { CircularProgress } from "@material-ui/core";
import { Loader } from "../../../common/Loader";
import { sub } from "date-fns";

export const MemberTable = ({ memberData }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSev, setSnackSev] = useState("");
  const [snackMsg, setSnackMsg] = useState("");
  const tableRef = React.createRef();
  const [showDialog, setshowDialog] = useState(false);
  const [count, setCount] = useState(memberData && memberData.length > 0 ? memberData.length : 0);
  const [memberInfo, setMemberInfo] = useState(false);
  const [flag, setFlag] = useState("");
  const [content, setContent] = useState("");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [memberRowData, setMemberRowData] = useState("");
  const [memberInfoData, setMemberInfoData] = useState("");
  const [memberDeleData, setMemberDeleData] = useState("");

  var memberRes = "";
  var subscriberId = "";
  let nullObject = null;
  let data1 = {};
  let noData1 = "";

  const history = useHistory();


  const handleClick = (rowData) => {
    setLoading(true);
    setMemberRowData(rowData);
    subscriberId = rowData.Subscriber_id;
    if (memberData.length === 1) {
      const URL = serviceUrls.get_member_information;
      getMemberInformation(rowData.Subscriber_id, URL);
    } else {
      const URL = serviceUrls.get_member_search;
      getMemberInformation(rowData.Subscriber_id, URL);
    }
  };

  const handleSearchDialog = () => {
    setSearchDialogOpen(false);
  }

  const handleShowMemberTable = () => {
    setSearchDialogOpen(false);
    const URL = serviceUrls.get_member_information;
    getMemberInformation(memberRowData.Subscriber_id, URL);
  }

  const getMemberInformation = (SubscriberId, URL) => {
    var filter_obj = {
      Subscriber_id: SubscriberId ? SubscriberId : "",
    }
    setLoading(true);
    requestWrapper(URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: filter_obj,
    })
      .then((response) => {
        setLoading(false);
        const ErrorCode = response.system.properties.code.example;
        const ErrorMsg = response.system.properties.message.example;
        if (ErrorCode == 500) {
          setContent("Internal Error");
          setSearchDialogOpen(true);
          setShowTable(false);
        } else if (ErrorCode == 200) {
          if (URL == "/get_member_search") {
            const flag = response.get_member[0].Search_ind;
            console.log('flag::', flag)
            if (flag === "NF") {
              setFlag(flag);
              setContent("Member Not Found in Care Management System");
              setSearchDialogOpen(true);
            } else if (flag === "NDH") {
              setFlag(flag);
              setContent("Member has no delegation history to view");
              setSearchDialogOpen(true);
            } else if (flag === "NE") {
              setFlag(flag);
              setContent("Member not Eligible in PHP. Do you still want to continue ?");
              setSearchDialogOpen(true);
            } else if (flag === "F") {
              console.log('else_if', response)
              setFlag(flag);
              setSearchDialogOpen(false);
              const URL = serviceUrls.get_member_information;
              getMemberInformation(response.get_member[0].Subscriber_id, URL);
            }
          } else if (URL == "/get_member_information") {
            console.log('else', response.get_member_info);
            memberRes = response.get_member_info;
            const URL = serviceUrls.get_member_delegation_tab;
            getMemberInformation("10559028300", URL);
          } else if (URL == "/get_member_delegation_tab") {
            history.push({
              pathname: "/MemberInformation",
              state: { 'memInfoData': memberRes, 'memDeleData': response.get_member_delegation, 'subscriberId' : subscriberId},
            });
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        setContent("Internal Error");
        setSearchDialogOpen(true);
      });
  };

  useEffect(() => {
    setCount(memberData && memberData.length > 0 ? memberData.length : 0);
  }, [memberData, history]);

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <div class="input">
          <MaterialTable
            key={count}
            class="input"
            localization={{
              body: {
                emptyDataSourceMessage: (
                  <div
                    style={{
                      color: "#A71930",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {/* {noData}{" "} */}
                  </div>
                ),
              },
            }}
            onRowClick={(event, rowData, togglePanel) =>
              handleClick(rowData)
            }
            autoHeight={true}
            icons={tableIcons}
            data={memberData}
            // loading={loading}
            // isLoading={loading}
            tableRef={tableRef}
            options={{
              detailPanelType: "single",
              selection: false,
              maxBodyHeight: "40vh",
              overflowY: "hidden !important",
              // exportButton: true,
              padding: "dense",
              // pageSize: 10,
              filtering: false,
              search: true,
              pageSize: count < 10 ? parseInt(count) + 1 : 10,
              pageSizeOptions: [
                5,
                10,
                20,
                { value: count > 0 ? count : 1, label: "All" },
              ],
              searchFieldStyle: {
                padding: "0px 0px 0px 10px",
                margin: "0px 0 0 0 ",
                disableUnderline: true,
                border: "0.5px solid #A19D9D",
                height: "100%",
                width: "18rem",
                borderRadius: "4px"
              },
              showTitle: false,
              toolbar: true,
              doubleHorizontalScroll: false,
              headerStyle: {
                whiteSpace: "nowrap",
                position: "sticky",
                fontWeight: 700,
                fontSize: commonFontSizes.bodyTwo + "rem",
                color: "#2C2B2C",
                borderTop: "0.0625em solid lightgray",
                // height:"45px"
              },
              filterRowStyle: {
                left: "0",
                position: "sticky",
                top: 43,
                background: "#fff",
                padding: "0.3em",
                width: "100%",
                zIndex: 1 /* optionally */,
              },
              cellStyle: {
                whiteSpace: "nowrap",
                fontSize: commonFontSizes.bodyTwo + "rem",
                zIndex: 2,
                cursor: "no-drop",
                fontWeight: 400
              },
              rowStyle: (row) => {
                const id = row.tableData.id;
                return id % 2 === 0
                  ? { backgroundColor: "#F5F5F5" }
                  : { backgroundColor: "#fff" };
              },
            }}

            columns={[
              {
                title: "Subscriber ID",
                field: "Subscriber_id",
                cellStyle: {
                  textDecoration: "underline",
                  color: "#555151",
                  fontSize: commonFontSizes.bodyTwo + "rem",
                  fontWeight: 600
                },
                render: (rowData) => (
                  <RenderValue value={rowData.Subscriber_id} onClick={() => handleClick(rowData)} />
                ),
              },
              {
                title: "Medicaid ID",
                field: "Medicaid_id",
                cellStyle: {
                  color: "#555151",
                  fontSize: commonFontSizes.bodyTwo + "rem",
                  fontWeight: 400
                },
                render: (rowData) => (
                  <RenderValue value={rowData.Medicaid_id} />
                ),
              },
              {
                title: "First Name",
                field: "First_name",
                cellStyle: {
                  color: "#555151",
                  fontSize: commonFontSizes.bodyTwo + "rem",
                  fontWeight: 400
                },
                render: (rowData) => (
                  <RenderValue value={rowData.First_name} />
                ),
              },
              {
                title: "Last Name",
                field: "Last_name",
                cellStyle: {
                  color: "#555151",
                  fontSize: commonFontSizes.bodyTwo + "rem",
                  fontWeight: 400
                },
                render: (rowData) => (
                  <RenderValue value={rowData.Last_name} />
                ),
              },
              {
                title: "Date Of Birth",
                field: "Dob",
                cellStyle: {
                  color: "#555151",
                  fontSize: commonFontSizes.bodyTwo + "rem",
                  fontWeight: 400
                },
                render: (rowData) => (
                  <RenderValue value={rowData.Dob} />
                ),
              },
            ]}
          />
        </div>
      </MuiThemeProvider>
      {loading && <Loader />}
      {searchDialogOpen && <SearchDialog handleSearchDialog={handleSearchDialog} handleShowMemberTable={handleShowMemberTable} content={content} flag={flag} btnContent="Ok" />}
    </div>
  );
};
export default MemberTable;
