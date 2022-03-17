import {
    ADD_TO_CART,
    CLEAR_CART,
    COUNT_CART_TOTALS,
    REMOVE_CART_ITEM,
    TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
    if (action.type === ADD_TO_CART) {
        const { id, color, amount, product } = action.payload;
        const tempItem = state.cart.find((i) => i.id === id + color);

        if (tempItem) {
            const tempCart = state.cart.map((cartItem) => {
                if (cartItem.id === id + color) {
                    let newAmount = cartItem.amount + amount;
                    if (newAmount > cartItem.max) {
                        newAmount = cartItem.max;
                    }
                    return { ...cartItem, amount: newAmount };
                } else {
                    return cartItem;
                }
            });

            return { ...state, cart: tempCart };
        } else {
            const newItem = {
                id: id + color,
                name: product.name,
                color,
                amount,
                image: product.images[0].url,
                price: product.price,
                max: product.stock,
            };

            return { ...state, cart: [...state.cart, newItem] };
        }
    }
    if (action.type === REMOVE_CART_ITEM) {
        const tempCart = state.cart.filter(
            (item) => item.id !== action.payload
        );
        return { ...state, cart: tempCart };
    }
    if (action.type === CLEAR_CART) {
        return { ...state, cart: [] };
    }
    if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
        const { id, value } = action.payload;

        const tempItem = state.cart.filter((item) => item.id === id)[0];

        const { amount, max } = tempItem;

        let tempAmount;
        if (value === "inc") {
            tempAmount = Number(amount) + 1;
            if (tempAmount > max) {
                tempAmount = max;
            }
        } else if (value === "dec") {
            tempAmount = Number(amount) - 1;
            if (tempAmount < 1) {
                const tempCart = state.cart.filter((item) => item.id !== id);
                return { ...state, cart: tempCart };
            }
        }

        const tempCart = state.cart.map((item) => {
            if (item.id === id) {
                item.amount = tempAmount;
            }
            return item;
        });
        return { ...state, cart: tempCart };
    }
    if (action.type === COUNT_CART_TOTALS) {
        const tempTotals = state.cart.reduce(
            (total, item) => {
                total.amount += item.amount;
                total.price += item.amount * item.price;
                return total;
            },
            { amount: 0, price: 0 }
        );
        return {
            ...state,
            total_items: tempTotals.amount,
            total_amount: tempTotals.price,
        };
    }
    throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
