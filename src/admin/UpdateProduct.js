import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'; 
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { getCategories, getProduct, updateProduct } from './apiAdmin';
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

const UpdateProduct = ({match}) => {
    const { user, token } = isAuthenticated();

    const [ values, setValues ] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        shipping: "",
        quantity: "",
        photo: "",
        loading: false,
        error: "",
        createdProduct: "",
        formData: "",
        redirectRef: false,
    });

    const [categories, setCategories] = useState([])

    const {
        name,
        description,
        price,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        formData,
        photo,
        redirectRef,
    } = values;

    useEffect(() => {
        init(match.params.productId);
    }, []);

    const init = productId => {
        getProduct(productId).then(data => {
            if (data.error) {
                setValues({...data, error: data.error});
            } else {
                setValues({
                    ...values, 
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    shipping: data.shipping,
                    quantity: data.quantity,
                    formData: new FormData()
                });
                initCategories();
            }
        });
    }

    // loading categories
    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data);
            }
        });
    }

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, errro: false });
    }

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true });
        updateProduct(match.params.productId, user._id, token, formData)
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
                        error: false,
                        createdProduct: data.name,
                        redirectRef: true,
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
                    value={shipping ? "1" : "0"}
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
                    Update Product
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
            {`${createdProduct} is updated`}
        </Alert>
    );

    const showLoading = () => (
        <CircularProgress className={classes.alert}/>
    );

    const redirectToDashboard = () => redirectRef && (
        <Redirect to="/admin/dashboard" />
    )

    const classes = useStyles();

    return (
         <Layout>
            <AdminNav />
            <Grid container justify="center">
                { showError() }
                { showSuccess() }
                { loading ? showLoading() : newPostForm() }
                { redirectToDashboard() }
            </Grid>
        </Layout>
    )

}


export default UpdateProduct;