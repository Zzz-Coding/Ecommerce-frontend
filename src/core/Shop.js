import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import ProductCard from './ProductCard';
import { getCategories, getFilteredProducts } from './apiCore';
import CheckboxList from './CheckboxList';
import { prices } from './fixedPrice';
import RadioBox from './RadioBox';
import Search from './Search';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
    load: {
        display: "flex",
        justifyContent: "center",
    },
}));

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] },
    });
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setCategories(data);
            }
        });
    };

    // called when page load or when user sets a new filter
    const loadFilterResults = () => {
        getFilteredProducts(0, limit, myFilters.filters, search).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults(data.data);
                setSize(data.size);
                setSkip(0);
            }
        });
    };

    const loadMore = () => {
        let toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilters.filters, search).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults([...filteredResults, ...data.data]);
                setSize(data.size);
                setSkip(toSkip);
            }
        });
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <div className={classes.load}>
                    <Button onClick={loadMore} variant="contained" color="primary">Load more</Button>
                </div>
            )
        );
    }

    useEffect(() => {
        init();
        loadFilterResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadFilterResults();
    }, [myFilters, search]);


    const handleSearch = searchValue => {
        setSearch(searchValue);
        //loadFilterResults();
    }

    // set the filters the user chose
    const handleFilters = (filters, filterBy) => {
        const newFilters = { ...myFilters };
        newFilters.filters[filterBy] = filters;

        if (filterBy === "price") {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }

        setMyFilters(newFilters);
        //loadFilterResults();
    }

    const handlePrice = value => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const classes = useStyles();

    return (
        <Layout className={classes.root}>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <Search handleSearch={(searchValue) => handleSearch(searchValue)} />
                    <Typography variant="h6" gutterBottom>
                        Filter by category
                    </Typography>
                    <CheckboxList
                        categories={categories} 
                        handleFilters={(filters) => handleFilters(filters, "category")}
                    />

                    <Typography variant="h6" gutterBottom>
                        Filter by price
                    </Typography>
                    <RadioBox 
                        prices={prices} 
                        handleFilters={(filters) => handleFilters(filters, "price")}
                    />
                </Grid>
                <Grid item xs={9}>
                    <Typography variant="h4" gutterBottom>
                        Products
                    </Typography>
                    <Grid container spacing={3} >
                        {filteredResults.map((product, i) => (
                            <Grid item xs={12} md={6} lg={4} key={product._id} >
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                    <hr />
                    { loadMoreButton() }
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Shop;