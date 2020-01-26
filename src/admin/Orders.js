import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';
import AdminNav from './AdminNav';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: 256,
        paddingRight: theme.spacing(2),
    },
    order: {
        marginLeft: 256,
        marginTop: theme.spacing(2),
    },
    card: {
        padding: theme.spacing(1),
    },
    chip: {
        marginTop: theme.spacing(1),
    },
    detail: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}));

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);

    const {user, token} = isAuthenticated();

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setOrders(data);
            }
        })
    };

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setStatusValues(data);
            }
        });
    };

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <Typography className={classes.order} variant="h4">Total Orders: {orders.length}</Typography>
            )
        }
        return <Typography className={classes.order} variant="h4">No order</Typography>
    };

    const handleStatusChange = (e, orderId) => {
        updateOrderStatus(user._id, token, orderId, e.target.value).then(data => {
            if (data.error) {
                console.log("Status update failed");
            } else {
                loadOrders();
            }
        })
    }

    const showStatus = o => (
        <FormControl variant="outlined">
            <InputLabel id="status">
                Status
            </InputLabel>
            <Select
                labelId="status"
                onChange={e => handleStatusChange(e, o._id)}
                value={o.status}
            >
                { statusValues.map((s, i) => (
                    <MenuItem key={i} value={s}>{s}</MenuItem>
                )) }
            </Select>
        </FormControl>
    );

    const classes = useStyles();

    return (
        <Layout>
            <AdminNav />
            { showOrdersLength() }
            <Grid container spacing={3} className={classes.root}>
                
                { orders.map(o => (
                    <Grid key={o._id} item xs={12} sm={6}>
                        <Card className={classes.card}>
                            <CardHeader 
                                title={`Order ID: ${o._id}`}
                                subheader={<Chip className={classes.chip} label={o.status} color="primary" />}
                                action={showStatus(o)}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Transaction ID: {o.transaction_id}</Typography>
                                <Typography variant="h6" gutterBottom>Amount: ${o.amount}</Typography>
                                <Typography variant="h6" gutterBottom>Ordered by: {o.user.name}</Typography>
                                <Typography variant="h6" gutterBottom>Ordered on: {moment(o.createdAt).fromNow()}</Typography>
                                <Typography variant="h6" gutterBottom>Delivery address: {o.address}</Typography>
                                <hr />
                                <Typography variant="h5">Total products in the order: {o.products.reduce((acc, cur) => acc + cur.count, 0)}</Typography>
                                { o.products.map(p => (
                                    <div key={p._id} className={classes.detail}>
                                        <Typography variant="subtitle1">{p.name}</Typography>
                                        <Typography variant="subtitle1">x{p.count}</Typography>
                                        <Typography variant="subtitle1">${p.price}</Typography>
                                    </div>
                                )) }
                            </CardContent>
                        </Card>
                    </Grid>
                )) }
            </Grid>
       </Layout>
   )
}

export default Orders;