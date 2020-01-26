import React from 'react';
import Layout from '../core/Layout';
import AdminNav from './AdminNav';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        paddingLeft: 240,
        marginTop: '20%',
    },
}));

const AdminDashboard = () => {

    const sayHi = () => {
        let hour = new Date().getHours();
        let text;
        if (hour < 12) {
            text = 'Morning';
        } else if (hour < 18) {
            text = 'Afternoon';
        } else {
            text = 'Evening';
        }
        return (
            <Grid container justify="center" className={classes.root}>
                <Typography variant="h3" color="primary">{`Good ${text} !`}</Typography>
            </Grid>
        )
    }

    const classes = useStyles();

    return (
        <Layout>
            <AdminNav />
            { sayHi() }
        </Layout>
    )
};

export default AdminDashboard;