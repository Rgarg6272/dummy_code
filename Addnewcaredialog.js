import React, { useState, useRef, useEffect } from "react";
import {
    Button,
    Grid,
    Paper,
    Typography,
    makeStyles,
    Dialog,
    DialogContent,
    Card,
    TextField,
    FormControl,
    Select,
    MenuItem
} from "@material-ui/core";
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

const useStyles1 = makeStyles((theme) => COMMONCSS(theme));
function PaperComponent(props) {
    return (
        <Draggable handle="#hyperlink-dialog">
            <Paper {...props} />
        </Draggable>
    );
}
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
        console.log('delegateData:', delegateData)
        //To enable and disable buttons
        checkInput(delegateData);
        if (flag === 'EDIT') {
            // setSearchBtnDisable(true);
            // setClearBtnDisable(true);
            //fetching value from array
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

    const handleChange = (event) => {
        if (addHeader === 'Add New Level of Care') {
            setMemberFormData({
                ...memberFormData,
                [event.target.name]: event.target.value,
            });
        } else {
            setMemberContactData({
                ...memberContactData,
                [event.target.name]: event.target.value,
            });
        }

        const updateMemberData = delegateData.map((inputData) => {
            if (inputData.name === event.target.name) {
              //  console.log("input data", event.target.name, event.target.value)
                return {
                    ...inputData,
                    value: length <=10 ? event.target.value : "Cell_Phone",
                    hasError:(event.target.name === "Cell_Phone" || event.target.name === "Work_Phone") && event.target.value.replace(/\D/g, '').length < 10,
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
        console.log(updateMemberData)
        const isDelegateValid = updateMemberData[0].value ? updateMemberData[0].value.trim() !== "" : "";
        const isContactTypeValid = updateMemberData[1].value ? updateMemberData[1].value.trim() !== "" : "";
        const isContactNameValid = updateMemberData[2].value ? updateMemberData[2].value.trim() !== "" : "";
        const isCellPhoneValid = updateMemberData[3].value ? updateMemberData[3].value.trim() !== "" : "";
        const isWorkPhoneValid = updateMemberData[4].value ? updateMemberData[4].value.trim() !== "" : "";
        const preferredContact = updateMemberData[6].value ? updateMemberData[6].value : "";

        let shouldEnableButton = false;

        if (!preferredContact) {
            // Preferred Contact is not selected
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                (isCellPhoneValid || isWorkPhoneValid);
        } else if (preferredContact === "Work Phone") {
            // Preferred Contact is "Work Phone"
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid &&
                isWorkPhoneValid;
        } else if (preferredContact === "Cell Phone") {
            // Preferred Contact is "Cell Phone"
            shouldEnableButton =
                isDelegateValid &&
                isContactTypeValid &&
                isContactNameValid && 
                !updateMemberData.find(i => i.name === "Cell_Phone") ?.hasError &&
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
                console.log('else', memberContactData)
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
            if (memberFormData.Cell_Phone) {
                var cleaned = memberFormData.Cell_Phone.replace(/\D/g, "");
                var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    var intlCode = match[1] ? "+1 " : "";
                    var cellPhone = [intlCode, match[2], "-", match[3], "-", match[4]].join("");
                } else {
                    var cellPhone = memberFormData.Cell_Phone;
                }
            }
            if (memberFormData.Work_Phone) {
                var cleaned = memberFormData.Work_Phone.replace(/\D/g, "");
                var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    var intlCode = match[1] ? "+1 " : "";
                    var workPhone = [intlCode, match[2], "-", match[3], "-", match[4]].join("");
                } else {
                    var workPhone = memberFormData.Work_Phone;
                }
            }
            const filter_obj = {
                Action: flag,
                Contact_idn: flag == 'ADD' ? memberFormData.Contact_idn : contactIdn,
                Delegate: memberFormData.Delegate,
                Contact_type: memberFormData.Contact_type,
                Contact_name: memberFormData.Contact_name,
                Cell_Phone: cellPhone,
                Work_Phone: workPhone,
                Email: memberFormData.Email,
                Pref_Contact: memberFormData.Pref_Contact ? memberFormData.Pref_Contact : "",
                //.replace(/(\r\n|\n|\r)/gm, "").trim() : "",
                User_name: ""
            };
            console.log('filter_obj', filter_obj)
            //AddEditDeleContacts(filter_obj)
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
      //console.log(!!delegateData.find(i => i?.hasError) || searchBtnDisable)

    const handleClearAll = () => {
        setSearchBtnDisable(true);
        setClearBtnDisable(true);
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
                                                        {data.inputType === "text" || data.inputType === "date" || data.inputType === "number" ? (
                                                            <React.Fragment>
                                                                <TextField
                                                                    size="small"
                                                                    id={data.id}
                                                                    placeholder={data.placeHolder}
                                                                    type={data.inputType}
                                                                    variant="outlined"
                                                                    value={data.value}
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
                                                                />
                                                                {data?.hasError &&<Grid container style={{  paddingLeft: "0.5rem" }}>
                                                                    <Grid item xs={12}>
                                                                        <Typography className={classes.mandaNote}>{data?.errorMessage ?? ""}</Typography>
                                                                    </Grid>
                                                                </Grid>}
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
                                                                    >
                                                                        {data.DelegateLevelOptions.map((data) => (
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
                            // xl={3}
                            // lg={3}
                            // md={3}
                            // sm={6}
                            xs={12}
                            className={classes.buttonFields} style={{ display: "flex", flexDirection: "row", alignItems: "end", justifyContent: "end", paddingTop: "1rem", }}
                        >
                            <label
                                style={{
                                    visibility: "hidden",
                                    // fontSize:
                                    //     accessibilityFontSize * commonFontSizes.bodyTwo + "rem",
                                }}
                            >
                                Search Button
                             </label>
                            <SearchButton
                                buttonData={buttonData}
                                key={!!delegateData.find(i => i?.hasError) || searchBtnDisable}
                                id="Advanced"
                                searchBtnDisable={ searchBtnDisable }
                                clearBtnDisable={clearBtnDisable}
                                handleButton={handleButtonSearch}
                            // accessibilityFontSize={accessibilityFontSize}
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
