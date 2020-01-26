import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import  { getCart } from './cartHelpers';
import ProductCard from './ProductCard';
import Checkout from './Checkout';
import { itemTotal } from './cartHelpers';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
    },
}));

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const classes = useStyles();

    const showItems = items => (
        <div>
            <Typography variant="h4" gutterBottom>Your cart has {`${itemTotal()}`} items</Typography>
            <Grid container spacing={3}>
                { items.map(product => (
                    <Grid key={product._id} item xs={12} sm={6}>
                        <ProductCard
                            product={product} 
                            showAddToCartButton={false}
                            cartUpdate={true}
                            showRemoveProductButton={true}
                            run={run}
                            setRun={setRun}
                        />
                    </Grid>
                )) }
            </Grid>
        </div>
    );

    const noItemsMessage = () => (
        <Typography variant="h4" gutterBottom>Your cart is empty, <br/> <Link to="/shop">Continue shopping</Link></Typography>
    );

    return (
        <Layout>
            <Grid container spacing={3} className={classes.root}>
                <Grid item xs={7} align="center">
                    { items.length > 0 ? showItems(items) : noItemsMessage() }
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="h4" gutterBottom>Cart Summary</Typography>
                    <Checkout products={items} run={run} setRun={setRun}/>
                </Grid>
            </Grid>
        </Layout>
   );
}

export default Cart;