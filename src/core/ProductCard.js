import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';
import TextField from '@material-ui/core/TextField';

import moment from 'moment';
import { addItem, updateItem, removeItem } from './cartHelpers';
import { API } from '../config';
import { TOTAL } from '../actions/actions';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 500,
        textAlign: "start",
    },
    media: {
        height: 0,
        paddingTop: '75%',
        backgroundSize: 'contain',
    },
    cartBtn: {
        color: orange[500],
        borderColor: orange[500],
    },
    green: {
        color: green[500],
    },
    countField: {
        marginTop: theme.spacing(2),
    },
}));

const ProductCard = ({
    product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    showDescription = false,
    showPrice = true,
    run = undefined,
    setRun = f => f,
    itemTotal
}) => {
    const [count, setCount] = useState(product.count);
    // avoid multiple clicks in short time
    const [disabled, setDisabled] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);

    const addToCart = () => {
        if (disabled) {
            return;
        }
        setDisabled(true);
        setShowSuccess(false);
        addItem(product, () => { 
            itemTotal();
            setTimeout(() => {
                setDisabled(false); 
                setShowSuccess(true);
            }, 400);
        });
    }

    // update item count
    const handleChange = (productId, quantity) => event => {
        let value = event.target.value < 1 ? 1 : event.target.value;
        value = value > quantity ? quantity : value;
        setCount(value);
        updateItem(productId, value);
        itemTotal();
        setRun(!run);
    }

    const showAddSuccess = () => showSuccess && (
        <Typography variant="h6" className={classes.green}>
            Added Successfully!
        </Typography>
    )

    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`}>
                    <Button variant="outlined" color="primary">
                        See Details
                    </Button>
                </Link>
            )
        );
    }

    const showAddToCart = (showAddToCartButton, quantity) => {
        return (
            showAddToCartButton && (
                <Button disabled={quantity < 1} variant="outlined" className={classes.cartBtn} onClick={addToCart}>
                    Add to Cart
                </Button>
            )
        );
    }

    const showRemoveButton = (showRemoveProductButton) => {
        return (
            showRemoveProductButton && (
                <Button variant="outlined" color="secondary" onClick={() => { removeItem(product._id); itemTotal(); setRun(!run); }} >
                    Remove Product
                </Button>
            )
        );
    }

    const showStock = quantity => {
        return quantity > 0 ? (
            <Typography variant="subtitle1" className={classes.green} gutterBottom>
                In Stock.
            </Typography>
        ) : (
            <Typography variant="subtitle1" color="secondary" gutterBottom>
                Out of Stock.
            </Typography>
        );
    }

    const showProductDescription = showDescription => showDescription && (
        <Typography variant="body2" color="textSecondary" component="p">
            {product.description.substring(0, 200)}
        </Typography>
    );

    const showProductPrice = showPrice => showPrice && (
        <Typography variant="h6">
            ${product.price}
        </Typography>
    );

    const showCartUpdateOptions = cartUpdate => {
        return cartUpdate && (
            <TextField
                className={classes.countField}
                label="Quantity"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={count}
                onChange={handleChange(product._id, product.quantity)}
            />
        )
    }

    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader 
                title={product.name} 
                subheader={`Added ${moment(product.createdAt).fromNow()}`} 
                action={<Chip label={product.category.name} color="primary"/>}
            />
            <CardMedia 
                className={classes.media}
                image={`${API}/product/photo/${product._id}`}
                title={product.name}
            />
            <CardContent> 
                { showProductDescription(showDescription) }
                { showStock(product.quantity) }
                {showProductPrice(showPrice)}
                {showAddSuccess()}
                {showCartUpdateOptions(cartUpdate)}
            </CardContent>
            <CardActions>
                {showViewButton(showViewProductButton)}

                {showAddToCart(showAddToCartButton, product.quantity)}

                {showRemoveButton(showRemoveProductButton)}
            </CardActions>
        </Card>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        itemTotal: () => dispatch({type: TOTAL})
    }
}

export default connect(null, mapDispatchToProps)(ProductCard);