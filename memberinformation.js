import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
import { MemberInfoDetails, MemberIdentifier, MemberAddress, MemberContact, SettingOfCare, NFLOC, DeleLevelCare, OtherKeyInfoLeft, OtherKeyInfoRight, TabInfo } from '../../../../constants/memberData';
import Location from '../../../../assets/Location.png';
import Call from '../../../../assets/Call.png';
import { ROUTES } from '../../../../constants/routes';
import { Link as RouterLink } from "react-router-dom";
import MemberInfo from "./MemberInfo";
import { MemberDelegateInfo } from "./MemberDelegateInfo";
import { DelegationTabs } from "../../../common/DelegationTabs";
import { DelegationDetailsTable } from "../DelegationInformation/DelegationDetailsTable";
import { DelegatedDetailsTable } from "../DelegationInformation/DelegatedDetailsTable";
import { DelegatedLevelTable } from "../DelegationInformation/DelegatedLevelTable";
import { RecentDatesTable } from "../DelegationInformation/RecentDatesTable";
import { DelegatedContactsTable } from "../DelegationInformation/DelegatedContactsTable";
import { DelegatedNotesTable } from "../DelegationInformation/DelegatedNotesTable";
import { useLocation } from "react-router-dom";
import { serviceUrls } from "../../../../utils/serviceUrls";
import { requestWrapper } from "../../../../utils/requestWrapper";

const useStyles1 = makeStyles((theme) => COMMONCSS(theme));

export const MemberInformation = (props) => {
    const classes = useStyles();
    const classes1 = useStyles1();
    const [tableRowData, setTableRowData] = useState([]);
    const [searchData, setSearchedData] = useState({});
    const [memberData, setMemberData] = useState(MemberInfoDetails)
    const [memberIdentify, setMemberIdentify] = useState(MemberIdentifier)
    const [memberAddress, setMemberAddress] = useState(MemberAddress)
    const [memberContact, setMemberContact] = useState(MemberContact)
    const [tabValue, setTabValue] = React.useState(0);
    const location = useLocation();
    const [memberInfoData, setMemberInfoData] = useState("");
    const [delegationData, setDelegationData] = useState("");
    const [resultData1, setResultData1] = useState([]);
    const [resultData2, setResultData2] = useState([]);
    const [resultData3, setResultData3] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentDate, setRecentDate] = useState(false);

    var URL="";
    var responseData1;
    var responseData2;
    var responseData3;

    const handleChange = (newValue) => {
        setTabValue(newValue);
        if (newValue === 0 || newValue === 1 || newValue === 3) {
            if (newValue === 0) {
                URL = serviceUrls.get_member_delegation_tab;
            } else if (newValue === 1) {
                URL = serviceUrls.get_member_delegated_tab;
            } else if (newValue === 3) {
                URL = serviceUrls.get_member_recent_date_tab;
            }
            var filter_obj = {
                Subscriber_id: location.state.subscriberId ? location.state.subscriberId : "",
            }
            setLoading(true);
            requestWrapper(URL, {
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
                    } else if (ErrorCode == 200) {
                        if (newValue === 0) {
                            responseData1=response.get_member_delegation;
                        } else if (newValue === 1) {
                            responseData2=response.get_member_delegated;
                        } else if (newValue === 3) {
                            responseData3=response.get_recent_date;
                            setRecentDate(true)
                        }
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        console.log('location::', location.state);
    }, [location]);

    return (
        <React.Fragment>
            <div className={classes1.BreadCrumbDiv}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <RouterLink to="/DashBoard">
                        <HomeOutlinedIcon className={classes1.homeIcon} />
                    </RouterLink>
                    <RouterLink to="/MemberSearch" className={classes1.breadCrumLabel1} >
                        Member Search
                    </RouterLink>
                    <RouterLink className={classes1.breadCrumLabel2} >
                        Member Information
                    </RouterLink>
                </Breadcrumbs>
            </div>
            <div className="container" className={classes1.tabHeaderDiv1} >
                {recentDate}
                <Paper style={{ width: "100%" }} className={classes.paper}>
                    <MemberInfo MemberInfoData={location && location.state && location.state.memInfoData && location.state.memInfoData.Member_information} />
                </Paper>

                <Paper style={{ width: "100%", marginTop: "1rem" }} className={classes.paper} >
                    <MemberDelegateInfo MemberDelegateData={location && location.state && location.state.memInfoData && location.state.memInfoData.Member_key_delegation_info} />
                </Paper>
            </div>
            <>
                <div style={{ padding: "0.5rem 2.5% 0rem 2.5%" }}>
                    <DelegationTabs onChildValue={handleChange} />
                </div>

                <div className={classes1.tabHeaderDiv1} style={{ paddingBottom: "1rem" }}>
                    {tabValue === 0 && <DelegationDetailsTable resultData={location&&location.state&&location.state.memDeleData} />}
                </div>
            </>
        </React.Fragment>

    );
};
export default MemberInformation;
