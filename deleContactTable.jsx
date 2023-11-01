import { forwardRef } from "react";
import React, { useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import "jspdf-autotable";
import { TablePagination, IconButton, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CsvBuilder } from "filefy";
import jsPDF from "jspdf";
import { commonFontSizes } from "../../css/FontSizes";
import { DelegatedContactData, AdDelegateContactData } from "../../../constants/memberData";
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { searchButtonStyles } from "../../css/SearchButtonStyles";
import { useStyles } from "../../css/MemberDetails";
import AddNewCareDialog from "../../common/AddNewCareDialog";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Person_Add from '../../../assets/Person_Add.png';
import Person_Off from '../../../assets/Person_Off.png';
import { Loader } from "../../common/Loader";
import { serviceUrls } from "../../../utils/serviceUrls";
import { requestWrapper } from "../../../utils/requestWrapper";
import SearchDialog from "../../common/SearchDialog";

export const DeleContactsTable = () => {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSev, setSnackSev] = useState("");
  const [snackMsg, setSnackMsg] = useState("");
  const tableRef = React.createRef();
  const [showDialog, setshowDialog] = useState(false);
  const [noData, setNoData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [count, setCount] = useState("");
  const [memberInfo, setMemberInfo] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addHeader, setAddHeader] = useState("");
  const [addData, setAddData] = useState("");
  const [rowColors, setRowColors] = useState("");
  const [flag, setFlag] = useState("");
  const [rowId, setRowId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [content, setContent] = useState();
  const [actionFlagVal, setActionFlagVal] = useState('');
  const [rowData, setRowData] = useState("");
  const [activateV, setActivateV] = useState(false);
  const [contactIdn, setContactIdn] = useState("");
  const [viewDeleRes, setViewDeleRes] = useState("");

  const [isDisabled, setDisabled] = useState(false);

  const classes = useStyles();
  const classes1 = searchButtonStyles();

  let nullObject = null;
  let data1 = {};
  let noData1 = "";
  var role;

  const history = useHistory();

  role = "DMC View";

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };
  const getPageSizeOptions = () => {
    if (count <= 5) {
      return [count];
    } else if (count <= 10) {
      return [5, count];
    } else if (count <= 20) {
      return [5, 10, count];
    } else {
      return [5, 10, 20, count];
    }
  };

  const AddNewLevel = (flag) => {
    const updateMemberData = AdDelegateContactData.map((inputData) => {
      return {
        ...inputData,
        value: ""
      };
    })
    setAddData(updateMemberData);
    setFlag(flag);
    setAddHeader("Add New Contact");
    setDialogOpen(true);
  }

  const handleCloseDialog = (resFlag) => {
    if (resFlag == 'Y') {
      setDialogOpen(false);
      setSearchDialogOpen(false);
      getAssignContact();
    } else if (resFlag == 'N') {
      setDialogOpen(false);
      setActionFlagVal('A');
      setContent('A contact already exists with the same name under the same delegated entity. So cannot activate a dupliate one.')
      setSearchDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }

  const EditContactRowById = (rowData, flag) => {
    const updateMemberData = AdDelegateContactData.map((inputData) => {
      setRowId(rowData.id);
      let res = Object.values(rowData);
      if (inputData.name == 'Delegate') {
        return {
          ...inputData,
          DelegateLevelOptions: viewDeleRes,
          value: res[inputData.id + 1]
        };
      } else {
        return {
          ...inputData,
          value: res[inputData.id + 1]
        };
      }
    })
    setAddData(updateMemberData)
    setFlag(flag);
    setContactIdn(rowData.Contact_idn)
    setAddHeader("Edit Contact");
    setDialogOpen(true);
  }

  const handleBlockRow = (rowData) => {
    setRowData(rowData);
    setActionFlagVal('NE');
    setActivateV(true);
    if (rowData.Record_active == 'N') {
      setContent('Do you confirm to activate the contact?')
    } else {
      setContent('Do you confirm to deactivate the contact?')
    }
    setSearchDialogOpen(true);
  }

  const handleSearchDialog = (res) => {
    setSearchDialogOpen(false);
  }

  const handleShowMemberTable = (flagRes, val) => {
    //console.log('flagRes:',flagRes)
    if (flagRes == 'N') {
      setSearchDialogOpen(false);
      getAssignContact();
    } else if (flagRes == 'Y') {
      setSearchDialogOpen(false);
      showWarningPopup();
    } else {
      setSearchDialogOpen(false);
    }
  }

  useEffect(() => {
    getAssignContact();
    if (role == 'DMC Update') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [role]);

  const getAssignContact = () => {
    setLoading(true);
    var filter_obj = {
      Subscriber_id: ''
    }
    requestWrapper(serviceUrls.get_assign_contact_search, {
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
          setResultData([]);
          setNoData("Internal Error");
        } else if (ErrorCode == 200) {
          if (ErrorMsg == "No Data Found") {
            setResultData([]);
            setNoData("No Data Found");
          } else {
            setCount(response.get_assign_contact && response.get_assign_contact.length > 0 ? response.get_assign_contact.length : 0);
            setResultData(response.get_assign_contact);
            setLoading(true);
            getDelegateDetails();
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        setNoData("Internal Error");
      });
  }

  const getDelegateDetails = () => {
    setLoading(true);
    var filter_obj = {
      Offset: 0,
      Limit: 100
    }
    requestWrapper(serviceUrls.view_delegate_details, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: filter_obj,
    })
      .then((response) => {
        console.log('response:', response.get_delegate_details);
        setLoading(false);
        const ErrorCode = response.system.properties.code.example;
        const ErrorMsg = response.system.properties.message.example;
        if (ErrorCode == 500) {
          //setNoData("Internal Error");
        } else if (ErrorCode == 200) {
          if (ErrorMsg == "No Data Found") {
          } else {
            setViewDeleRes(response.get_delegate_details)
          }
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <div class="tableContainer1">
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
                  </div>
                ),
              },
            }}
            autoHeight={true}
            icons={tableIcons}
            data={resultData}
            tableRef={tableRef}
            options={{
              detailPanelType: "single",
              selection: false,
              maxBodyHeight: "30vh",
              overflowY: "hidden !important",
              padding: "dense",
              filtering: resultData.length > 0 ? true : false,
              search: false,
              pagination: true,    
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
              },
              rowStyle: (row) => {
                const id = row.id;
                const active = row.Record_active;
                if (active == 'N') {
                  return { color: 'lightgrey' };
                } else if (rowColors[id]) {
                  return { color: rowColors[id] };
                } else {
                  return id % 2 === 0
                    ? { backgroundColor: "#F5F5F5", color: "#555151" }
                    : { backgroundColor: "#fff", color: "#555151" };
                }
              },
            }}

            columns={[ 
              {
                title: "Preferred",
                field: "Preferred",
                filtering: resultData.length > 0 ? true : false,
                cellStyle: {
                  fontSize: commonFontSizes.bodyTwo + "rem",
                  fontWeight: 400,
                  minWidth: 190,
                  maxWidth: 190,
                },
                filterComponent: (props) => <TextField
                  style={{ height: "2rem", width: "100%" }}
                  type="search"
                  placeholder='Search'
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  onChange={(event) => {
                    props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
                  }}
                />,
                render: (rowData) => (
                  <RenderValue value={rowData.Preferred ? rowData.Preferred : "-"} />
                ),
              },
              {
                title: "Action",
                field: "Action",
                filtering: false,
                cellStyle: {
                  fontSize: commonFontSizes.bodyTwo + "rem",
                  fontWeight: 400
                },
                render: (rowData) => (
                  <div tyle={{ marginRight: "-1.8rem" }}>
                    <IconButton
                      style={{ padding: "0px 6px 0px 2px" }}
                      aria-label="edit"
                      onClick={() => { rowData.Record_active == 'Y' && EditContactRowById(rowData, 'EDIT') }}
                    >
                      <EditIcon className={(rowData.Record_active == 'Y') ? classes.enableIcon : classes.disableIcon} style={{ width: "1.2rem", height: "1.2rem" }} />
                    </IconButton>
                    <IconButton
                      style={{ padding: "0px 6px 0px 8px", }}
                      aria-label="edit"
                      onClick={() => {
                        handleBlockRow(rowData)
                      }}
                    >
                      {rowData.Record_active == 'Y' ?
                        <span class="material-symbols-outlined e7fe" style={{ color: '#861426', fontSize: "1.2rem", cursor: "pointer" }}>
                          person_off
                        </span> :
                        <span class="material-symbols-outlined e7fe" style={{ color: '#861426', fontSize: "1.2rem", cursor: "pointer" }}>
                          person_add
                        </span>
                      }
                    </IconButton>
                  </div>
                ),
              },
            ]}
            components={{
              Toolbar: (props) => (
                <Grid container style={{ height: "3.2rem" }}>
                  <Grid item xs={12} style={{ textAlign: "end", padding: "0.5rem" }}>
                    <Button className={classes1.searchbuttonEnable} style={{ textTransform: "none", width: "12rem" }} onClick={() => AddNewLevel('ADD')}
                      // color="primary"
                      variant="contained"
                      disabled = {isDisabled}
                    >
                      + Add New Contact
                    </Button>
                    <div style={{ width: "13rem" }}>
                      <MTableToolbar {...props} />
                    </div>
                  </Grid>
                </Grid>
              ),
            }}
          />
          {loading && <Loader />}
          {dialogOpen && (
            <AddNewCareDialog handleCloseDialog={handleCloseDialog} resultDataId={resultData.length} addData={addData} addHeader={addHeader} flag={flag} rowId={rowId} contactIdn={contactIdn} />
          )}
          {searchDialogOpen && <SearchDialog rowData={rowData} handleSearchDialog={handleSearchDialog} handleShowMemberTable={handleShowMemberTable} content={content} flag={actionFlagVal} activateV={activateV} btnContent="ok" />}
        </div>
      </MuiThemeProvider>
    </div>
  );
};
export default DeleContactsTable;
