import { itemTotal } from "../core/cartHelpers";
import { TOTAL } from '../actions/actions';

const initialState = {
    totalCount: 0,
};

const reducer = (state = initialState, action) => {
    if (action.type === TOTAL) {
        return {
            totalCount: itemTotal()
        }
    }
    return state;
}

export default reducer;