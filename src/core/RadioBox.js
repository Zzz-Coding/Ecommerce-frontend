import React, { useState } from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
      marginLeft: theme.spacing(5),
    },
}));

const RadioBox = ({prices, handleFilters}) => {
    const [value, setValue] = useState(0);

    const handleChange = (event) => {
        handleFilters(event.target.value);
        setValue(event.target.value);
    }

    const classes = useStyles();

    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup aria-label="price" value={value} onChange={handleChange}>
                {prices.map(p => (
                    <FormControlLabel 
                        key={p._id}
                        value={`${p._id}`}
                        control={<Radio />}
                        label={p.name}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

export default RadioBox;