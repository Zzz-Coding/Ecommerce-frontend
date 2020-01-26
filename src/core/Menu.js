import React, { Fragment, useEffect } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import StorefrontIcon from '@material-ui/icons/Storefront';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';

import { signout, isAuthenticated } from '../auth';
import { TOTAL } from '../actions/actions';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    nav: {
        display: "flex",
    },
    activeLink: {
        borderBottom: "2px solid #000",
    },
    title: {
        flexGrow: 1,
    },
    btn: {
        margin: theme.spacing(1),
        color: "#fff",
    },
}));

const Menu = ({ history, totalCount, itemTotal }) => {
    const classes = useStyles();

    useEffect(() => {
        itemTotal();
    }, []);

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        BookStore
                    </Typography>
                    <div className={classes.nav}>
                        <NavLink
                            exact
                            activeClassName={classes.activeLink}
                            to="/"
                        >
                            <Button className={classes.btn} startIcon={<HomeIcon />}>
                                Home
                            </Button>
                        </NavLink>
                        
                        <NavLink
                            activeClassName={classes.activeLink}
                            to="/shop"
                        >
                            <Button className={classes.btn} startIcon={<StorefrontIcon />}>
                                Shopping
                            </Button>
                        </NavLink>
                        <NavLink
                            activeClassName={classes.activeLink}
                            to="/cart"
                        >
                            <Button 
                                className={classes.btn} 
                                startIcon={<Badge badgeContent={totalCount} max={999} color="secondary">
                                                <ShoppingCartIcon />
                                            </Badge>}
                            >
                                Cart
                            </Button>
                        </NavLink>
                        {
                            isAuthenticated() && isAuthenticated().user.role === 0 && (
                                <NavLink
                                    activeClassName={classes.activeLink}
                                    to="/user/dashboard"
                                >
                                    <Button className={classes.btn} startIcon={<DashboardIcon />}>
                                        Dashboard
                                    </Button>
                                </NavLink>
                            )
                        }
                        {
                            isAuthenticated() && isAuthenticated().user.role === 1 && (
                                <NavLink
                                    activeClassName={classes.activeLink}
                                    to="/admin/dashboard"
                                >
                                    <Button className={classes.btn} startIcon={<DashboardIcon />}>
                                        Dashboard
                                    </Button>
                                </NavLink>
                            )
                        }
                        {
                            !isAuthenticated() && (
                                <Fragment>
                                    <NavLink
                                        activeClassName={classes.activeLink}
                                        to="/signin"
                                    >
                                        <Button className={classes.btn} startIcon={<PersonIcon />}>
                                            Signin
                                        </Button>
                                    </NavLink>
                                    <NavLink
                                        activeClassName={classes.activeLink}
                                        to="/signup"
                                    >
                                        <Button className={classes.btn} startIcon={<PersonAddIcon />}>
                                            Signup
                                        </Button>
                                    </NavLink>
                                </Fragment>
                            )
                        }
                        {
                            isAuthenticated() && (
                                <Button 
                                    className={classes.btn} 
                                    startIcon={<ExitToAppIcon />}
                                    onClick={() => signout(() => history.push("/"))}
                                >
                                    signout
                                </Button>
                            )
                        }
                    </div>

                </Toolbar>
            </AppBar>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        totalCount: state.totalCount
    }
}

const mapDispatchToProps = dispatch => {
    return {
        itemTotal: () => dispatch({type: TOTAL})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu));