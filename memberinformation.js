import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Tabs,
    Tab,
    Container,
    Divider,
    Grid,
    Typography,
    Breadcrumbs,
    Link,
    Paper,
    Box,
} from "@material-ui/core";
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
import { Loader } from "../../../common/Loader";



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
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [tabValue, setTabValue] = React.useState(0);
    const [data, setData] = useState([]);

    const [memberDeleTab, setMemberDeleTab] = useState({
        Subscriber_id: "10559028300",
    })

    const location = useLocation();

    const handleChange = (newValue) => { 
       // console.log("tab -0")
       setTabValue(newValue);
       if(tabValue === 0){
           getMemberDeleTab(memberDeleTab);
       }
    };

    const getMemberDeleTab = (memberDeleTab) => {
        const filter_obj = {
            Subscriber_id: memberDeleTab.Subscriber_id ? memberDeleTab.Subscriber_id : ""
        }
        setLoading(true);
        console.log('if::', serviceUrls.get_member_delegation_tab);
        requestWrapper(serviceUrls.get_member_delegation_tab, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            data: filter_obj,
        })
        .then((response) => {
            setLoading(false);
            console.log("line number -93", response.get_member_delegation);
            setData(response.get_member_delegation);
        })
    }

    useEffect(() => {
    //    console.log('location::',location.state.result);
    });

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
                <Paper style={{ width: "100%" }} className={classes.paper}>
                    <MemberInfo MemberInfoData={location.state.result.Member_information}/>
                </Paper>

                <Paper style={{ width: "100%", marginTop: "1rem" }} className={classes.paper} >
                    <MemberDelegateInfo MemberDelegateData={location.state.result.Member_key_delegation_info} />
                </Paper>
            </div>

            <div style={{padding:"0.5rem 2.5% 0rem 2.5%"}}>
                <DelegationTabs onChildValue={handleChange} />
             </div>
             {loading && <Loader />}
             <div className={classes1.tabHeaderDiv1} style={{paddingBottom:"1rem"}}>
                 {tabValue === 0 && <DelegationDetailsTable delegationDetail={data} />}
                 {tabValue === 1 && <DelegatedDetailsTable />}
                 {tabValue === 2 && <DelegatedLevelTable />}
                 {tabValue === 3 && <RecentDatesTable />}
                 {tabValue === 4 && <DelegatedContactsTable />}
                 {tabValue === 5 && <DelegatedNotesTable />}
             </div>
        </React.Fragment>

    );
};
export default MemberInformation;
