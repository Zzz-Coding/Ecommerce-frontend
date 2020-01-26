import React from 'react';
import { isAuthenticated } from '../auth';
import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CategoryIcon from '@material-ui/icons/Category';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import CreateIcon from '@material-ui/icons/Create';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Chip from '@material-ui/core/Chip';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
        marginTop: 64,
        height: 'calc(100% - 64px)',
        padding: theme.spacing(2),
    },
    avatar: {
        width: 60,
        height: 60,
    },
    profile: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'fit-content'
    },
    divider: {
        margin: theme.spacing(2, 0)
    },
    button: {
        color: blueGrey[800],
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
        fontWeight: theme.typography.fontWeightMedium
    },
    icon: {
        color: theme.palette.icon,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(1)
    },
    active: {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
        '& $icon': {
            color: theme.palette.primary.main
        }
    },
}));

const AdminNav = () => {

    const { user: { name } } = isAuthenticated();

    const navs = [
        {
            title: 'Create Category',
            href: '/create/category',
            icon: <CategoryIcon />
        },
        {
            title: 'Create Product',
            href: '/create/product',
            icon: <AddCircleOutlineIcon />
        },
        {
            title: 'View Orders',
            href: '/admin/orders',
            icon: <ShoppingBasketIcon />
        },
        {
            title: 'Manage Products',
            href: '/admin/products',
            icon: <CreateIcon />
        },
    ];

    const classes = useStyles();

    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            open={true}
            variant="permanent"
        >
            <div className={classes.profile}>
                <Avatar className={classes.avatar}>{name.charAt(0).toUpperCase()}</Avatar>
                <Typography variant="h5" gutterBottom>{name}</Typography>
                <Chip
                    icon={<SupervisorAccountIcon />}
                    label="Admin"
                    color="secondary"
                    size="small"
                />
            </div>
            <Divider className={classes.divider} />
            <List>
                {navs.map(nv => (
                    <ListItem key={nv.title}>
                        <Button
                            activeClassName={classes.active}
                            className={classes.button}
                            component={NavLink}
                            to={nv.href}
                        >
                            <div className={classes.icon}>{nv.icon}</div>
                            {nv.title}
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
};

export default AdminNav;