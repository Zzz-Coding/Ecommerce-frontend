import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import  { getProducts } from './apiCore';
import ProductCard from './ProductCard';
import Banner from './Banner';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
}));

const Home = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);

    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setProductsBySell(data);
            }
        });
    }

    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setProductsByArrival(data);
            }
        })
    }

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    const classes = useStyles();

    return (
        <Layout>
            <Banner />
            <div className={classes.root}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Best Sellers
                </Typography>
                <Grid container spacing={3}>
                    {productsBySell.map((product, i) => (
                        <Grid item key={product._id} xs={12} md={6} lg={4}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
                <hr />
                <Typography variant="h4" color="primary" gutterBottom>
                    New Arrivals
                </Typography>
                <Grid container spacing={3}>
                    {productsByArrival.map((product, i) => (
                        <Grid item key={product._id} xs={12} md={6} lg={4} >
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            </div>

        </Layout>
    )
};

export default Home;
