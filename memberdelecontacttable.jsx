import { forwardRef } from "react";
import React, { useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import ViewColumn from "@material-ui/icons/ViewColumn";
import "jspdf-autotable";
import { TablePagination, IconButton, Grid, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { commonFontSizes } from "../../css/FontSizes";
import { DelegatedContactData, AdDelegateContactData, memberDelegatedContactData } from "../../../constants/memberData";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { searchButtonStyles } from "../../css/SearchButtonStyles";
import { useStyles } from "../../css/MemberDetails";
import AssignDeleDialog from "../../common/AssignDeleDialog";
import AssignDeleTableDialog from "../../common/AssignDeleTableDialog";
import { Loader } from "../../common/Loader";
import { serviceUrls } from "../../../utils/serviceUrls";
import { requestWrapper } from "../../../utils/requestWrapper";
import SearchDialog from "../../common/SearchDialog";

export const MemberDeleContactsTable = () => {

    const [data2, setData2] = useState([]);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackSev, setSnackSev] = useState("");
    const [snackMsg, setSnackMsg] = useState("");
    const tableRef = React.createRef();
    const [showDialog, setshowDialog] = useState(false);
    const [memberInfo, setMemberInfo] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addHeader, setAddHeader] = useState("");
    const [addData, setAddData] = useState("");
    const [flag, setFlag] = useState("");
    const [subId, setSubId] = useState("");
    const [rowId, setRowId] = useState("");
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [assignDeleDialogOpen, setAssignDeleDialogOpen] = useState(false);
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [showReplaceDialog, setShowReplaceDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowColors, setRowColors] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(50)
    const [noData, setNoData] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [content, setContent] = useState();
    const [rowData, setRowData] = useState("");
    const [actionFlagVal, setActionFlagVal] = useState("");
    const [responseData, setResponseData] = useState("");
    const [searchData, setSearchData] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [filterValue, setFilterValue] = useState('');

    const handleButtonSearch = (event, fieldName) => {
        if (event.keyCode == 13 && event.key === "Enter") {
            setSearchData(true);
            setFilterName(fieldName);
            setFilterValue(event.target.value);
            tableRef.current.onQueryChange();
        }
    }

    const EditContactRowById = (rowData, flag) => {
        const updateMemberData = AdDelegateContactData.map((inputData) => {
            setRowId(rowData.id);
            let res = Object.values(rowData);
            if (rowData.flag === 'Add') {
                return {
                    ...inputData,
                    value: res[inputData.id - 1]
                };
            } else {
                return {
                    ...inputData,
                    value: res[inputData.id]
                };
            }
        })
        setAddData(updateMemberData);
        setFlag(flag);
        setAddHeader("Add New Contact");
        setDialogOpen(true);
    }

    const handleOpenDialog = (value, subscriberId) => {
        setFlag(value);
        setSubId(subscriberId);
        setAssignDialogOpen(true);
    }

    const handleAssignCloseDialog = () => {
        setAssignDialogOpen(false);
    }

    const handleAddRow = (rowData) => {
        setData([...resultData, rowData]);
    };

    const handleSearchDialog = () => {
        setSearchDialogOpen(false);
    }

    const handleShowMemberTable = (res) => {
        //console.log('res::', res);
        if (res == 'Error' || res == 'NoData') {
            setSearchDialogOpen(false);
        } else if (res == 'N') {
            tableRef.current.onQueryChange();
            setSearchDialogOpen(false);
        } else if (res == 'Y') {
            setContent("Member already has a contact assigned. Do you wish to deactivate the existing contact and activate this instead?");
            setActionFlagVal('NE');
            setSearchDialogOpen(true);
        }
    }

    const handleBlockRow = (rowData) => {
        setRowData(rowData);
        setActionFlagVal('NE');
        setSearchDialogOpen(true);
        if (rowData.Record_Active == 'Y') {
            setContent('Do you confirm to deactivate the contact?')
        } else {
            setContent('Do you confirm to activate the contact?')
        }
    }

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <div class="tableContainer1">
                    <MaterialTable
                        // key={count}
                        title="dmc"
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
                                        {noData}{" "}
                                        {/* No Data Found {""} */}
                                    </div>
                                ),
                            },
                        }}
                        autoHeight={true}
                        icons={tableIcons}
                        // data={resultData}
                        tableRef={tableRef}
                        options={{
                            detailPanelType: "single",
                            selection: false,
                            maxBodyHeight: "45vh",
                            overflowY: "hidden !important",
                            padding: "dense",
                            filtering: resultData.length > 0 ? true : false,
                            search: false,
                            pagination: true,
                            paginationPosition: 'bottom',
                            pageSize: pageSize,
                            pageSizeOptions: [5, 10, 50],
                            searchFieldStyle: {
                                padding: "0px 0px 0px 10px",
                                margin: "0px 0 0 0 ",
                                disableUnderline: true,
                                border: "0.5px solid #A19D9D",
                                height: "100%",
                                width: "18rem",
                                borderRadius: "4px"
                            },
                            rowStyle: (row) => {
                                const id = row.id;
                                const active = row.Record_Active;
                                //console.log('row::', id)
                                if (active == 'N') {
                                    return { color: 'lightgrey' };
                                } else if (rowColors[id]) {
                                    //console.log('if::', rowColors[id], '  ', id)
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
                                title: "Delegate",
                                field: "Delegate",
                                filtering: resultData.length > 0 ? true : false,
                                cellStyle: {
                                    // color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 160,
                                    maxWidth: 160,
                                },
                                filterComponent: (props) => <TextField
                                    style={{ height: "2rem", width: '10rem' }}
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
                                    onKeyDown={(event) => { handleButtonSearch(event, "Delegate") }}
                                />,

                                render: (rowData) => (
                                    <RenderValue value={rowData.Delegate ? rowData.Delegate : "-"} />
                                ),
                            },
                            {
                                title: "Contact Type",
                                field: "Contact_type",
                                filtering: resultData.length > 0 ? true : false,
                                cellStyle: (e, rowData) => {
                                    if (rowData.Contact_idn) {
                                        if (rowData.Record_Active == 'Y') {
                                            return {
                                                color: "#555151",
                                                fontSize: commonFontSizes.bodyTwo + "rem",
                                                fontWeight: 400,
                                                minWidth: 190,
                                                maxWidth: 190,
                                            };
                                        } else {
                                            return {
                                                color: "lightgrey",
                                                fontSize: commonFontSizes.bodyTwo + "rem",
                                                fontWeight: 400,
                                                minWidth: 190,
                                                maxWidth: 190,
                                            };
                                        }
                                    } else {
                                        return {
                                            color: "#A71930",
                                            fontSize: commonFontSizes.bodyTwo + "rem",
                                            fontWeight: 400,
                                            minWidth: 190,
                                            maxWidth: 190,
                                        };
                                    }
                                },
                                filterComponent: (props) => <TextField
                                    style={{
                                        height: "2rem", width: '10rem'
                                    }}
                                    type="search"
                                    placeholder='Search'
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" style={{ paddingRight: '6px' }}>
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    onKeyDown={(event) => { handleButtonSearch(event, "Contact_type") }}
                                />,

                                render: (rowData) => (
                                    <RenderValue value={rowData.Contact_type ? rowData.Contact_type : "Unassigned"} />
                                ),
                            },
                            {
                                title: "Contact Name",
                                field: "Contact_name",
                                filtering: resultData.length > 0 ? true : false,
                                cellStyle: (e, rowData) => {
                                    if (rowData.Contact_idn) {
                                        if (rowData.Record_Active == 'Y') {
                                            return {
                                                color: "#555151",
                                                fontSize: commonFontSizes.bodyTwo + "rem",
                                                fontWeight: 400,
                                                minWidth: 190,
                                                maxWidth: 190,
                                            };
                                        } else {
                                            return {
                                                color: "lightgrey",
                                                fontSize: commonFontSizes.bodyTwo + "rem",
                                                fontWeight: 400,
                                                minWidth: 190,
                                                maxWidth: 190,
                                            };
                                        }
                                    } else {
                                        return {
                                            color: "#A71930",
                                            fontSize: commonFontSizes.bodyTwo + "rem",
                                            fontWeight: 400,
                                            minWidth: 160,
                                            maxWidth: 160,
                                        };
                                    }
                                },
                                filterComponent: (props) => <TextField
                                    style={{
                                        height: "2rem", minWidth: 130,
                                        maxWidth: 130,
                                    }}
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
                                    onKeyDown={(event) => { handleButtonSearch(event, "Contact_name") }}
                                />,

                                render: (rowData) => (
                                    <RenderValue value={rowData.Contact_name ? rowData.Contact_name : "Unassigned"} />
                                ),
                            },
                            {
                                title: "Cell Phone",
                                field: "Cell_phone",
                                filtering: false,
                                cellStyle: {
                                    //  color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    // minWidth: 140,
                                    // maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Cell_phone ? rowData.Cell_phone : "-"} />
                                ),
                            },
                            {
                                title: "Work Phone",
                                field: "Work_phone",
                                filtering: false,
                                cellStyle: {
                                    // color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    // minWidth: 140,
                                    // maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Work_phone ? rowData.Work_phone : "-"} />
                                ),
                            },
                            {
                                title: "Email",
                                field: "Email",
                                filtering: false,
                                cellStyle: {
                                    // color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    // minWidth: 140,
                                    // maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Email ? rowData.Email : "-"} />
                                ),
                            },
                            {
                                title: "Preferred",
                                field: "Preferred",
                                filtering: false,
                                cellStyle: {
                                    //    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 140,
                                    maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Preferred ? rowData.Preferred : "-"} />
                                ),
                            },
                            {
                                title: "Action",
                                field: "Record_Active",
                                filtering: false,
                                cellStyle: {
                                    //  color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 150,
                                    maxWidth: 150,
                                },
                                render: (rowData) => {
                                    if (rowData.Contact_idn) {
                                        return (
                                            <div style={{ dispaly: "flex" }}>
                                                <IconButton
                                                    style={{ padding: "0px 6px 0px 2px" }}
                                                    aria-label="edit"
                                                    onClick={() => { rowData.Record_Active == 'Y' && handleOpenDialog("REPLACE", rowData.Subscriber_id) }}
                                                >
                                                    <Button style={{ textTransform: 'capitalize', fontWeight: "700", cursor: "default" }} className={rowData.Record_Active == 'Y' ? classes.enableIcon : classes.disableIcon} >Replace</Button>
                                                </IconButton>
                                                <span>|</span>
                                                <IconButton
                                                    style={{ padding: "0px 6px 0px 8px" }}
                                                    aria-label="edit"
                                                    onClick={() => { handleBlockRow(rowData) }}
                                                >
                                                    {rowData.Record_Active == 'Y' ?
                                                        <span class="material-symbols-outlined e7fe" style={{ color: '#861426', cursor: "pointer", fontSize: "1.2rem" }}>
                                                            person_off
                                                    </span> :
                                                        <span class="material-symbols-outlined e7fe" style={{ color: '#861426', cursor: "pointer", fontSize: "1.2rem" }}>
                                                            person_add
                                                    </span>
                                                    }
                                                </IconButton>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div style={{ dispaly: "flex" }}>
                                                <IconButton
                                                    style={{ padding: "0px 6px 0px 2px" }}
                                                    aria-label="edit"
                                                >
                                                    <Button style={{ textTransform: 'capitalize', fontWeight: "bold", color: "#A71930", cursor: "pointer" }}
                                                        onClick={() => { handleOpenDialog("ASSIGN", rowData.Subscriber_id) }}
                                                    >Assign</Button>
                                                </IconButton>
                                            </div>
                                        );
                                    }
                                }
                            },
                        ]}

                        data={query =>
                            new Promise((resolve, pend) => {
                                if (searchData == true) {
                                    var filter_obj = {
                                        Filtered_field: filterName,
                                        Filtered_value: filterValue,
                                        Per_page: query.pageSize,
                                        Page: (query.page + 1)
                                    }
                                } else {
                                    var filter_obj = {
                                        Filtered_field: "",
                                        Filtered_value: "",
                                        Per_page: query.pageSize,
                                        Page: (query.page + 1)
                                    }
                                }

                                //console.log('filter_obj::', filter_obj)
                                setLoading(true);
                                requestWrapper(serviceUrls.get_manage_member_contact, {
                                    method: "POST",
                                    headers: {
                                        "Content-type": "application/json",
                                    },
                                    data: filter_obj,
                                })
                                    .then((response) => {
                                        //console.log('response::',response)
                                        setLoading(false);
                                        const ErrorCode = response.system.properties.code.example;
                                        const ErrorMsg = response.system.properties.message.example;
                                        // console.log('ErrorCode::',ErrorCode,' ',ErrorMsg)
                                        if (ErrorCode == 500) {
                                            setPageSize(0);
                                            setResultData("");
                                            setNoData("Internal Error");
                                            resolve({
                                                data: [],
                                                page: 0,
                                                totalCount: 0,
                                            })
                                        } else if (ErrorCode == 200) {
                                            if (ErrorMsg == "No Data Found") {
                                                setPageSize(0);
                                                setResultData("");
                                                setNoData("No Data Found");
                                                resolve({
                                                    data: [],
                                                    page: 0,
                                                    totalCount: 0,
                                                })
                                            } else {
                                                setPageSize(query.pageSize)
                                                setResultData(response.details);
                                                resolve({
                                                    data: response.details,
                                                    page: response.Page - 1,
                                                    totalCount: response.Total,
                                                })
                                            }
                                        }
                                    })
                                    .catch((error) => {
                                        setPageSize(0);
                                        setLoading(false);
                                        setNoData("Internal Error");
                                        resolve({
                                            data: [],
                                            page: 0,
                                            totalCount: 0,
                                        })
                                    });
                            })
                        }  
                    />
                    {assignDialogOpen && <AssignDeleTableDialog flag={flag} subId={subId} handleCloseDialog={handleCloseDialog} />}
                    {searchDialogOpen && <SearchDialog rowData={rowData} handleSearchDialog={handleSearchDialog} handleShowMemberTable={handleShowMemberTable} content={content} flag={actionFlagVal} btnContent="Ok" />}
                </div>
            </MuiThemeProvider>
        </div>
    );
};
export default MemberDeleContactsTable;
