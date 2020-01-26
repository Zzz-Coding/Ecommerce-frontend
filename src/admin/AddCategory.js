import React, { useState } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createCategory } from './apiAdmin';
import AdminNav from './AdminNav';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import CategoryIcon from '@material-ui/icons/Category';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    form: {
        width: 500,
        padding: theme.spacing(3),
        marginLeft: 240,
    },
    btn: {
        marginTop: theme.spacing(3),
    },
    alert: {
        marginTop: theme.spacing(3),
        marginLeft: 240,
    },
}));

const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { user, token } = isAuthenticated();

    const handleChange = e => {
        setError('');
        setSuccess(false);
        setName(e.target.value);
    }

    const clickSubmit = e => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        createCategory(user._id, token, {name})
            .then(data => {
                if (data.error) {
                    setError(true);
                } else {
                    setError("");
                    setSuccess(true);
                }
            });
    };

    const newCategoryForm = () => (
        <form className={classes.form}>
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
                            <CategoryIcon />
                        </InputAdornment>
                    ),
                }}
                onChange={ handleChange }
                value={ name }
                autoFocus 
            />
            <Button 
                onClick={clickSubmit} 
                variant="contained" 
                color="primary" 
                fullWidth
                className={classes.btn}
            >
                Create Category
            </Button>
        </form>
    );

    const showSuccess = () => success && (
        <Alert className={classes.alert} severity="success">
            {name} is created
        </Alert>
    )

    const showError = () => error && (
        <Alert className={classes.alert} severity="warning">
            Category should be unique
        </Alert>
    );

    const classes = useStyles();

    return (
        <Layout>
            <AdminNav />
            <Grid container justify="center">
                { showError() }
                { showSuccess() }
                { newCategoryForm() }
            </Grid>
            
        </Layout>
    )
};

export default AddCategory;