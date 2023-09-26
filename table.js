import { forwardRef } from "react";
import React, { useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import Edit from "@material-ui/icons/Edit";
import SimpleSnackbar from "../../../common/AlertMessage";
import "jspdf-autotable";
import { TablePagination } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CsvBuilder } from "filefy";
import jsPDF from "jspdf";
import { commonFontSizes } from "../../../css/FontSizes";
import { DelegationTabletData } from "../../../../constants/memberData";
import { MemberInformation } from "../MemberInformation/MemberInformation";
export const DelegationDetailsTable = () => {
    const [tableData, setData] = useState(DelegationTabletData);
    const [data2, setData2] = useState([]);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackSev, setSnackSev] = useState("");
    const [snackMsg, setSnackMsg] = useState("");
    const tableRef = React.createRef();
    const [showDialog, setshowDialog] = useState(false);
    const [count, setCount] = useState(tableData && tableData.length > 0 ? tableData.length : 0);
    const [memberInfo, setMemberInfo] = useState(false);
    const classes = useStyles();

    const handleClick = (rowData) => {
        history.push('/MemberInformation')
    };

    const handleDateChange1 = (date, rowData) => {
        const updatedData = tableData.map((item) =>
            item.tableData.id === rowData.tableData.id ? { ...item, Dele_Start_Adjust: date } : item
        );
        setData(updatedData);
    };

    const handleDateClose1 = () => {
    };

    const handleDateChange2 = (date, rowData) => {
        const updatedData = tableData.map((item) =>
            item.tableData.id === rowData.tableData.id ? { ...item, Dele_End_Adjust: date } : item
        );
        setData(updatedData);
    };
    const handleDateClose2 = () => {
    };
    useEffect(() => {
        setCount(tableData && tableData.length > 0 ? tableData.length : 0);
    }, []);

    return (
        <div class="deleTable">
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
                                    </div>
                                ),
                            },
                        }}
                        onRowClick={(event, rowData, togglePanel) =>
                            handleClick(rowData)
                        }
                        autoHeight={true}
                        icons={tableIcons}
                        data={tableData}
                        tableRef={tableRef}
                        options={{
                            paging: false,
                            search: false,
                            toolbar: false,
                            sorting: false,
                            detailPanelType: "single",
                            selection: false,
                            maxBodyHeight: "40vh",
                            overflowY: "hidden !important",
                            padding: "dense",
                            filtering: false,
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
                            doubleHorizontalScroll: false,
                            headerStyle: {
                                whiteSpace: "nowrap",
                                position: "sticky",
                                fontWeight: 700,
                                fontSize: commonFontSizes.bodyTwo + "rem",
                                color: "#2C2B2C",
                                border: "1px solid lightgrey",
                                textAlign: "center"
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
                                fontWeight: 400,
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
                                title: "Capitated",
                                field: "Capitated",
                                cellStyle: {
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    minWidth: 190,
                                    maxWidth: 190,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Capitated} onClick={handleClick} />
                                ),
                            },
                            {
                                title: "Capitated Start",
                                field: "Capitated_Start",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 190,
                                    maxWidth: 190,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Capitated_Start} />
                                ),
                            },
                            {
                                title: "Capitated End",
                                field: "Capitated_End",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 190,
                                    maxWidth: 190,

                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Capitated_End} />
                                ),
                            },
                            {
                                title: "Delegable Start Original",
                                field: "Dele_Start_Orig",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem !important",
                                    fontWeight: 400,
                                    minWidth: 180,
                                    maxWidth: 180,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Dele_Start_Orig} />
                                ),
                            },
                            {
                                title: "Delegable Start Adjusted",
                                field: "Dele_Start_Adjust",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 180,
                                    maxWidth: 180,
                                },
                                render: (rowData) => (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                className={classes.datePicker}
                                                value={rowData.Dele_Start_Adjust}
                                                onChange={(date) => handleDateChange1(date, rowData)}
                                                onAccept={handleDateClose1}
                                                format="dd-MM-yyyy"
                                                openTo="date"
                                                clearable
                                                InputProps={{
                                                    readOnly: true,
                                                    style: { width: 155, paddingLeft: "2rem" },
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                ),
                            },
                            {
                                title: "Delegable End Original",
                                field: "Dele_End_Orig",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 180,
                                    maxWidth: 180,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Dele_End_Orig} />
                                ),
                            },
                            {
                                title: "Delegable End Adjusted",
                                field: "Dele_End_Adjust",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 180,
                                    maxWidth: 180,
                                },
                                render: (rowData) => (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                className={classes.datePicker}
                                                value={rowData.Dele_End_Adjust}
                                                onChange={(date) => handleDateChange2(date, rowData)}
                                                onAccept={handleDateClose2}
                                                format="dd-MM-yyyy"
                                                openTo="date"
                                                clearable
                                                InputProps={{
                                                    readOnly: true,
                                                    style: { width: 155, paddingLeft: "2rem" },
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>

                <SimpleSnackbar
                    snackOpen={snackOpen}
                    snackSev={snackSev}
                    snackMsg={snackMsg}
                    handleSnackClose={handleSnackClose}
                />
            </MuiThemeProvider>
        </div>
    );
};
export default DelegationDetailsTable;
