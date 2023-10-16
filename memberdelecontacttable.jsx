import { forwardRef } from "react";
import React, { useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import "jspdf-autotable";
import { TablePagination, IconButton, Grid, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { commonFontSizes } from "../../css/FontSizes";
import { DelegatedContactData, AdDelegateContactData } from "../../../constants/memberData";
import { memberDelegatedContactData } from "../../../constants/memberData";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { searchButtonStyles } from "../../css/SearchButtonStyles";
import { useStyles } from "../../css/MemberDetails";
import AssingDeleDialog from "../../pages/DelegatedContacts/AssignDeleDialog";
import AssignDeleTableDialog from "../../pages/DelegatedContacts/AssignDeleTableDialog";

const drawerWidth = 200;

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight style={{ color: "#A71930" }} {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),

    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};
function RenderValue(props) {
    return (
        <div>{props.value === " " || props.value === null ? "-" : props.value}</div>
    );
}
const theme = createMuiTheme({
    overrides: {
        MuiToolbar: {
            regular: {
                height: "2.937em",
                minHeight: "0.625em",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                "@media(max-width:37.5em)": {
                    minHeight: "fit-content",
                    height: "fit-content",
                },
            },
        },
        MuiInput: {
            underline: {
                "&&&:before": {
                    borderBottom: "none",
                },
                "&&&:after": {
                    borderBottom: "none",
                },
                "&&&:not(.Mui-disabled):hover::before": {
                    borderBottom: "none",
                },
            },
        },
    },
});

export const MemberDeleContactsTable = () => {
    const spanStyle = {
        fontFamily: "Material Symbols Outlined, sans-serif",
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
    }
    const [tableData, setData] = useState(memberDelegatedContactData);
    const [data2, setData2] = useState([]);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackSev, setSnackSev] = useState("");
    const [snackMsg, setSnackMsg] = useState("");
    const tableRef = React.createRef();
    const [showDialog, setshowDialog] = useState(false);
    const [count, setCount] = useState(tableData && tableData.length > 0 ? tableData.length : 0);
    const [memberInfo, setMemberInfo] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addHeader, setAddHeader] = useState("");
    const [addData, setAddData] = useState("");
    const [flag, setFlag] = useState("");
    const [rowId, setRowId] = useState("");
    const classes = useStyles();
    const classes1 = searchButtonStyles();

    let nullObject = null;
    let data1 = {};
    let noData1 = "";

    const history = useHistory();

    const getPageSizeOptions = () => {
        return [5, 10];
    };

    const AddNewLevel = (flag) => {
        setAddData(AdDelegateContactData);
        setFlag(flag);
        setAddHeader("Add New Contact");
        setDialogOpen(true);
    }

    const handleCloseDialog = (memberFormData, flag, RowId) => {
        setDialogOpen(false);
        if (flag === 'edit') {
            if (memberFormData) {
                const updatedData = tableData.map(item => {
                    if (item.id === RowId) {
                        const id = RowId;
                        return { ...memberFormData, id }; //Replace row with new data and same id
                    }
                    return item;
                });
                setData(updatedData);
                setDialogOpen(false);
            } else {
                setDialogOpen(false);
            }
        } else {
            if (memberFormData) {
                setData([...tableData, memberFormData]);
                setDialogOpen(false);
            } else {
                setDialogOpen(false);
            }
        }
    }

    const replaceRowById = (rowData) => {
        const newData =
        {
            Delegate: "new 1",
            Contact_Type: "new 1",
            Contact_Name: "new 1",
            Cell_Phone: "new 1",
            Work_Phone: "new 1",
            Email: "new 1",
            Preferred: "new 1",
        };

        const updatedData = tableData.map(item => {
            if (item.id === rowData.id) {
                const id = rowData.id;
                return { ...newData, id }; //Replace row with new data and same id
            }
            return item;
        });
        setData(updatedData);
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

    useEffect(() => {
        setCount(tableData && tableData.length > 0 ? tableData.length : 0);
    }, []);

    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [assignDeleDialogOpen, setAssignDeleDialogOpen] = useState(false);
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [showReplaceDialog, setShowReplaceDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowColors, setRowColors] = useState("");

    const handleDialog = () => {
        setAssignDialogOpen(true);
    }

    // function handleDeleDialog() {
    //     setAssignDeleDialogOpen(true);
    // }

    const handleOpenDialog = (rowData) => {
        setSelectedRow(rowData);
        setAssignDeleDialogOpen(true);
    }

    const handleAssignCloseDialog = () => {
        setAssignDialogOpen(false);
    }

    const handleAddRow = (rowData) => {
        console.log("which row", rowData);
        setData([...tableData, rowData]);
    };

    // Replace logic
    const handleReplaceRow = (rowData) => {
        //Replace the selected row in your tableData state with the rowData from the popup table
        const updatedTableData = tableData.map((item) => {
            if (item.id === rowData.id) {
                return rowData;
            } else {
                return item;
            }
        });
        setData(updatedTableData);
        setAssignDeleDialogOpen(false);
    }
   

    const handleBlockRow = (rowData) => {
        //console.log('idhandle::', rowData.id, ' ', rowData.enableEditIcon);
        const id = rowData.id - 1;
        if (rowData.enableEditIcon === false) {
            setRowColors((prevRowColors) => ({
                ...prevRowColors,
                [id]: "rgba(0, 0, 0, 0.38)"
            }));
            const updatedData = tableData.map((item) =>
                item.tableData.id === id ? { ...item, enableEditIcon: true } : item
            );
            //console.log('res::', updatedData)
            setData(updatedData);
        } else {
            //console.log('else')
            setRowColors((prevRowColors) => ({
                ...prevRowColors,
                [id]: "#555151"
            }));
            const updatedData = tableData.map((item) =>
                item.tableData.id === id ? { ...item, enableEditIcon: false } : item
            );
            // console.log('res::', updatedData)
            setData(updatedData);
        }
    }

    return (
        <div>
            <MuiThemeProvider theme={theme}>
                <div class="tableContainer1">
                    <MaterialTable
                        key={count}
                        title="Claims"
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
                        data={tableData}
                        tableRef={tableRef}
                        options={{
                            detailPanelType: "single",
                            selection: false,
                            maxBodyHeight: "45vh",
                            overflowY: "hidden !important",
                            padding: "dense",
                            filtering: true,
                            search: false,
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
                            },
                            filterRowStyle: {
                                left: "0",
                                position: "sticky",
                                top: 43,
                                background: "#fff",
                                padding: "0.3em",
                                width: "100%",
                                zIndex: 1,
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
                                console.log('id::', id)
                                if (rowColors[id]) {
                                  console.log('if::', rowColors[id], '  ', id)
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
                                title: "Subscriber ID",
                                field: "SubscriberID",
                                filtering: true,
                                cellStyle: {
                                    // textDecoration: "underline",
                                    //color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 160,
                                    maxWidth: 160,
                                },
                                filterComponent: (props) => <TextField
                                    style={{ height: "2rem" }}
                                    type="search"
                                    placeholder='Search'
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" >
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={(event) => {
                                        props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
                                    }}
                                />,
                                render: (rowData) => (
                                    <RenderValue value={rowData.SubscriberID} />
                                ),
                            },
                            {
                                title: "Jiva Member ID",
                                field: "JivaMemberID",
                                filtering: true,
                                cellStyle: {
                                  //  color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 160,
                                    maxWidth: 160,
                                },
                                filterComponent: (props) => <TextField
                                    style={{ height: "2rem" }}
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
                                    <RenderValue value={rowData.JivaMemberID} />
                                ),
                            },
                            {
                                title: "Member First Name",
                                field: "MemberFirstName",
                                filtering: true,
                                cellStyle: {
                                   // color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 160,
                                    maxWidth: 160,
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
                                    onChange={(event) => {
                                        props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
                                    }}
                                />,
                                render: (rowData) => (
                                    <RenderValue value={rowData.MemberFirstName} />
                                ),
                            },
                            {
                                title: "Member Last Name",
                                field: "MemberLastName",
                                filtering: true,
                                cellStyle: {
                                  //  color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 160,
                                    maxWidth: 160,
                                },
                                filterComponent: (props) => <TextField
                                    style={{
                                        height: "2rem", minWidth: 130,
                                        maxWidth: 130
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
                                    onChange={(event) => {
                                        props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
                                    }}
                                />,
                                render: (rowData) => (
                                    <RenderValue value={rowData.MemberLastName} />
                                ),
                            },
                            {
                                title: "Delegate",
                                field: "Delegate",
                                filtering: true,
                                cellStyle: {
                                   // color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 160,
                                    maxWidth: 160,
                                },
                                filterComponent: (props) => <TextField
                                    style={{ height: "2rem" }}
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
                                    <RenderValue value={rowData.Delegate} />
                                ),
                            },
                            {
                                title: "Contact Type",
                                field: "Contact_Type",
                                filtering: true,
                                cellStyle: {
                                  //  color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 190,
                                    maxWidth: 190,
                                },
                                filterComponent: (props) => <TextField
                                    style={{
                                        height: "2rem", minWidth: 130,
                                        maxWidth: 130
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
                                    onChange={(event) => {
                                        props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
                                    }}
                                />,

                                render: (rowData) => (
                                    <RenderValue value={rowData.Contact_Type} />
                                ),
                            },
                            {
                                title: "Contact Name",
                                field: "Contact_Name",
                                filtering: true,
                                cellStyle: {
                                   // color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 160,
                                    maxWidth: 160,
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
                                    onChange={(event) => {
                                        props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
                                    }}
                                />,

                                render: (rowData) => (
                                    <RenderValue value={rowData.Contact_Name} />
                                ),
                            },
                            {
                                title: "Cell Phone",
                                field: "Cell_Phone",
                                filtering: false,
                                cellStyle: {
                                  //  color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 140,
                                    maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Cell_Phone} />
                                ),
                            },
                            {
                                title: "Work Phone",
                                field: "Work_Phone",
                                filtering: false,
                                cellStyle: {
                                   // color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 140,
                                    maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Work_Phone} />
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
                                    minWidth: 140,
                                    maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Email} />
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
                                    <RenderValue value={rowData.Preferred} />
                                ),
                            },
                            {
                                title: "Action",
                                field: "Action",
                                filtering: false,
                                cellStyle: {
                                  //  color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 150,
                                    maxWidth: 150,
                                },
                                render: (rowData) => {
                                    if(rowData.Contact_Type === 'Unassigned'){
                                        return  (
                                            <div style={{ dispaly: "flex" }}>
                                                 <IconButton
                                            style={{ padding: "0px 6px 0px 2px" }}
                                            aria-label="edit"
                                        >
                                            <Button style={{ textTransform: 'capitalize', fontWeight: "bold", color: "#A71930" }} onClick={() => handleOpenDialog(rowData)}>Assign</Button>
                                        </IconButton>
                                            </div>
                                        );
                                    } else{
                                        return (
                                            <div style={{ dispaly: "flex" }}>
                                            <IconButton
                                                style={{ padding: "0px 6px 0px 2px" }}
                                                aria-label="edit"
                                                // onClick={() =>{ handleOpenDialog(rowData) && rowData.enableEditIcon == false}}
                                                onClick={() => {
                                                    if(rowData.enableEditIcon == false) {
                                                        handleOpenDialog(rowData)
                                                    }
                                                }}
                                            >
                                                <Button style={{ textTransform: 'capitalize', fontWeight: "700" }} className={rowData.enableEditIcon == false ? classes.enableIcon : classes.disableIcon}  >Replace</Button>
                                            </IconButton>
                                            <span>|</span>
                                            <IconButton
                                                style={{ padding: "0px 6px 0px 8px" }}
                                                aria-label="edit"
                                                onClick={() => {
                                                    handleBlockRow(rowData)
                                                }}
                                            >
                                                {rowData.enableEditIcon == false ?
                                                    <span class="material-symbols-outlined e7fe" style={{ color: '#861426', width: "1.2rem", height: "1.2rem", cursor: "pointer", fontSize: 1.25rem }}>
                                                        person_off
                                                    </span> :
                                                    <span class="material-symbols-outlined e7fe" style={{ color: '#861426', width: "1.2rem", height: "1.2rem", cursor: "pointer", fontSize: 1.25rem }}>
                                                        person_add
                                                    </span>
                                                }
                                            </IconButton>
                                        </div>
                                        );
                                       
                                    }
                                }   
                            },
                        ]}

                        components={{
                            Toolbar: (props) => (
                                <Grid container style={{ height: "3.2rem" }}>
                                    <Grid item xs={12} style={{ textAlign: "end", padding: "0.5rem" }}>
                                        <Button className={classes1.searchbuttonEnable} style={{ textTransform: "none", width: "9rem", borderRadius: '0px', backgroundColor: "#217e76" }}
                                            onClick={handleDialog}
                                            variant="contained"
                                        >
                                            Assign Contact
                                        </Button>
                                        <div style={{ width: "13rem" }}>
                                            <MTableToolbar {...props} />
                                        </div>
                                    </Grid>
                                </Grid>
                            ),
                            Pagination: (props) => (
                                <div style={{ borderTop: "1px solid lightgrey" }}>
                                    <TablePagination
                                        {...props}
                                        style={{
                                            backgroundColor: "",
                                            float: "right",
                                            maxHeight: "2.8rem",
                                            overflow: "hidden",
                                            paddingBottom: "0.5rem"
                                        }}
                                        rowsPerPageOptions={getPageSizeOptions()}
                                    />
                                </div>
                            ),
                        }}
                    />
                    {/* {assignDialogOpen && <AssingDeleDialog handleAssignCloseDialog={handleAssignCloseDialog} handleAddRow={handleAddRow} dialogSelectedRow={selectedRow} />} */}
                    {assignDialogOpen && <AssignDeleTableDialog handleDeleTableClose={() => setAssignDeleDialogOpen(false)}
                        handleAddRow={handleAddRow} handleReplaceRow={handleReplaceRow}
                    />}
                    {assignDeleDialogOpen && <AssignDeleTableDialog flag="replace" handleDeleTableClose={() => setAssignDeleDialogOpen(false)}
                        handleAddRow={handleAddRow} handleReplaceRow={handleReplaceRow}
                    />}

                </div>
            </MuiThemeProvider>
        </div>
    );
};
export default MemberDeleContactsTable;
