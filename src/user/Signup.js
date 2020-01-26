import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup } from '../auth';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
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
    inline: {
        display: "inline",
    },
}));

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const { name, email, password, error, success } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, success: false });
                    console.log("error", data.error);
                } else {
                    setValues({
                        ...values,
                        name: "",
                        email: "",
                        password: "",
                        error: "",
                        success: true
                    });
                }
            });
    };

    const showError = () => error && (
        <Alert variant="filled" severity="warning">
            { error }
        </Alert>
    )

    const showSuccess = () => success && (
        <Alert variant="outlined" severity="success" classes={{message: classes.inline}}>
            New account is created, please <Link to="/signin">Signin</Link>
        </Alert>
    )

    const signUpForm = () => (
        <form className={classes.root} align="center">
            {showError()}
            {showSuccess()}
            <TextField
                type="text"
                label="Name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircleIcon />
                        </InputAdornment>
                    ),
                }}
                onChange={ handleChange('name') }
                value={ name } 
            />
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
                Sign up
            </Button>
        </form>
    );

    const classes = useStyles();

    return (
        <Layout>
            {signUpForm()}
        </Layout>
    )
}

export default Signup;