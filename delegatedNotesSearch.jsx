import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {Tabs, Tab, Container,Divider,Grid,Typography,Breadcrumbs,Link,Paper,Box,Card,FormControl,Select,MenuItem,TextField,} from "@material-ui/core";
import { useStyles } from "../../../css/MemberDetails";
import {
    MuiThemeProvider,
    createMuiTheme,
    makeStyles,
    withStyles
} from "@material-ui/core/styles";
import { COMMONCSS } from "../../../css/CommonCss";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { DelegatedNoteTableData, NoteTypeData } from '../../../../constants/memberData';
import Location from '../../../../assets/Location.png';
import Call from '../../../../assets/Call.png';
import { ROUTES } from '../../../../constants/routes';
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { serviceUrls } from "../../../../utils/serviceUrls";
import { requestWrapper } from "../../../../utils/requestWrapper";
import { Loader } from "../../../common/Loader";
import SearchButton from "../../../common/SearchButton";
import { subButtons, staticData } from "../../../../constants/StaticData";
import { DelegatedNotesTable } from "../../../pages/MemberSearch/DelegationInformation/DelegatedNotesTable";

const useStyles1 = makeStyles((theme) => COMMONCSS(theme));

export const DelegatedNotesSearch = (props) => {
    const classes = useStyles();
    const classes1 = useStyles1();
    const [loading, setLoading] = useState(false);
    const [noData, setNoData] = useState("");
    const [noteTypeData, setNoteTypeData] = useState(NoteTypeData);
    const [searchBtnDisable, setSearchBtnDisable] = useState(true);
    const [data, setData] = useState([]);

    //Clearing all the inputs
    const [memberFormData, setMemberFormData] = useState({
        Note_type: "",
        Note_date: "",
    });

    let nullObject = null;
    let data1 = {};
    let noData1 = "";

    const handleChange = (event) => {
        setMemberFormData({
            ...memberFormData,
            [event.target.name]: event.target.value,
        });
        const updateMemberData = noteTypeData.map((inputData) => {
            if (inputData.name === event.target.name) {
                return {
                    ...inputData,
                    // value: event.target.value.replace(/\s/g, "")
                    value: event.target.value
                };
            } else {
                return {
                    ...inputData,
                };
            }
        });
        //During input changes, binding values into 'value' attribute
        setNoteTypeData(updateMemberData);
        //To enable and disable buttons
        checkInput(updateMemberData);
    };

    const checkInput = (updateMemberData) => {
        const submitButton = updateMemberData.some((checkInput) => {
            return checkInput.value && checkInput.value.length > 0;
        });
        //console.log('submitbtn::', submitButton)
        if (submitButton) {
            setSearchBtnDisable(false);
        } else {
            setSearchBtnDisable(true);
        }
    }

    const handleButtonSearch = () => {
        if (
            event.target.innerText === "Submit" ||
            (event.keyCode == 13 && event.key === "Enter")
        ) {
            getNotesDetails(memberFormData);
        }
    }

    const getNotesDetails = (memberFormData) => {
        const filter_obj = {
            Note_type: memberFormData.Note_type,
            Note_date: memberFormData.Note_date,
        };
        //console.log('filter_obj::', filter_obj);
        setData(DelegatedNoteTableData);
        //getNotesInformation(filter_obj);
    }

    const getNotesInformation = (filter_obj) => {
        setLoading(true);
        requestWrapper(serviceUrls.get_member_notes_tab, {
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
                    setNoData("Internal Error");
                } else if (ErrorCode == 200) {
                    if (ErrorMsg == "No Data Found") {
                        setNoData("No Data Found");
                    } else {
                        setData(response.get_member_notes);
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                setNoData("Internal Error");
            });
    }

    useEffect(() => {

    }, [data, noData]);

    return (
        <div class="deleTable">
            <Grid item xs={12} style={{ paddingTop: "0.5rem" }}>
                <Card className={classes.cardDialog}>
                    <Grid container className={classes.MemberSearchSectionD} direction="row">
                        <Grid container direction="row" className={classes.memberInput}>
                            <Grid container direction="row" spacing={2}>
                                {noteTypeData && noteTypeData.length > 0
                                    && noteTypeData.map((data) => {
                                        return (
                                            <Grid
                                                item className={classes.subGridItem}
                                                // xl={3}
                                                // lg={3}
                                                // md={3}
                                                // sm={6}
                                                // xs={6}
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
                                                            style={{ width: "100%", marginTop: "1rem" }}
                                                            onChange={handleChange}
                                                            inputProps={{
                                                                style: {
                                                                    height: "0.8rem"
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
                                                               // displayEmpty
                                                                // onChange={handleDelegateCCLevel}
                                                                onKeyDown={handleButtonSearch}
                                                                onChange={handleChange}
                                                            >
                                                                {/* <MenuItem value="">
                                                                    <em>Select Note Type</em>
                                                                </MenuItem> */}
                                                                {data.NoteTypeOptions.map((data) => (
                                                                    <MenuItem value={data}>{data}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </React.Fragment>
                                                }
                                            </Grid>
                                        )
                                    })}
                                <Grid
                                    item
                                    xl={3}
                                    lg={3}
                                    md={3}
                                    sm={6}
                                    xs={12}
                                    className={classes.buttonFields}
                                >
                                    <label
                                        style={{
                                            visibility: "hidden",
                                        }}
                                    >
                                        Search Button
                                    </label>

                                    <SearchButton
                                        buttonData={subButtons}
                                        // id="Advanced"
                                        searchBtnDisable={searchBtnDisable}
                                        // clearBtnDisable={clearBtnDisable}
                                        handleButton={handleButtonSearch}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {data.length > 0 && <DelegatedNotesTable data={data} noData={noData} />}
                    {loading && <Loader />}
                </Card>
            </Grid>
        </div>
    );
};
export default DelegatedNotesSearch;
