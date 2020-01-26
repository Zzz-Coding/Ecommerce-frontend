import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      padding: '2px 4px',
      marginBottom: theme.spacing(2),
    },
    iconButton: {
      padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    input: {
        flex: 1,
        marginLeft: theme.spacing(1),
    },
}));

const Search = (props) => {
    const [search, setSearch] = useState("");

    const classes = useStyles();

    const handleChange = e => {
        setSearch(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        props.handleSearch(search);
    }

    return (
        <Paper component="form" className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder="Search by name"
                inputProps={{ 'aria-label': 'search by name' }}
                onChange={handleChange}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton 
                type="submit" 
                className={classes.iconButton} 
                aria-label="search"
                onClick={handleSubmit}
                color="primary"
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    )

}

export default Search;