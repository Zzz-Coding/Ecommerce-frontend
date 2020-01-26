import React, { useState } from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formGroup: {
      marginLeft: theme.spacing(5),
    },
}));

const CheckboxList = ({categories, handleFilters}) => {
    const [checked, setChecked] = useState([]);

    const handleToggle = id => () => {
        const currentCategoryIdIndex = checked.indexOf(id);
        const newCheckedCategoryId = [...checked];
        // if currently checked was not already in checked state > push
        // else take off
        if (currentCategoryIdIndex === -1) {
            newCheckedCategoryId.push(id);
        } else {
            newCheckedCategoryId.splice(currentCategoryIdIndex, 1);
        }
        setChecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    }

    const classes = useStyles();

    return (
        <FormGroup className={classes.formGroup}>
            {categories.map(c => (
                <FormControlLabel 
                    key={c._id}
                    control={
                        <Checkbox 
                            checked={checked.indexOf(c._id) !== -1} 
                            onChange={handleToggle(c._id)} 
                            color="primary"
                        />
                    }
                    label={c.name}
                />
            ))}
        </FormGroup>
    )
};

export default CheckboxList;