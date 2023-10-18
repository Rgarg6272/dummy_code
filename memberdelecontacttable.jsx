import { forwardRef } from "react";
import React, { useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
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

    const handleButtonSearch = (event) => {
        if (event.target.innerText === "Search" || event.key === "Enter"){
            console.log("button is working")
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
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 170,
                                    maxWidth: 170,
                                },
                                filterComponent: (props) => <TextField
                                    style={{ height: "2rem" }}
                                    type="search"
                                    placeholder='Search'
                                    variant="outlined"
                                    onKeyDown={handleButtonSearch}
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
                                    // <RenderValue value={rowData.Contact_Type} />
                                    <span style={{ color: rowData.Contact_Type === "Unassigned" ? "#a71930" : "" }}>
                                        {rowData.Contact_Type}
                                    </span>
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
                                    // <RenderValue value={rowData.Contact_Type} />
                                    <span style={{ color: rowData.Contact_Name === "Unassigned" ? "#a71930" : "" }}>
                                        {rowData.Contact_Name}
                                    </span>
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
                                title: "Record Active",
                                field: "Record_Active",
                                filtering: false,
                                cellStyle: {
                                    //    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 140,
                                    maxWidth: 140,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Record_Active} />
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
                                    if (rowData.Contact_Type === 'Unassigned') {
                                        return (
                                            <div style={{ dispaly: "flex" }}>
                                                <IconButton
                                                    style={{ padding: "0px 6px 0px 2px" }}
                                                    aria-label="edit"
                                                >
                                                    <Button style={{ textTransform: 'capitalize', fontWeight: "bold", color: "#A71930" }} onClick={() => handleOpenDialog(rowData)}>Assign</Button>
                                                </IconButton>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div style={{ dispaly: "flex" }}>
                                                <IconButton
                                                    style={{ padding: "0px 6px 0px 2px" }}
                                                    aria-label="edit"
                                                    // onClick={() =>{ handleOpenDialog(rowData) && rowData.enableEditIcon == false}}
                                                    onClick={() => {
                                                        if (rowData.enableEditIcon == false) {
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
                                                        <span class="material-symbols-outlined e7fe" style={{ color: '#861426', width: "1.2rem", height: "1.2rem", cursor: "pointer", fontSize: "1.25rem" }}>
                                                            person_off
                                                    </span> :
                                                        <span class="material-symbols-outlined e7fe" style={{ color: '#861426', width: "1.2rem", height: "1.2rem", cursor: "pointer", fontSize: "1.25rem" }}>
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
                    />
                </div>
            </MuiThemeProvider>
        </div>
    );
};
export default MemberDeleContactsTable;
