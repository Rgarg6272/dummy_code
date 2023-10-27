import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import { useStyles } from "../css/MemberDetails";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { Loader } from "../common/Loader";
import { serviceUrls } from "../../utils/serviceUrls";
import { requestWrapper } from "../../utils/requestWrapper";


const SearchDialog = ({ rowData, handleSearchDialog, handleShowMemberTable, flag, content, btnContent, responseFlag, tableRefVal, activateV }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const [result, setResult] = useState("");
    const [result1, setResult1] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState("");

    const handleClose = () => {
        setOpen(false);
        handleSearchDialog(true)
    };

    const handleTable = () => {
        //console.log('rowData:', ' ', rowData.Record_Active, ' ', rowData.Record_active)
        if (rowData) {
            var actionVal;

            if (responseFlag == 'Y') {
                var actionFlag = 'Y';
            } else {
                var actionFlag = 'N';
            }
            if (activateV) {
                if (rowData.Record_active == 'Y') {
                    actionVal = 'DEACTIVATE'
                } else {
                    actionVal = 'ACTIVATE'
                }
                var URL = serviceUrls.insert_member_contact_action;
            } else {
                if (rowData.Record_Active == 'Y') {
                    actionVal = 'DEACTIVATE'
                } else {
                    actionVal = 'ACTIVATE'
                }
                var URL = serviceUrls.get_member_contact_action;
            }

            var filter_obj = {
                Subscriber_id: rowData.Subscriber_id,
                Action: actionVal,
                Confirm_flag: actionFlag,
                Contact_idn: rowData.Contact_idn,
                Delegate: rowData.Delegate,
                Contact_type: rowData.Contact_type,
                Contact_name: rowData.Contact_name,
                User_name: "",
            }
            //console.log("filter_obj:", filter_obj)
            updateRecord(URL, filter_obj);
        } else {
            setOpen(false);
            handleShowMemberTable()
        }
    }

    const updateRecord = (URL, filter_obj) => {
        setLoading(true);
        requestWrapper(URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            data: filter_obj,
        })
            .then((response) => {
                //console.log('response',response)
                setLoading(false);
                const ErrorCode = response.system.properties.code.example;
                const ErrorMsg = response.system.properties.message.example;
                if (ErrorCode == 500) {
                    setOpen(false);
                    handleShowMemberTable("Error", tableRefVal)
                } else if (ErrorCode == 200) {
                    if (ErrorMsg == "No Data Found") {
                        setOpen(false);
                        handleShowMemberTable("NoData", tableRefVal)
                    } else {
                        var actionFlag = response.get_action.Already_exist
                        if (response.get_action.Already_exist == 'N') {
                            setOpen(false);
                            handleShowMemberTable('N', tableRefVal)
                        } else {
                            //console.log('else');
                            setOpen(false);
                            handleShowMemberTable('Y', tableRefVal)
                        }
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                setOpen(false);
                handleShowMemberTable("Error", tableRefVal)
            });
    }


    useEffect(() => {
        //console.log('flag',flag)
        if (flag === "NE") {
            const res = content.split('.');
            setResult(res[0] + ".");
            setResult1(res[1]);
        } else {
            setResult(content)
        }
    }, []);

    const searchBody = (
        <div className={classes.paperDialog2}>
            <Grid container className={classes.typoHeaderContainer}>
                <Grid item xs={12} style={{ textAlign: "right" }}>
                    <CloseIcon className={classes.closeIcon} onClick={handleClose} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid
                    item
                    xs={12}
                    className={classes.errorIconGrid}
                >
                    {flag == 'D' ?
                        <DoneAllIcon
                            className={classes.successIcon}
                        />
                        :
                        <ErrorOutlineIcon
                            className={classes.errorIcon}
                        />}
                </Grid>
            </Grid>

            <Grid container style={{ paddingBottom: "0.5rem" }}>
                <Grid item xs={12} style={{ paddingBottom: "5px" }}>
                    <Typography
                        variant="caption"
                        className={classes.typoHeaderSearch}
                    >
                        {result}
                    </Typography>
                    {flag === "NE" && <Typography
                        variant="caption"
                        className={classes.typoHeaderSearch}
                    >
                        {result1}
                    </Typography>}
                </Grid>
            </Grid>
            <Grid container>
                {flag === "NE" ?
                    <Grid item xs={12} className={classes.buttonGrid}>
                        <Button
                            variant="contained"
                            onClick={handleTable}
                            style={{
                                backgroundColor: "#14837B",
                                textTransform: "capitalize",
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#ffffff",
                                borderRadius: 0,
                                width: "20%",
                                height: "28px",
                            }}
                        // className={classes.closeButton3}
                        >
                            Yes
                       </Button>
                        <Button
                            variant="contained"
                            onClick={handleClose}
                            style={{
                                backgroundColor: "#fff",
                                textTransform: "capitalize",
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "black",
                                borderRadius: 0,
                                width: "20%",
                                height: "28px",
                                border: "1.5px solid #14837B",
                                marginLeft: "10px",
                            }}
                        // className={classes.closeButton2}
                        >
                            No
                       </Button>
                    </Grid>
                    :
                    <Grid item xs={12} className={classes.buttonGrid}>
                        <Button style={{ width: "6rem" }}
                            variant="contained"
                            onClick={handleClose}
                            style={{
                                backgroundColor: "#14837B",
                                textTransform: "capitalize",
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#ffffff",
                                borderRadius: 0,
                                width: "20%",
                                height: "28px",
                            }}
                        // className={classes.closeButton3}
                        >
                            {btnContent}
                        </Button>
                    </Grid>}
            </Grid>
            {loading && <Loader />}
        </div>
    );

    return (
        <React.Fragment>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className={classes.modal}
                >
                    {searchBody}
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default SearchDialog;
