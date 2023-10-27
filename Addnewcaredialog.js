import React, { useState, useRef, useEffect } from "react";
import {Button,Grid,Paper,Typography,makeStyles,Dialog,DialogContent,Card,TextField,FormControl,Select,MenuItem} from "@material-ui/core";
import Draggable from "react-draggable";
import { COMMONCSS } from "../css/CommonCss";
import { useStyles } from "../css/MemberDetails";
import CloudUploadIcon from "@material-ui/icons/CloudUpload"
import CloseIcon from "@material-ui/icons/Close";
import { requestWrapper } from '../../utils/requestWrapper';
import { serviceUrls } from '../../utils/serviceUrls';
import { commonFontSizes } from "../css/FontSizes";
import { AdDelegateLevelData } from "../../constants/memberData";
import SearchButton from "./SearchButton";
import { addButtons, saveButton, staticData } from "../../constants/StaticData";
import moment from "moment";
import { deflateSync } from "zlib";
import SearchDialog from "../common/SearchDialog";
import { Loader } from "../common/Loader";
import e from "cors";

export const AddNewCareDialog = ({ handleCloseDialog, tableDataId, addData, addHeader, editRowData, flag, rowId, activateV, contactIdn }) => {
    const classes = useStyles();
    const classes1 = useStyles1();
    const [open, setOpen] = useState(true);
    const [delegateData, setDelegateInputData] = useState(addData);
    const [delegateLevel, setDelegateLevel] = useState();
    const [delegateCCLevel, setDelegateCCLevel] = useState();
    const [buttonData, setButtonData] = useState("");
    const [rowValue, setRowValue] = useState("");
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [searchBtnDisable, setSearchBtnDisable] = useState(true);
    const [clearBtnDisable, setClearBtnDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [telephone, setTelephone] = useState("");
    const [workphone, setWorkphone] = useState("");
    const [teleerror, setteleerror] = useState(false);
    const [helperTextteleerror, setHelperTextteleerror] = useState("");
    const [workPhoneError, setWorkPhoneError] = useState(false);
    const [helperTextError, setHelperTextError] = useState("");
    const [emailerror, setEmailError] = useState(false);
    const [helperTextEmailError, setHelperTextEmailError] = useState("");
    const [emailVal, setEmailVal] = useState("");
    const [validEmail, setValidEmail] = useState(false);

    //Clearing all the inputs
    const [memberFormData, setMemberFormData] = useState({
        Entity: "",
        CC_Level: "",
        CC_Level_Start: "",
        CC_Level_End: "",
        Reason_For_End: "",
        Action: "",
        enableDatePicker: false
    });

    const [memberContactData, setMemberContactData] = useState({
        Action: "",
        Contact_idn: "",
        Delegate: "",
        Contact_type: "",
        Contact_name: "",
        Cell_Phone: "",
        Work_Phone: "",
        Email: "",
        Pref_Contact: "",
        User_name: ""
        // enableDatePicker: false,
        // enableEditIcon: false
    });

    useEffect(() => {
        if (delegateData[3].name == 'Cell_Phone' && delegateData[3].value) {
            var res1 = formatPhoneNumber(delegateData[3].value)
            setTelephone(res1)
        } else {
            setTelephone("")
        }
        if (delegateData[4].name == 'Work_Phone' && delegateData[4].value) {
            var res2 = formatPhoneNumber(delegateData[4].value)
            setWorkphone(res2)
        } else {
            setWorkphone("");
        }
        //To enable and disable buttons
        checkInput(delegateData);
        if (flag === 'EDIT') {
            const updateData = delegateData.map((inputData) => {
                return {
                    ...rowValue, value: inputData.value
                }
            })
            // console.log('updateData:', updateData[4].value.replace(/-/g,""));
            //Mapping the value for table row
            setMemberContactData(item => ({
                ...item,
                Action: "",
                Contact_idn: "",
                Delegate: updateData[0].value,
                Contact_type: updateData[1].value,
                Contact_name: updateData[2].value,
                Cell_Phone: updateData[3].value,
                Work_Phone: updateData[4].value,
                Email: updateData[5].value,
                Pref_Contact: updateData[6].value,
                User_name: ""
            }))
            setButtonData(saveButton);
        } else {
            setButtonData(addButtons);
        }
    }, [])

    const handleClose = () => {
        setOpen(false)
        handleCloseDialog(); // callback to set dialog to be closed
    };

    const handleDelegateLevel = (event) => {
        setDelegateLevel(event.target.value);
    }

    const handleDelegateCCLevel = (event) => {
        setDelegateCCLevel(event.target.value)
    }

    const formatPhoneNumber = (input) => {
        if (input) {
            input = input.replace(/\D/g, "");
            input = input.substring(0, 10);
            var size = input.length;
            if (size == 0) {
                input = input;
            } else if (size < 4) {
                input = input;
            } else if (size < 7) {
                input = input.substring(0, 3) + "-" + input.substring(3, 6);
            } else {
                input =
                    input.substring(0, 3) +
                    "-" +
                    input.substring(3, 6) +
                    "-" +
                    input.substring(6, 10);
            }
            return input;
        }
    }

    const formatEmailAddress = (input) => {
        if (input) {
            const emailValue = event.target.value;
            // Regular expression for email validation
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            // Check if the entered email matches the regular expression
            const isValidEmail = emailRegex.test(emailValue);
            //console.log('isValidEmail:', isValidEmail);
            setValidEmail(isValidEmail);
            if (isValidEmail) {
                setEmailError(false);
                setHelperTextteleerror("");
            } else {
                setEmailError(true);
            }
            return input;
        }
    }

    const handleTeleError = (val, desc) => {
        if (val == 'cellPhone') {
            setteleerror(true);
            setHelperTextteleerror(desc);
        } else {
            setWorkPhoneError(true);
            setHelperTextError(desc);
        }
    };

    const handleEmailError = (val, desc) => {
        if (validEmail) {
            setEmailError(false);
            setHelperTextEmailError("");
        } else {
            setEmailError(true);
            setHelperTextEmailError(desc);
        }

    }

    const handleChange = (event) => {
        if (addHeader === 'Add New Level of Care') {
            setMemberFormData({
                ...memberFormData,
                [event.target.name]: event.target.value,
            });
        } else {
            //console.log("event", event.target.name);
            if (event.target.name == "Cell_Phone") {
                if (event.target.value) {
                    var res = formatPhoneNumber(event.target.value);
                } else {
                    var res = "";
                }
                setTelephone(res);
                if (event.target.value.length > 11) {
                    setteleerror(false);
                    setHelperTextteleerror("");
                } else {
                    if (event.target.value.length == 0 && res == "") {
                        setteleerror(false);
                        setHelperTextteleerror("")
                    } else {
                        setteleerror(true);
                        setWorkPhoneError(false);
                        setHelperTextError("");
                        handleTeleError('cellPhone', 'Cell Phone must be 10 characters');
                    }
                }
                setMemberContactData({
                    ...memberContactData,
                    [event.target.name]: res,
                    // [event.target.name]: telephone,
                });
            } else if (event.target.name == "Work_Phone") {
                if (event.target.value) {
                    var res = formatPhoneNumber(event.target.value);
                } else {
                    var res = "";
                }
                setWorkphone(res);
                if (event.target.value.length > 11) {
                    setWorkPhoneError(false);
                    setHelperTextError("");
                } else {
                    if (event.target.value.length == 0 && res == "") {
                        setWorkPhoneError(false);
                        setHelperTextError("");
                    } else {
                        setWorkPhoneError(true);
                        setteleerror(false);
                        setHelperTextteleerror("");
                        handleTeleError("workPhone", "Work Phone must be 10 characters");
                    }
                }

                setMemberContactData({
                    ...memberContactData,
                    [event.target.name]: res,
                });
            } else if (event.target.name == "Email") {
                if (event.target.value) {
                    var res = formatEmailAddress(event.target.value);
                } else {
                    var res = "";
                }
                setEmailVal(res);
                if (event.target.value.length == 0 && res == "") {
                    setEmailError(false);
                    setHelperTextEmailError("");
                } else {
                    setEmailError(true);
                    handleEmailError("email", "Enter valid email address");
                }
            } else {
                // console.log('else:', telephone)
                if (event.target.value == 'Cell Phone') {
                    if (telephone.length <= 0) {
                        setteleerror(true);
                        setWorkPhoneError(false);
                        setHelperTextError("");
                        handleTeleError("cellPhone", "Please enter the preferred contact");
                    } else {
                        setWorkPhoneError(false);
                        setHelperTextError("");
                    }
                } else if (event.target.value == 'Work Phone') {
                    if (workphone.length <= 0) {
                        setWorkPhoneError(true);
                        setteleerror(false);
                        setHelperTextteleerror("");
                        handleTeleError("workPhone", "Please enter the preferred contact");
                    } else {
                        setWorkPhoneError(false);
                        setHelperTextError("");
                    }
                }
                setMemberContactData({
                    ...memberContactData,
                    [event.target.name]: event.target.value,
                });
            }
        }
        const updateMemberData = delegateData.map((inputData) => {
            if (inputData.name === event.target.name) {
                return {
                    ...inputData,
                    value: event.target.value
                };
            } else {
                return {
                    ...inputData,
                };
            }
        });
        setDelegateInputData(updateMemberData);
        checkInput(updateMemberData);
    };

    const checkInput = (updateMemberData) => {
        const isDelegateValid = updateMemberData[0].value ? updateMemberData[0].value.trim() !== "" : "";
        const isContactTypeValid = updateMemberData[1].value ? updateMemberData[1].value.trim() !== "" : "";
        const isContactNameValid = updateMemberData[2].value ? updateMemberData[2].value.trim() !== "" : "";
        const isCellPhoneValid = updateMemberData[3].value ? (updateMemberData[3].value.length > 11) : "";
        const isWorkPhoneValid = updateMemberData[4].value ? (updateMemberData[4].value.length > 11) : "";
        const preferredContact = updateMemberData[6].value ? updateMemberData[6].value : "";

        let shouldEnableButton = false;

        if (!preferredContact) {
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                (isCellPhoneValid || isWorkPhoneValid);
        } else if (preferredContact === "Work Phone") {
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                isWorkPhoneValid;
        } else if (preferredContact === "Cell Phone") {
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                isCellPhoneValid;
        }

        setSearchBtnDisable(!shouldEnableButton);
        setClearBtnDisable(!shouldEnableButton);
    };

    const handleButtonSearch = () => {
        if (event.target.innerText === "Clear All") {
            handleClearAll();
        } else if (
            event.target.innerText === "Add" || event.target.innerText === "Save" ||
            (event.keyCode == 13 && event.key === "Enter")
        ) {
            if (addHeader === 'Add New Level of Care') {
                setSearchDialogOpen(true);
            } else {
                // console.log('else', memberContactData)
                getMemberDetails(memberContactData);
            }
        }
    }

    const handleShowMemberTable = () => {
        setSearchDialogOpen(false);
        getMemberDetails(memberFormData);
    }

    const getMemberDetails = (memberFormData) => {
        if (addHeader === 'Add New Level of Care') {
            const filter_obj = {
                Entity: memberFormData.Entity,
                CC_Level: memberFormData.CC_Level,
                CC_Level_Start: memberFormData.CC_Level_Start ? moment(memberFormData.CC_Level_Start).format('DD-MM-YYYY') : "",
                CC_Level_End: memberFormData.CC_Level_End ? memberFormData.CC_Level_End : "",
                Reason_For_End: memberFormData.Reason_For_End,
                Action: "",
                enableDatePicker: false,
                id: tableDataId + 1,
                flag: ""
            };
            const { Action, enableDatePicker, id, ...newFilter_obj } = filter_obj; //we can pass newFilter_obj to backend
            setOpen(false)
            handleCloseDialog("", flag, rowId) // callback to set dialog to be closed
        } else {
            const filter_obj = {
                Action: flag,
                Contact_idn: flag == 'ADD' ? memberFormData.Contact_idn : contactIdn,
                Delegate: memberFormData.Delegate,
                Contact_type: memberFormData.Contact_type,
                Contact_name: memberFormData.Contact_name,
                Cell_Phone: telephone ? telephone : "",
                Work_Phone: workphone ? workphone : "",
                Email: memberFormData.Email,
                Pref_Contact: memberFormData.Pref_Contact ? memberFormData.Pref_Contact : "",
                User_name: ""
            };
            //console.log('filter_obj', filter_obj)
            AddEditDeleContacts(filter_obj)
        }
    }

    const AddEditDeleContacts = (filter_obj) => {
        // console.log('filter:',filter_obj)
        setLoading(true);
        requestWrapper(serviceUrls.insert_member_contact_action, {
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
                    //setNoData("Internal Error");
                } else if (ErrorCode == 200) {
                    if (ErrorMsg == "No Data Found") {
                        //setNoData("No Data Found");
                    } else {
                        setOpen(false)
                        handleCloseDialog('Y') // callback to set dialog to be closed
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                //setNoData("Internal Error");
            });
    }

    const handleSearchDialog = (res) => {
        if (res === true) {
            setSearchDialogOpen(false);
            getMemberDetails(memberFormData);
        } else {
            setSearchDialogOpen(false);
        }
    }


    const handleClearAll = () => {
        setSearchBtnDisable(true);
        setClearBtnDisable(true);
        setTelephone('');
        setWorkphone('');
        setEmailVal('');
        delegateData.forEach((inputData) => {
            document.getElementById(inputData.id).value = "";
        });

        //clearing the "value" property
        setDelegateInputData(
            delegateData.map((inputItem) => {
                return {
                    ...inputItem,
                    value: "",
                };
            })
        );
        //setting the values as empty
        if (addHeader === 'Add New Level of Care') {
            setMemberFormData({
                ...memberFormData,
                Entity: "",
                CC_Level: "",
                CC_Level_Start: "",
                CC_Level_End: "",
                Reason_For_End: "",
                Action: "",
                enableDatePicker: false
            });
        } else {
            setMemberContactData({
                ...memberContactData,
                Action: "",
                Contact_idn: "",
                Delegate: "",
                Contact_type: "",
                Contact_name: "",
                Cell_Phone: "",
                Work_Phone: "",
                Email: "",
                Pref_Contact: "",
                User_name: ""
                // enableDatePicker: false,
                // enableEditIcon: false
            });
        }
    };

    return (
        <React.Fragment>
            <Dialog
                aria-labelledby="customized-dialog-title"
                fullWidth="true"
                maxWidth="sm"
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
            >
                <DialogContent id="hyperlink-dialog" className={classes.dialogContent} style={{ paddingBottom: "1rem" }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <Typography className={classes1.dialogTitle}>
                                {addHeader}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} className={classes1.closeIcongrid}>
                            <CloseIcon className={classes1.closeIcon} onClick={handleClose} />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{ paddingTop: "0.5rem" }}>
                        <Card className={classes.cardDialog}>
                            <Grid container className={classes.MemberSearchSectionD} direction="row">
                                <Grid container direction="row" className={classes.memberInput}>
                                    <Grid container direction="row" spacing={2}>
                                        {delegateData && delegateData.length > 0
                                            && delegateData.map((data) => {
                                                return (
                                                    <Grid
                                                        item
                                                        xl={6}
                                                        lg={6}
                                                        md={6}
                                                        sm={6}
                                                        xs={12}
                                                        key={data.id}
                                                    >
                                                        <div className={classes.helpIcon}>
                                                            <label>
                                                                {data.label}
                                                            </label>
                                                        </div>
                                                        {data.inputType === "text" || data.inputType === "date" || data.inputType === "search" ? (
                                                            <React.Fragment>
                                                                {data.inputType == 'search' ?
                                                                    <TextField
                                                                        size="small"
                                                                        id={data.id}
                                                                        placeholder={data.placeHolder}
                                                                        type={data.inputType}
                                                                        variant="outlined"
                                                                        //value={data.value}
                                                                        value={data.name == 'Cell_Phone' ? telephone : workphone}
                                                                        error={data.name == 'Cell_Phone' ? teleerror : workPhoneError}
                                                                        helperText={data.name == 'Cell_Phone' ? helperTextteleerror : helperTextError}
                                                                        className={data.className}
                                                                        onKeyDown={handleButtonSearch}
                                                                        name={data.name}
                                                                        style={{ width: "100%" }}
                                                                        onChange={handleChange}
                                                                        inputProps={{
                                                                            style: {
                                                                                height: "0.8rem",
                                                                            },
                                                                        }}
                                                                    /> :
                                                                    <TextField
                                                                        size="small"
                                                                        id={data.id}
                                                                        placeholder={data.placeHolder}
                                                                        type={data.inputType}
                                                                        variant="outlined"
                                                                        // value={data.value}
                                                                        value={data.name == 'Email' ? emailVal : data.value}
                                                                        error={data.name == 'Email' && emailerror}
                                                                        helperText={data.name == 'Email' && helperTextEmailError}
                                                                        className={data.className}
                                                                        onKeyDown={handleButtonSearch}
                                                                        name={data.name}
                                                                        style={{ width: "100%" }}
                                                                        onChange={handleChange}
                                                                        inputProps={{
                                                                            style: {
                                                                                height: "0.8rem",
                                                                            },
                                                                        }}
                                                                    />}
                                                            </React.Fragment>) :
                                                            <React.Fragment>
                                                                <FormControl variant="outlined" style={{ width: "100%" }}>
                                                                    <Select
                                                                        style={{ height: "2rem" }}
                                                                        labelId="demo-simple-select-outlined-label"
                                                                        id={data.id}
                                                                        name={data.name}
                                                                        value={data.value}
                                                                        // onChange={handleDelegateCCLevel}
                                                                        onKeyDown={handleButtonSearch}
                                                                        onChange={handleChange}
                                                                        MenuProps={{
                                                                            anchorOrigin: {
                                                                                vertical: "bottom",
                                                                                horizontal: "left"
                                                                            },
                                                                            transformOrigin: {
                                                                                vertical: "top",
                                                                                horizontal: "left"
                                                                            },
                                                                            getContentAnchorEl: null
                                                                        }}
                                                                    >
                                                                        {data.name == 'Delegate' ? data.DelegateLevelOptions.map((data) => (
                                                                            <MenuItem style={{ height: "1.8rem" }} value={data.key}>{data.desc}</MenuItem>
                                                                        ))
                                                                            :
                                                                            data.DelegateLevelOptions.map((data) => (
                                                                                <MenuItem value={data}>{data}</MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </React.Fragment>
                                                        }
                                                    </Grid>
                                                )
                                            })}
                                        <Grid container style={{ marginTop: "-0.3rem", paddingLeft: "0.5rem" }}>
                                            <Grid item xs={12}>
                                                <Typography className={classes.mandaNote}>*Either Cell Phone or Work Phone is Mandatory</Typography>
                                                <Typography className={classes.mandaNote}>*Required Fields</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            className={classes.buttonFields} style={{ display: "flex", flexDirection: "row", alignItems: "end", justifyContent: "end", paddingTop: "1rem", }}
                        >
                            <SearchButton
                                buttonData={buttonData}
                                id="Advanced"
                                searchBtnDisable={searchBtnDisable}
                                clearBtnDisable={clearBtnDisable}
                                handleButton={handleButtonSearch}
                            />
                        </Grid>
                    </Grid>
                    {loading && <Loader />}
                    {searchDialogOpen && <SearchDialog handleSearchDialog={handleSearchDialog} handleShowMemberTable={handleShowMemberTable} content={staticData.addNewLevelDateErr} btnContent="ok" />}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};
export default AddNewCareDialog;
