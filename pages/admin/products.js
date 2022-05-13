//react/next/packages
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useReducer, useContext } from 'react';
import { useSnackbar } from 'notistack';
//material ui
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import classes from '../../utils/classes';
//styles
import styled from 'styled-components';
//components
import { getError } from '../../utils/error';
import Layout from '../../components/Layout';
import { MarketplaceContext } from '../../utils/MarketplaceContext';

const Wrapper = styled.div`
  margin-top: 150px;
`;

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function AdminProducts() {
  const router = useRouter();
  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  //retrieve variables
  const { currentAccount } = useContext(MarketplaceContext);
  const ethAddress = currentAccount;
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {});
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  //signatures
  //get signature (for delete)
  const getDeleteSignature = async (productId, ethAddress) => {
    const msgParams = {
      domain: {
        name: 'Nex10 Marketplace',
        version: '1',
        chainId: process.env.NODE_ENV === 'prod' ? 1 : 4,
      },
      message: {
        productId: productId,
      },
      primaryType: 'Product',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
        ],
        Product: [{ name: 'productId', type: 'string' }],
      },
    };
    try {
      const from = ethAddress;
      const sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [from, JSON.stringify(msgParams)],
      });
      return sign;
    } catch (err) {
      console.error(err);
    }
  };

  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(`/api/admin/products`, {});

      dispatch({ type: 'CREATE_SUCCESS' });
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      closeSnackbar();
      let signature = await getDeleteSignature(productId, ethAddress);
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`, {
        data: {
          productId,
          ethAddress,
          signature,
        },
      });
      enqueueSnackbar('Admin verified', { variant: 'success' });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Wrapper>
      <Layout title="Products">
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card sx={classes.section}>
              <List>
                <NextLink href="/admin/products" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>
          <Grid item md={9} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography component="h1" variant="h1">
                        Products
                      </Typography>
                      {loadingDelete && <CircularProgress />}
                    </Grid>
                    <Grid align="right" item xs={6}>
                      <Button
                        onClick={createHandler}
                        color="primary"
                        variant="contained"
                      >
                        Create
                      </Button>
                      {loadingCreate && <CircularProgress />}
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography sx={classes.error}>{error}</Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>NAME</TableCell>
                            <TableCell>TYPE</TableCell>
                            <TableCell>PRICE</TableCell>
                            <TableCell>BRAND</TableCell>
                            <TableCell>ORIGINAL COUNT</TableCell>
                            <TableCell>COUNT</TableCell>
                            <TableCell>ACTIONS</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product._id}>
                              <TableCell>
                                {product._id.substring(20, 24)}
                              </TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.type}</TableCell>
                              <TableCell>{product.price}</TableCell>
                              <TableCell>{product.brand}</TableCell>
                              <TableCell>{product.originalCount}</TableCell>
                              <TableCell>{product.countInStock}</TableCell>
                              <TableCell>
                                <NextLink
                                  href={`/admin/product/${product._id}`}
                                  passHref
                                >
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      marginBottom: '10px',
                                      background: '#01579b',
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </NextLink>{' '}
                                <Button
                                  onClick={() => deleteHandler(product._id)}
                                  size="small"
                                  variant="contained"
                                  color="error"
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </Wrapper>
  );
}

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
