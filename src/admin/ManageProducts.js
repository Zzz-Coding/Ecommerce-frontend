import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { getProducts, deleteProduct } from './apiAdmin';
import { isAuthenticated } from '../auth';
import AdminNav from './AdminNav';
import { API } from '../config';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import IconButton from '@material-ui/core/IconButton';
import { red, blue } from '@material-ui/core/colors'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: 240,
    },
    list: {
        minWidth: 1000,
        width: '85%',
    },
    tile: {
        margin: theme.spacing(2),
    },
    title: {
        paddingLeft: 256,
        paddingTop: theme.spacing(2),
    },
}));

const ManageProducts = ({ history }) => {

    const [products, setProducts] = useState([]);
    const { user, token } = isAuthenticated();
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const loadProducts = () => {
        getProducts().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setProducts(data);
            }
        });
    }

    const destroy = () => {
        deleteProduct(deleteId, user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                loadProducts();
                setOpen(false);
                setDeleteId(null);
            }
        })
    }

    const update = productId => {
        history.push(`/admin/product/update/${productId}`);
    }

    const handleOpen = productId => {
        setOpen(true);
        setDeleteId(productId);
    }

    const handleClose = () => {
        setOpen(false);
        setDeleteId(null);
    }

    useEffect(() => {
        loadProducts();
    }, []);

    const classes = useStyles();

    return (
        <Layout>
            <AdminNav />
            <Typography variant="h4" className={classes.title}>
                Total Products: {products.length}
            </Typography>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure to delete this item?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Make sure you want to delete this item. Once delete, it CANNOT be recovered.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={destroy}
                        color="primary" 
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container justify="center" className={classes.root}>

                <GridList cellHeight={350} className={classes.list}>
                    {products.map(p => (
                        <GridListTile key={p._id} cols={0.6} className={classes.tile}>
                            <img src={`${API}/product/photo/${p._id}`} alt={p.name} />
                            <GridListTileBar
                                title={<Typography variant="h6">{p.name}</Typography>}
                                subtitle={p._id}
                                actionIcon={
                                    <div>
                                        <IconButton onClick={() => update(p._id)}>
                                            <CreateOutlinedIcon style={{ color: blue[300] }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpen(p._id)}>
                                            <DeleteOutlineIcon style={{ color: red[300] }} />
                                        </IconButton>
                                    </div>
                                }
                            />
                        </GridListTile>
                    ))}
                </GridList>

            </Grid>
        </Layout>
    )
};

export default ManageProducts;