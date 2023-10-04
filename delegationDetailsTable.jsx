import { forwardRef } from "react";
import React, { useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CsvBuilder } from "filefy";
import jsPDF from "jspdf";
import { commonFontSizes } from "../../../css/FontSizes";
import { DelegationTabletData } from "../../../../constants/memberData";
import { MemberInformation } from "../MemberInformation/MemberInformation";
import { useStyles } from "../../../css/MemberDetails";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { requestWrapper } from "../../../../utils/requestWrapper";
import { serviceUrls } from "../../../../utils/serviceUrls";

export const DelegationDetailsTable = ({ resultData, noData }) => {
    const [tableData, setData] = useState(resultData);
    const [data2, setData2] = useState([]);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackSev, setSnackSev] = useState("");
    const [snackMsg, setSnackMsg] = useState("");
    const tableRef = React.createRef();
    const [showDialog, setshowDialog] = useState(false);
    const [count, setCount] = useState(tableData && tableData.length > 0 ? tableData.length : 0);
    const [memberInfo, setMemberInfo] = useState(false);
    const classes = useStyles();
    const [noDataF, setNoDataF] = useState(noData);
    const [delegationDate, setDelegationDate] = useState({
        Subscriber_id: "10555226200",
        Capitated: "PMG",
        Capitated_start: "20220901",
        Capitated_end: "30000101",
        Dele_start_adjust: "20221201",
        Dele_end_adjust: ""
    })

    let nullObject = null;
    let data1 = {};
    let noData1 = "";

    const history = useHistory();
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


    const handleClick = (rowData) => {
        history.push('/MemberInformation')
    };

    const getDelegationDate = (delegationDate) => {
        const filter_obj = {
            Subscriber_id: delegationDate.Subscriber_id ? delegationDate.Subscriber_id : "",
            Capitated: delegationDate.Capitated ? delegationDate.Capitated : "",
            Capitated_start: delegationDate.Capitated_start ? delegationDate.Capitated_start.replaceAll("-", "") : "",
            Capitated_end: delegationDate.Capitated_end ? delegationDate.Capitated_end.replaceAll("-", "") : "",
            Dele_start_adjust: delegationDate.Dele_start_adjust ? delegationDate.Dele_start_adjust.replaceAll("-", "") : "",
            Dele_end_adjust: delegationDate.Dele_end_adjust ? delegationDate.Dele_end_adjust.replaceAll("-", "") : ""
        }
        requestWrapper(serviceUrls.delegation_date_tab, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            data: filter_obj,
        })
          .then((response) => {
            const ErrorCode = response.system.properties.code.example;
            if(ErrorCode == 200){
              //  console.log("api call")
            }
          })
    }
    const handleDateChange1 = (date, rowData) => {
        //console.log('date::',date,' ',rowData,' ',tableData)
        const updatedData = tableData.map((item) =>
            item.tableData.id === rowData.tableData.id ? { ...item, Dele_start_adjust: date } : item
        );
        setData(updatedData);
    };

    const handleDateClose1 = () => {
        console.log("ok button")
        getDelegationDate(delegationDate);
    };

    const handleDateChange2 = (date, rowData) => {
        const updatedData = tableData.map((item) =>
            item.tableData.id === rowData.tableData.id ? { ...item, Dele_end_adjust: date } : item
        );
        setData(updatedData);
    };

    const handleDateClose2 = () => {
    };

    const handleInputClick = (event) => {
        // console.log("ok button");
        event.preventDefault();
    }


    useEffect(() => {
        setData(resultData);
        setNoDataF(noData);
        setCount(resultData && resultData.length > 0 ? resultData.length : 0);
    }, [resultData, noData, tableData]);

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
                                        No Data Found{""}
                                    </div>
                                ),
                            },
                        }}
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
                            maxBodyHeight: "25vh",
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
                                    <RenderValue value={rowData.Capitated ? rowData.Capitated : "-"} onClick={handleClick} />
                                ),
                            },
                            {
                                title: "Capitated Start",
                                field: "Capitated_start",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 190,
                                    maxWidth: 190,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Capitated_start ? rowData.Capitated_start : "-"} />
                                ),
                            },
                            {
                                title: "Capitated End",
                                field: "Capitated_end",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 190,
                                    maxWidth: 190,

                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Capitated_end ? rowData.Capitated_end : "-"} />
                                ),
                            },
                            {
                                title: "Delegated Start Original",
                                field: "Dele_start_orig",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem !important",
                                    fontWeight: 400,
                                    minWidth: 180,
                                    maxWidth: 180,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Dele_start_orig ? rowData.Dele_start_orig : "-"} />
                                ),
                            },
                            {
                                title: "Delegated Start Adjusted",
                                field: "Dele_start_adjust",
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
                                                value={rowData.Dele_start_adjust ? rowData.Dele_start_adjust : "-"}
                                                onChange={(date) => handleDateChange1(date, rowData)}
                                                onAccept={handleDateClose1}
                                                onClick={handleInputClick}
                                                format="MM/dd/yyyy"
                                                openTo="date"
                                                clearable
                                                helperText=''
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
                                title: "Delegated End Original",
                                field: "Dele_end_orig",
                                cellStyle: {
                                    color: "#555151",
                                    fontSize: commonFontSizes.bodyTwo + "rem",
                                    fontWeight: 400,
                                    minWidth: 180,
                                    maxWidth: 180,
                                },
                                render: (rowData) => (
                                    <RenderValue value={rowData.Dele_end_orig ? rowData.Dele_end_orig : "-"} />
                                ),
                            },
                            {
                                title: "Delegated End Adjusted",
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
                                                value={rowData.Dele_end_adjust ? rowData.Dele_end_adjust : "-"}
                                                onChange={(date) => handleDateChange2(date, rowData)}
                                                onAccept={handleDateClose2}
                                                format="MM/dd/yyyy"
                                                openTo="date"
                                                clearable
                                                helperText=''
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
            </MuiThemeProvider>
        </div>
    );
};
export default DelegationDetailsTable;
