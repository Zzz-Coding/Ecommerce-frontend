import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { getPurchaseHistory } from './apiUser';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import PersonIcon from '@material-ui/icons/Person';
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
    root: {
        paddingLeft: 256,
        paddingRight: theme.spacing(2),
    },
    card: {
        padding: theme.spacing(1),
    },
    detail: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    purchase: {
        marginLeft: 256,
        marginTop: theme.spacing(2),
    },
}));

const UserDashboard = () => {
    const [history, setHistory] = useState([]);

    const { user: {_id, name, role}, token } = isAuthenticated();

    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setHistory(data);
            }
        });
    }

    useEffect(() => {
        init(_id, token);
    }, []);

    const purchaseHistory = () => {
        return (
            <Grid container spacing={3} className={classes.root}>
                { history.map(h => (
                    <Grid key={h._id} item xs={6} ms={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                title={`Order ID: ${h._id}`}
                                subheader={`Purchased ${moment(h.createdAt).fromNow()}`}
                                action={<Chip label={h.status} color="primary"/>}
                            />
                            <CardContent>
                                { h.products.map(p => (
                                    <div key={p._id} className={classes.detail}>
                                        <Typography variant="subtitle1">{p.name}</Typography>
                                        <Typography variant="subtitle1">x{p.count}</Typography>
                                        <Typography variant="subtitle1">${p.price}</Typography>
                                    </div>
                                )) }
                                <hr />
                                <Typography variant="h6" gutterBottom>Total: ${h.amount}</Typography>
                                <Typography variant="h6" gutterBottom>Delivery Address: {h.address}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )) }
            </Grid>
        );
    };

    const classes = useStyles();

    return (
        <Layout>
            <Drawer
                anchor="left"
                classes={{ paper: classes.drawer }}
                open={true}
                variant="permanent"
            >
                <div className={classes.profile}>
                    <Avatar className={classes.avatar}>{name.charAt(0).toUpperCase()}</Avatar>
                    <Typography variant="h5" gutterBottom>{name}</Typography>
                    { role === 1 ? 
                        <Chip
                            icon={<SupervisorAccountIcon />}
                            label="Admin"
                            color="secondary"
                            size="small"
                        /> :
                        <Chip
                            icon={<PersonIcon />}
                            label="User"
                            color="primary"
                            size="small"
                        />
                    }
                </div>
            </Drawer>
            <Typography variant="h4" className={classes.purchase}>Purchase History</Typography>
            { purchaseHistory() }
        </Layout>
    )
};

export default UserDashboard;