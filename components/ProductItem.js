//react/next/packages

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
} from '@mui/material';
import { Colors, Devices } from '../utils/Theme';

import Image from 'next/image';
import { Store } from '../utils/Store';
import UcdCoin from '../public/images/uu/ucd-coin.png';
import axios from 'axios';
import classes from '../utils/classes';
import styled from 'styled-components';
import { useContext } from 'react';

//material ui

//styling

const Trapezium = styled.div`
  padding: 6px 13px;
  background: ${Colors.bg};
  border-top: none;
  border-bottom-right-radius: 1em 2em;
  border-bottom-left-radius: 1em 2em;
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  font-family: 'Oxanium';
  @media ${Devices.Tablet} {
    top: -15%;
  }
  @media ${Devices.TabletL} {
    top: -2%;
  }
  & p {
    margin-top: 55px;
    text-align: center;
  }
`;
const ProductName = styled.div`
  color: '#ffffff';
  font-size: '14px';
  font-family: 'Oxanium';
`;
const ProductPrice = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'Oxanium';
`;
const ProductCost = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-inline: 5px;
  font-family: 'Oxanium';
`;
const ProductCurrency = styled.div`
  font-size: 14px;
  align-self: end;
  color: #c4c4c4;
  font-family: 'Oxanium';
`;
const ProductDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Oxanium';
`;
const RemainingProduct = styled.div`
  color: ${Colors.UUPrimary};
  font-size: 12px;
  font-family: 'Oxanium';
`;
const AddToCart = styled.button`
  background-color: ${Colors.UUPrimary};
  width: 100%;
  text-align: center;
  border-radius: 40px;
  color: #ffffff;
  font-size: 15px;
  padding: 6px 14px;
  font-family: 'Oxanium';
  border: none;
  cursor: pointer;
`;
const RemoveFromCart = styled.button`
  background-color: ${Colors.UUPrimary};
  width: 100%;
  text-align: center;
  border-radius: 40px;
  color: #ffffff;
  font-size: 14px;
  padding: 6px 10px;
  font-family: 'Oxanium';
  border: none;
  cursor: pointer;
`;
const NoStock = styled.button`
  background-color: ${Colors.Dialog};
  width: 100%;
  text-align: center;
  border-radius: 40px;
  color: #ffffff;
  font-size: 15px;
  padding: 6px 14px;
  font-family: 'Oxanium';
  border: none;
  cursor: default;
`;

function ProductItem({ product }) {
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };
  const removeFromCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { ...product, quantity } });
  };

  return (
    <Card sx={classes.nftCard}>
      <CardActionArea
        disableRipple
        onClick={() => addToCartHandler(product)}
        sx={{ position: 'relative' }}
      >
        <Trapezium>
          <div>{product.brand}</div>
        </Trapezium>
        <CardMedia
          component="img"
          image={product.image}
          title={product.name}
        ></CardMedia>
        <CardContent sx={{ zIndex: '1' }}>
          <ProductDetails>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>
              <Image src={UcdCoin} width="15" height="15" alt="ucdCoin" />
              <ProductCost>{product.price}</ProductCost>
              <ProductCurrency>{product.currency}</ProductCurrency>
            </ProductPrice>
          </ProductDetails>
          <RemainingProduct>
            {product.originalCount - product.countInStock}/
            {product.originalCount}
          </RemainingProduct>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {product.countInStock > 0 ? (
          state.cart.cartItems.some((x) => x._id === product._id) ? (
            <RemoveFromCart onClick={() => removeFromCartHandler(product)}>
              Remove from cart
            </RemoveFromCart>
          ) : (
            <AddToCart onClick={() => addToCartHandler(product)}>
              Buy Now
            </AddToCart>
          )
        ) : (
          <NoStock>No Stock</NoStock>
        )}
      </CardActions>
    </Card>
  );
}

export default ProductItem;
