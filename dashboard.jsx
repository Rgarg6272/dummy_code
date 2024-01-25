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
  Paper
} from "@material-ui/core";
import { useStyles } from "../../css/MemberDetails";
import { makeStyles, withStyles } from '@material-ui/styles';
import { COMMONCSS } from "../../css/CommonCss";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ImportContactsOutlinedIcon from '@material-ui/icons/ImportContactsOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import { DashBoardDetails, AlertMessage } from '../../../constants/memberData';
import { DashBoardStyles } from "../../css/DashBoardStyles";
import { ROUTES } from "../../../constants/routes";
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

const useStyles1 = makeStyles((theme) => COMMONCSS(theme));
export const HomePage = (props) => {
  const classes = useStyles();
  const classes1 = useStyles1();
  const classes2 = DashBoardStyles();
  const [value, setValue] = useState(location.dashboardTab ? "three" : "two");
  const [dashBoardDetails, setDashBoardDetails] = useState(false);
  const [tableRowData, setTableRowData] = useState([]);
  const [searchData, setSearchedData] = useState({});

  const handleTableData = (value) => {
    setTableRowData(value);
  };

  const history = useHistory();

  const handleSearchPage = (data) => {
    setSearchedData(data);
  };

  const handleClick = ((event) => {
    event.preventDefault();
  });

  const handleClickN = ((id) => {
    if (id === 1) {
      history.push(ROUTES.MemberSearch);
    } else if (id === 2) {
      history.push(ROUTES.delegatedContacts);
    } else if (id === 3) {
      history.push(ROUTES.memberDelegatedContacts);
    } else if (id === 4) {
      history.push(ROUTES.AdminPage);
    }
  })

  useEffect(() => {
  }, []);

  return (
    <React.Fragment>
      <div style={{padding: "0 9.4% 0 9.4%"  }}>
        <Grid container style={{ cursor: "pointer" }}>
          {AlertMessage && AlertMessage.length > 0
            ? AlertMessage.map((data) => {
              return (
                <Grid item xs={12} style={{ padding: "0.8rem", margin: "0px 0px -15px 0px" }}>
                  <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} >
                      <Alert
                        severity="info"
                        icon={<InfoIcon style={{ color: '#2C2B2C' }} />}
                        style={{ background: "#C4C4C4", color: '#2C2B2C' }}
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                          >
                            <CloseIcon fontSize="inherit" style={{ color: '#2C2B2C' }} />
                          </IconButton>
                        }
                      >
                        {data.label}
                      </Alert>
                    </Grid>
                  </Grid>
                </Grid>)
            }) : ""}
        </Grid>
      </div>
      <div style={{ padding: "2rem 10% 3% 10%",marginTop:"-1rem" }}>
        <Paper elevation={0} variant="outlined" className={classes.paper} style={{ padding: "1rem" }}>
          <Grid container style={{ padding: '0.8rem', cursor: "pointer" }}>
            {DashBoardDetails && DashBoardDetails.length > 0
              ? DashBoardDetails.map((data) => {
                return (
                  <Grid item xs={12} style={{ padding: data.id !== 1 ? "0.8rem" : "0 0.8rem 0.8rem 0.8rem" }}>
                    <Grid container className={classes2.gridItem} onClick={() => handleClickN(data.id)}>
                      <Grid item xl={1} lg={1} md={1} sm={2} xs={2} className={classes2.imgStyle} >
                        <img src={data.path} className={classes2.logoStyle} />
                      </Grid>
                      <Grid item xl={9} lg={9} md={9} sm={8} xs={8} className={classes2.labelStyle} >
                        {data.label}
                      </Grid>
                      <Grid item xl={2} lg={2} md={2} sm={2} xs={2} className={classes2.arrowIcon} >
                        <ArrowForwardIosOutlinedIcon />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              }) : ""}
          </Grid>
        </Paper>
      </div>
    </React.Fragment>
  );
};
export default HomePage;
