import React from 'react';
import {CartDish} from '../../types';
import CartItem from './CartItem';

interface Props {
  cartDishes: CartDish[];
}

const CartDishes: React.FC<Props> = ({cartDishes}) => {
  const total = cartDishes.reduce((sum, cartDish) => {
    return sum + cartDish.amount * cartDish.dish.price;
  }, 0);

  return (
    <>
      {cartDishes.map((cartDish) => (
        <CartItem key={cartDish.dish.id} cartDish={cartDish} />
      ))}
      <div className="card border-0 p-2">
        <div className="row">
          <div className="col text-end">
            Total:
          </div>
          <div className="col-3 text-end">
            <strong>{total}</strong> KGS
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDishes;