import {useCallback, useEffect, useState} from 'react';
import {CartDish, Dish, DishesList} from './types';
import Home from './containers/Home/Home';
import NewDish from './containers/NewDish/NewDish';
import {Route, Routes, useLocation} from 'react-router-dom';
import Checkout from './containers/Checkout/Checkout';
import Order from './containers/Order/Order';
import axiosApi from './axiosApi';
import EditDish from './containers/EditDish/EditDish';
import Orders from './containers/Orders/Orders';
import Layout from './components/Layout/Layout';

function App() {
  const location = useLocation();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartDishes, setCartDishes] = useState<CartDish[]>([]);

  const updateCart = useCallback((dishes: Dish[]) => {
    setCartDishes((prevState) => {
      const newCartDishes: CartDish[] = [];

      prevState.forEach((cartDish) => {
        const existingDish = dishes.find(dish => cartDish.dish.id === dish.id);

        if (!existingDish) {
          return;
        }

        newCartDishes.push({
          ...cartDish,
          dish: existingDish,
        });
      });

      return newCartDishes;
    });
  }, []);

  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);

      const dishesResponse = await axiosApi.get<DishesList | null>('dishes.json');
      const dishes = dishesResponse.data;

      if (!dishes) {
        setDishes([]);
      } else {
        const newDishes = Object.keys(dishes).map((id) => {
          const dish = dishes[id];
          return {
            ...dish,
            id,
          };
        });

        setDishes(newDishes);
        updateCart(newDishes);
      }
    } finally {
      setLoading(false);
    }
  }, [updateCart]);

  useEffect(() => {
    if (location.pathname === '/') {
      void fetchDishes();
    }
  }, [location.pathname, fetchDishes]);

  const deleteDish = async (id: string) => {
    if (window.confirm('Do you really want to delete?')) {
      await axiosApi.delete('dishes/' + id + '.json');
      await fetchDishes();
    }
  };

  const addDishToCart = (dish: Dish) => {
    setCartDishes((prevState) => {
      const existingIndex = prevState.findIndex((cartDish) => {
        return cartDish.dish === dish;
      });

      if (existingIndex === -1) {
        const newCartDish: CartDish = {dish, amount: 1};
        return [...prevState, newCartDish];
      } else {
        const itemsCopy = [...prevState];
        const itemCopy = {...itemsCopy[existingIndex]};
        itemCopy.amount++;
        itemsCopy[existingIndex] = itemCopy;
        return itemsCopy;
      }
    });
  };

  const clearCart = () => {
    setCartDishes([]);
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={(
          <Home
            dishesLoading={loading}
            dishes={dishes}
            addToCart={addDishToCart}
            cartDishes={cartDishes}
            deleteDish={deleteDish}
          />
        )}/>
        <Route path="/new-dish" element={<NewDish/>}/>
        <Route path="/edit-dish/:id" element={<EditDish/>}/>
        <Route path="/checkout" element={(
          <Checkout cartDishes={cartDishes}/>
        )}>
          <Route path="continue" element={(
            <Order cartDishes={cartDishes} clearCart={clearCart}/>
          )}/>
        </Route>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="*" element={(<h1>Not Found!</h1>)}/>
      </Routes>
    </Layout>
  );
}

export default App;
