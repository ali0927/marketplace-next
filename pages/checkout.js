//react/next/packages
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
//material ui
import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
//components
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import useStyles from "../utils/styles";
import { MarketplaceContext } from "../utils/MarketplaceContext";

export default function Checkout() {
  const { currentAccount } = useContext(MarketplaceContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
    // setValue,
  } = useForm();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  // const {
  //   userInfo,
  //   cart: { shippingAddress },
  // } = state;
  useEffect(() => {
    // setValue('fullName', shippingAddress.fullName);
    // setValue('address', shippingAddress.address);
    // setValue('city', shippingAddress.city);
    // setValue('postalCode', shippingAddress.postalCode);
    // setValue('country', shippingAddress.country);
  }, []);

  const classes = useStyles();
  const submitHandler = ({ discordId, ethAddress, physicalAddress, email }) => {
    dispatch({
      type: "SAVE_USER_DETAILS",
      payload: { discordId, ethAddress, physicalAddress, email },
    });
    Cookies.set("userDetails", {
      discordId,
      ethAddress,
      physicalAddress,
      email,
    });
    router.push("/payment");
  };
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
        </List>
      </form>
    </Layout>
  );
}
