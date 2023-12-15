import React from 'react';
import {CartDish} from '../../types';
import CartDishes from '../../components/Cart/CartDishes';
import {Link, Navigate, Outlet} from 'react-router-dom';

interface Props {
  cartDishes: CartDish[];
}

const Checkout: React.FC<Props> = ({cartDishes}) => {
  if (cartDishes.length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <div className="row mt-2">
      <div className="col-8 m-auto">
        <h4>Checkout</h4>
        <CartDishes cartDishes={cartDishes}/>
        <div className="d-flex gap-2">
          <Link className="btn btn-danger" to="/">Cancel</Link>
          <Link className="btn btn-primary" to="continue">Continue</Link>
        </div>
        <Outlet/>
      </div>
    </div>
  );
};

export default Checkout;