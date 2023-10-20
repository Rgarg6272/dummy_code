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

const useStyles1 = makeStyles((theme) => COMMONCSS(theme));
function PaperComponent(props) {
    return (
        <Draggable handle="#hyperlink-dialog">
            <Paper {...props} />
        </Draggable>
    );
}
export const AddNewCareDialog = ({ handleCloseDialog, tableDataId, addData, addHeader, editRowData, flag, rowId }) => {
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
        Delegate: "",
        Contact_Type: "",
        Contact_Name: "",
        Cell_Phone: "",
        Work_Phone: "",
        Email: "",
        Preferred: "",
        Action: "",
        enableDatePicker: false,
        enableEditIcon: false
    });


    useEffect(() => {
        console.log('addData::',addData)
        if (flag === 'edit') {
            const updateData = delegateData.map((inputData) => {
                return {
                    ...rowValue, value: inputData.value
                }
            })
            setMemberContactData(item => ({
                ...item,
                Delegate: updateData[0].value,
                Contact_Type: updateData[1].value,
                Contact_Name: updateData[2].value,
                Cell_Phone: updateData[3].value,
                Work_Phone: updateData[4].value,
                Email: updateData[5].value,
                Preferred: updateData[6].value,
                Action: "",
                enableDatePicker: false,
            }))
            setButtonData(saveButton);
        } else {
            setButtonData(addButtons);
        }
    }, [])

    const handleClose = () => {
        setOpen(false)
        handleCloseDialog("", flag, rowId); // callback to set dialog to be closed
    };

    const handleDelegateLevel = (event) => {
        setDelegateLevel(event.target.value);
    }

    const handleDelegateCCLevel = (event) => {
        setDelegateCCLevel(event.target.value)
    }

    const handleChange = (event) => {
        //console.log('event::', event, ' ', addHeader)
        if (addHeader === 'Add New Level of Care') {
            setMemberFormData({
                ...memberFormData,
                [event.target.name]: event.target.value,
                // [event.target.name]: event.target.value.replace(/\s/g, ""),
            });
        } else {
            setMemberContactData({
                ...memberContactData,
                [event.target.name]: event.target.value,
            });
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
        console.log('updateMemberData:', updateMemberData)
        setDelegateInputData(updateMemberData);
    };

    const handleButtonSearch = (event) => {
        if (event.target.innerText === "Clear All") {
            handleClearAll();
        } else if (
            event.target.innerText === "Add" || event.target.innerText === "Save" ||
            (event.keyCode == 13 && event.key === "Enter")
        ) {
            if (addHeader === 'Add New Level of Care') {
                setSearchDialogOpen(true);
            } else {
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
            handleCloseDialog(filter_obj, flag, rowId) // callback to set dialog to be closed
        } else {
            // console.log("memberFormData::", memberFormData)
            const filter_obj = {
                Delegate: memberFormData.Delegate,
                Contact_Type: memberFormData.Contact_Type,
                Contact_Name: memberFormData.Contact_Name,
                Cell_Phone: memberFormData.Cell_Phone,
                Work_Phone: memberFormData.Work_Phone,
                Email: memberFormData.Email,
                Preferred: memberFormData.Preferred,
                Action: "",
                enableDatePicker: false,
                id: tableDataId + 1,
                flag: 'Add',
                enableEditIcon: false
            };
            const { Action, enableDatePicker, id, ...newFilter_obj } = filter_obj; //we can pass newFilter_obj to backend
            console.log("filter_obj::", filter_obj, flag, ' ', rowId)
            setOpen(false)
            handleCloseDialog(filter_obj, flag, rowId) // callback to set dialog to be closed
        }

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
        console.log('delegateData', delegateData,' ',addHeader)
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
            console.log('before_else::',memberContactData)
            setMemberContactData({
                ...memberContactData,
                Delegate: "",
                Contact_Type: "",
                Contact_Name: "",
                Cell_Phone: "",
                Work_Phone: "",
                Email: "",
                Preferred: "",
                Action: "",
                enableDatePicker: false,
                enableEditIcon: false
            });
            console.log('after_else::',memberContactData)
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
                                                        {data.inputType === "text" || data.inputType === "date" ? (
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
                            xs={12}
                            className={classes.buttonFields} style={{ display: "flex", flexDirection: "row", alignItems: "end", justifyContent: "end", paddingTop: "1rem", }}
                        >
                            <label
                                style={{
                                    visibility: "hidden",
                                }}
                            >
                                Search Button
                             </label>
                            <SearchButton
                                buttonData={buttonData}
                                id="Advanced"
                                searchBtnDisable={searchBtnDisable}
                                clearBtnDisable={clearBtnDisable}
                                handleButton={handleButtonSearch}
                            />
                        </Grid>
                    </Grid>
                    {searchDialogOpen && <SearchDialog handleSearchDialog={handleSearchDialog} handleShowMemberTable={handleShowMemberTable} content={staticData.addNewLevelDateErr} btnContent="ok" />}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};
export default AddNewCareDialog;
