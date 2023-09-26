import React, { useState, useEffect } from "react";
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

    const [memberDeleTab, setMemberDeleTab] = useState({
        Subscriber_id: "10565861300",
    })

    const location = useLocation();
    const handleChange = (newValue) => { 
       if(tabValue === 0){
           getMemberDeleTab(memberDeleTab);
       }
       setTabValue(newValue);
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
            const ErrorCode = response.system.properties.code.example;
            const ErrorMsg = response.system.properties.message.example;
            if(ErrorCode == 500){
                setContent("Internal Error");
            } else if(ErrorCode == 200) {
                setLoading(false);
            }
        })
    }
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
                 {tabValue === 0 && <DelegationDetailsTable />}
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
