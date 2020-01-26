import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read, listRelated } from './apiCore';
import ProductCard from './ProductCard';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3),
    },
}));

const Product = (props) => {
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);

    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setProduct(data);
                // fetch related products
                listRelated(data._id)
                    .then(res => {
                        if (res.error) {
                            console.log(res.error);
                        } else {
                            setRelatedProduct(res);
                        }
                    });
            }
        });
    }

    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props]);

    const classes = useStyles();


    return (
         <Layout>
            <Grid container className={classes.container}>
                <Grid item xs={6} align="center">
                    { product && product.description && 
                        <ProductCard 
                            product={product} 
                            showViewProductButton={false} 
                            showDescription={true}
                        />
                    }
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h4" gutterBottom color="primary">
                        Related Product
                    </Typography>
                    <Grid container spacing={3}>
                    { relatedProduct.map(p => (
                        <Grid key={p._id} item xs={12} sm={6} >
                            <ProductCard  product={p}/>
                        </Grid>
                    )) }
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default Product;