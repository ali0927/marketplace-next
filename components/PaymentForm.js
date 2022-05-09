//material ui
import {
  Grid,
  Paper,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
} from "@mui/material";
//formik
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
//styles
import classes from "../utils/classes";
import { MarketplaceContext } from "../utils/MarketplaceContext";
import { Store } from "../utils/Store";
//environment
import { environmentTest } from "../lib/environments/environment";
import { environment } from "../lib/environments/environment.prod";

function PaymentForm() {
  const validationSchema = Yup.object().shape({
    discordId: Yup.string().min(3, "It's too short").required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
  });
  const { currentAccount } = useContext(MarketplaceContext);
  const { state } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const initialValues = {
    email: "",
    discordId: "",
    ethAddress: currentAccount,
    shippingAddress: "",
    cartItems: cartItems,
  };
  const getSignature = async (values) => {
    const msgParams = {
      domain: {
        name: "Nex10 Marketplace",
        version: "1",
        chainId: environmentTest.chainId.toString(),
      },
      message: {
        email: values.email,
        discordId: values.discordId,
        shippingAddress: values.shippingAddress,
        cartItems: cartItems,
      },
      primaryType: "Purchase",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Purchase: [
          { name: "email", type: "string" },
          { name: "discordId", type: "string" },
          { name: "shippingAddress", type: "string" },
          { name: "cartItems", type: "uint256[]" },
        ],
      },
    };
    try {
      const from = currentAccount;
      const sign = await ethereum.request({
        method: "eth_signTypedData_v4",
        params: [from, JSON.stringify(msgParams)],
      });
      return sign;
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async ({
    email,
    discordId,
    shippingAddress,
    cartItems,
    props,
  }) => {
    // let signature = await getSignature(values);
    // dispatch({
    //   type: "SAVE_USER_DETAILS",
    //   payload: { email, discordId, shippingAddress, cartItems },
    // });
    // Cookies.set("userDetails", {
    //   email, discordId, shippingAddress, cartItems, signature
    // });
    // await placeOrderHandler();
    console.log(email, discordId, shippingAddress, cartItems);
    // console.log(signature);
    props.resetForm();
  };

  return (
    <Grid>
      <Paper elevation={0} sx={classes.paperStyle}>
        <Grid align="center">
          <Typography variant="caption" sx={classes.particularsCaption}>
            Fill in your particulars
          </Typography>
        </Grid>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form noValidate>
              <List>
                <ListItem>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    error={props.errors.email && props.touched.email}
                    helperText={<ErrorMessage name="email" />}
                    required
                  />
                </ListItem>
                <ListItem>
                  <Field
                    as={TextField}
                    name="discordId"
                    label="Discord Id"
                    fullWidth
                    error={props.errors.discordId && props.touched.discordId}
                    helperText={<ErrorMessage name="discordId" />}
                    required
                  />
                </ListItem>
                <ListItem>
                  <Field
                    as={TextField}
                    name="shippingAddress"
                    label="Shipping Address"
                    fullWidth
                    error={
                      props.errors.shippingAddress &&
                      props.touched.shippingAddress
                    }
                    helperText={<ErrorMessage name="shippingAddress" />}
                    required
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    sx={classes.btnStyle}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </ListItem>
              </List>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
}

export default PaymentForm;
