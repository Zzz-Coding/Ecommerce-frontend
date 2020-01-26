import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import DropIn from "braintree-web-drop-in-react";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    margin: {
        marginBottom: theme.spacing(3),
    },
    btn: {
        textAlign: "center",
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Checkout = ({ products, run = undefined, setRun = f => f }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {},
        address: ""
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(res => {
            if (res.error) {
                setData({ ...data, error: res.error });
            } else {
                setData({ ...data, clientToken: res.clientToken });
            }
        })
    }

    useEffect(() => {
        getToken(userId, token);
    }, []);

    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    }

    const getTotal = () => {
        return products.reduce((cur, next) => {
            return cur + next.count * next.price;
        }, 0)
    };

    const showCheckout = () => {
        return (
            isAuthenticated() ? (
                <div>{showDropIn()}</div>
            ) : (
                <Link to="/signin">
                    <Button variant="contained" color="primary">
                        Sign in to checkout
                    </Button>
                </Link>
            )
        );
    };

    const buy = () => {
        setData({ ...data, loading: true });
        // send the nonce to server
        // nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
            .then(res => {
                // console.log(res);
                nonce = res.nonce;
                // console.log("send nonce and total to process", nonce, getTotal(products));
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        // console.log(response);
                        const orderData = {
                            products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: data.address
                        }
                        createOrder(userId, token, orderData)
                            .then(() => {
                                emptyCart(() => {
                                    console.log("payment success and empty cart");
                                    setRun(!run);
                                    setData({ ...data, loading: false, success: true });
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                setData({ ...data, loading: false });
                            })
                    })
                    .catch(error => {
                        console.log(error);
                        setData({ ...data, loading: false });
                    });
            })
            .catch(err => {
                console.log("dropin error", err);
                setData({ ...data, error: err.message });
            });
    }

    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: "" })}>
            { data.clientToken !== null && products.length > 0 ? (
                <div>
                    <TextField
                        label="Delivery Address"
                        multiline
                        rows="4"
                        variant="outlined"
                        onChange={handleAddress}
                        value={data.address}
                        fullWidth
                        autoComplete="street-address"
                    />
                    <DropIn options={{
                        authorization: data.clientToken,
                        paypal: {
                            flow: "vault"
                        }
                    }} onInstance={instance => (data.instance = instance)}/>
                    <div className={classes.btn}>
                        <Button variant="contained" color="primary" size="large" onClick={buy}>
                            Pay
                        </Button>
                    </div>
                </div>
            ) : null }
        </div>
    );

    const showError = error => error && (
        <Alert variant="filled" severity="warning" className={classes.margin}>
            { error }
        </Alert>
    );

    const showSuccess = success => success && (
        <Alert variant="filled" severity="success" className={classes.margin}>
            Thanks! Your payment was successful!
        </Alert>
    );

    const showLoading = loading => (
        loading && (
            <Backdrop className={classes.backdrop} open>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    )

    const classes = useStyles();

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Total: ${getTotal()}
            </Typography>
            { showLoading(data.loading) }
            { showSuccess(data.success) }
            { showError(data.error) }
            { showCheckout() }
        </div>
    )
}

export default Checkout;