import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
    root: {
        width: 500,
        padding: theme.spacing(5),
        margin: "auto",
    },
    btn: {
        marginTop: theme.spacing(3),
    },
}));

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToRef: false
    });

    const { email, password, error, redirectToRef } = values;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false});
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            redirectToRef: true
                        });
                    })
                }
            });
    };

    const showError = () => error && (
        <Alert variant="filled" severity="warning">
            { error }
        </Alert>
    )

    const redirectUser = () => {
        if (redirectToRef) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            }
            return <Redirect to="/user/dashboard" />
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    const signinForm = () => (
        <form className={classes.root} align="center">
            {showError()}
            <TextField
                type="email"
                label="Email"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <EmailIcon />
                        </InputAdornment>
                    ),
                }}
                onChange={ handleChange('email') }
                value={ email } 
            />
            <TextField
                type="password"
                label="Password"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockIcon />
                        </InputAdornment>
                    ),
                }}
                onChange={ handleChange('password') } 
                value={ password }
            />
            
            <Button 
                onClick={clickSubmit} 
                variant="contained" 
                color="primary" 
                fullWidth
                className={classes.btn}
            >
                Sign in
            </Button>
        </form>
    );

    const classes = useStyles();

    return (
        <Layout>
            {redirectUser()}
            {signinForm()}
        </Layout>
    )
}

export default Signin;