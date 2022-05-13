//react/next/packages
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useContext, useEffect, useReducer } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
//material ui
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
} from '@mui/material';
//styling
import styled from 'styled-components';
//components
import { getError } from '../../../utils/error';
import Layout from '../../../components/Layout';
import Form from '../../../components/Form';
import classes from '../../../utils/classes';
import { MarketplaceContext } from '../../../utils/MarketplaceContext';

const Wrapper = styled.div`
  margin-top: 150px;
`;

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

function ProductEdit({ params }) {
  //variables
  const productId = params.id;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { currentAccount } = useContext(MarketplaceContext);
  const ethAddress = currentAccount;
  //reducer
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  //useForm
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('type', data.type);
        setValue('brand', data.brand);
        setValue('currency', data.currency);
        setValue('image', data.image);
        setValue('price', data.price);
        setValue('originalCount', data.originalCount);
        setValue('countInStock', data.countInStock);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  //upload image
  const uploadHandler = async (e, imageField = 'image') => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  //signatures
  //get signature (for update)
  const getUpdateSignature = async (
    name,
    slug,
    type,
    brand,
    currency,
    image,
    price,
    originalCount,
    countInStock
  ) => {
    const msgParams = {
      domain: {
        name: 'Nex10 Marketplace',
        version: '1',
        chainId: process.env.NODE_ENV === 'prod' ? 1 : 4,
      },
      message: {
        name: name,
        slug: slug,
        type: type,
        brand: brand,
        currency: currency,
        image: image,
        price: price,
        originalCount: originalCount,
        countInStock: countInStock,
      },
      primaryType: 'Product',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
        ],
        Product: [
          { name: 'name', type: 'string' },
          { name: 'slug', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'brand', type: 'string' },
          { name: 'currency', type: 'string' },
          { name: 'image', type: 'string' },
          { name: 'originalCount', type: 'uint256' },
          { name: 'countInStock', type: 'uint256' },
        ],
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

  const submitHandler = async ({
    name,
    slug,
    type,
    brand,
    currency,
    image,
    price,
    originalCount,
    countInStock,
  }) => {
    closeSnackbar();
    try {
      let signature = await getUpdateSignature(
        name,
        slug,
        type,
        brand,
        currency,
        image,
        price,
        originalCount,
        countInStock,
        ethAddress
      );
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        type,
        brand,
        currency,
        image,
        price,
        originalCount,
        countInStock,
        ethAddress,
        signature,
      });
      enqueueSnackbar('Admin verified', { variant: 'success' });
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Wrapper>
      <Layout title={`Edit Product ${productId}`}>
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
                  <Typography component="h1" variant="h1">
                    Edit Product {productId}
                  </Typography>
                </ListItem>
                <ListItem>
                  {loading && <CircularProgress></CircularProgress>}
                  {error && (
                    <Typography className={classes.error}>{error}</Typography>
                  )}
                </ListItem>
                <ListItem>
                  <Form
                    onSubmit={handleSubmit(submitHandler)}
                    className={classes.form}
                  >
                    <List>
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="Name"
                              error={Boolean(errors.name)}
                              helperText={errors.name ? 'Name is required' : ''}
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="slug"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="slug"
                              label="Slug"
                              error={Boolean(errors.slug)}
                              helperText={errors.slug ? 'Slug is required' : ''}
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="type"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="type"
                              label="Type"
                              error={Boolean(errors.type)}
                              helperText={errors.type ? 'Type is required' : ''}
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="brand"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="brand"
                              label="Brand"
                              error={Boolean(errors.brand)}
                              helperText={
                                errors.brand ? 'Brand is required' : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="currency"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="currency"
                              label="Token"
                              error={Boolean(errors.currency)}
                              helperText={
                                errors.currency ? 'Token is required' : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="image"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="image"
                              label="Image"
                              error={Boolean(errors.image)}
                              helperText={
                                errors.image ? 'Image is required' : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Button variant="contained" component="label">
                          Upload File
                          <input type="file" onChange={uploadHandler} hidden />
                        </Button>
                        {loadingUpload && <CircularProgress />}
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="price"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="price"
                              label="Price"
                              error={Boolean(errors.price)}
                              helperText={
                                errors.price ? 'Price is required' : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="originalCount"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="originalCount"
                              label="Original Count"
                              error={Boolean(errors.originalCount)}
                              helperText={
                                errors.originalCount
                                  ? 'Original Count is required'
                                  : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="countInStock"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="countInStock"
                              label="Count in stock"
                              error={Boolean(errors.countInStock)}
                              helperText={
                                errors.countInStock
                                  ? 'Count in stock is required'
                                  : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                        >
                          Update
                        </Button>
                        {loadingUpdate && <CircularProgress />}
                      </ListItem>
                    </List>
                  </Form>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </Wrapper>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
