import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createProduct, getCategories } from './apiAdmin';
import AdminNav from './AdminNav';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    form: {
        marginLeft: 240,
        marginTop: theme.spacing(3),
        maxWidth: 800,
    },
    imgInput: {
        display: 'none',
    },
    file: {
        marginLeft: theme.spacing(1),
        display: 'inline',
    },
    formControl: {
        minWidth: 120,
        margin: theme.spacing(1, 0),
    },
    btn: {
        marginTop: theme.spacing(2),
        textAlign: 'center',
    },
    alert: {
        marginLeft: 240,
        marginTop: theme.spacing(3),
    },
}));

const AddProduct = () => {
    const { user, token } = isAuthenticated();

    const [ values, setValues ] = useState({
        name: "",
        description: "",
        price: "",
        categories: [],
        category: "",
        shipping: "",
        quantity: "",
        photo: null,
        loading: false,
        error: "",
        createdProduct: "",
        formData: ""
    });

    const {
        name,
        description,
        price,
        categories,
        photo,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        formData
    } = values;

    useEffect(() => {
        init();
    }, [])

    // loading categories and set form data
    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, categories: data, formData: new FormData() });
            }
        })
    }

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, error: false });
    }

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true });

        createProduct(user._id, token, formData)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    setValues({
                        ...values,
                        name: "",
                        description: "",
                        photo: "",
                        price: "",
                        quantity: "",
                        loading: false,
                        createdProduct: data.name
                    });
                }
            });
    }

    const newPostForm = () => (
        <div className={classes.form}>
            <input 
                type="file"
                id="photo"
                onChange={handleChange('photo')}
                className={classes.imgInput}
                accept="image/*"
            />
            <label htmlFor="photo">
                <Button 
                    color="primary" 
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    variant="outlined"
                >
                    Choose File
                </Button>
                <Typography className={classes.file} variant="subtitle2">{photo ? photo.name : "No file"}</Typography>
            </label>
            <TextField 
                type="text"
                label="Name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                onChange={ handleChange('name') }
                value={ name }
            />
            <TextField 
                type="text"
                label="Description"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                onChange={ handleChange('description') }
                value={ description }
                multiline
                rows={4}
            />
            <TextField 
                type="text"
                label="Price"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                onChange={ handleChange('price') }
                value={ price }
            />
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="category">
                    Category
                </InputLabel>
                <Select
                    labelId="category"
                    onChange={handleChange('category')}
                    value={category}
                >
                    { categories && categories.map(c => (
                        <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    )) }
                </Select>
            </FormControl>
            <TextField 
                type="text"
                label="Quantity"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                onChange={ handleChange('quantity') }
                value={ quantity }
            />
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="shipping">
                    Shipping
                </InputLabel>
                <Select
                    labelId="shipping"
                    onChange={handleChange('shipping')}
                    value={shipping}
                >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                </Select>
            </FormControl>
            <div className={classes.btn}>
                <Button 
                    onClick={clickSubmit} 
                    variant="contained" 
                    color="primary" 
                    size="large"
                >
                    Create Product
                </Button>
            </div>
            
        </div>
    );

    const showError = () => error && (
        <Alert className={classes.alert} severity="warning">
            {error}
        </Alert>
    )

    const showSuccess = () => createdProduct && (
        <Alert className={classes.alert} severity="success">
            {`${createdProduct} is created`}
        </Alert>
    );

    const showLoading = () => (
        <CircularProgress className={classes.alert}/>
    );

    const classes = useStyles();

    return (
         <Layout>
            <AdminNav />
            <Grid container justify="center">
                { showError() }
                { showSuccess() }
                { loading ? showLoading() : newPostForm() }
            </Grid>
        </Layout>
    )

}

export default AddProduct;