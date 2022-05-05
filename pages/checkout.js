//react/next/packages
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import axios from "axios";
//material ui
import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { CircularProgress } from "@mui/material";
//environment
import { environmentTest } from "../lib/environments/environment";
import { environment } from "../lib/environments/environment.prod";
//components
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import useStyles from "../utils/styles";
import { MarketplaceContext } from "../utils/MarketplaceContext";
import { getError } from "../utils/error";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const { currentAccount } = useContext(MarketplaceContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const router = useRouter();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems, userDetails },
  } = state;

  const classes = useStyles();

  if (cartItems.length === 0) {
    router.push("/cart");
  }

  const getSignature = async (discordId, physicalAddress, email) => {
    const sign = "testSignature";
    return sign;
    // const msgParams = {
    //   domain: {
    //     name: "Uninterested Unicorns",
    //     version: "1",
    //     chainId: environmentTest.chainId.toString(),
    //   },
    //   message: {
    //     discordId: discordId,
    //     physicalAddress: physicalAddress,
    //     email: email,
    //   },
    //   primaryType: "Checkout",
    //   types: {
    //     EIP712Domain: [
    //       { name: "name", type: "string" },
    //       { name: "version", type: "string" },
    //       { name: "chainId", type: "uint256" },
    //     ],
    //     Checkout: [
    //       { name: "discordId", type: "string" },
    //       { name: "physicalAddress", type: "string" },
    //       { name: "email", type: "string" },
    //     ],
    //   },
    // };
    // try {
    //   const from = currentAccount;
    //   const sign = await ethereum.request({
    //     method: "eth_signTypedData_v4",
    //     params: [from, JSON.stringify(msgParams)],
    //   });
    //   return sign;
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const submitHandler = async ({ discordId, physicalAddress, email }) => {
    let signature = await getSignature(discordId, physicalAddress, email);
    dispatch({
      type: "SAVE_USER_DETAILS",
      payload: { discordId, currentAccount, physicalAddress, email, signature },
    });
    Cookies.set("userDetails", {
      discordId,
      currentAccount,
      physicalAddress,
      email,
      signature,
    });
    await placeOrderHandler();
  };

  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          userDetails,
          totalPrice,
        }
        // {
        // headers: {
        //   authorization: `Bearer ${userInfo}`
        // }
      );
      dispatch({ type: "CART_CLEAR" });
      Cookies.remove("cartItems");
      setLoading(false);
      router.push("/order/${data._id}");
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  useEffect(() => {
    setValue("discordId", userDetails.discordId);
    setValue("physicalAddress", userDetails.physicalAddress);
    setValue("email", userDetails.email);
  }, []);

  return (
    <Layout title="Shipping Address">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Checkout
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="discordId"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="discordId"
                  label="Discord ID"
                  error={Boolean(errors.discordId)}
                  helperText={
                    errors.discordId
                      ? errors.discordId.type === "minLength"
                        ? "Discord ID length is more than 1"
                        : "Discord ID is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="physicalAddress"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="physicalAddress"
                  label="Physical Address"
                  error={Boolean(errors.physicalAddress)}
                  helperText={
                    errors.physicalAddress
                      ? errors.physicalAddress.type === "minLength"
                        ? "Physical address length is more than 1"
                        : "Physical address is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: "email" }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === "pattern"
                        ? "Email is not valid"
                        : "Email is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continue
            </Button>
          </ListItem>
          {loading && (
            <ListItem>
              <CircularProgress />
            </ListItem>
          )}
        </List>
      </form>
    </Layout>
  );
}
