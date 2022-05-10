//material ui
import {
  Grid,
  Paper,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  CircularProgress,
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
import axios from "axios";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";

function PaymentForm() {
  //state
  const [loading, setLoading] = useState(false);

  //retrieve variables
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { currentAccount } = useContext(MarketplaceContext);
  const ethAddress = currentAccount;
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  //form validation
  const validationSchema = Yup.object().shape({
    discordId: Yup.string().min(3, "It's too short").required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
  });

  const initialValues = {
    email: "",
    discordId: "",
    ethAddress: currentAccount,
    shippingAddress: "",
    cartItems: cartItems.map((x) => x._id),
  };

  //get signature
  const getSignature = async (
    email,
    discordId,
    ethAddress,
    shippingAddress,
    cartItems
  ) => {
    const msgParams = {
      domain: {
        name: "Nex10 Marketplace",
        version: "1",
        chainId: process.env.NODE_ENV === "prod" ? 1 : 4,
      },
      message: {
        email: email,
        discordId: discordId,
        shippingAddress: shippingAddress,
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
          { name: "cartItems", type: "string[]" },
        ],
      },
    };
    try {
      const from = ethAddress;
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
    // props,
  }) => {
    try {
      setLoading(true);
      closeSnackbar();
      let signature = await getSignature(
        email,
        discordId,
        ethAddress,
        shippingAddress,
        cartItems
      );
      const { data } = await axios.post("/api/orders", {
        email,
        discordId,
        ethAddress,
        shippingAddress,
        cartItems,
        signature,
      });
      console.log(
        email,
        discordId,
        ethAddress,
        shippingAddress,
        cartItems,
        signature
      );
      console.log(data);
      dispatch({ type: "CART_CLEAR" });
      Cookies.remove("cartItems");
      setLoading(false);
      enqueueSnackbar("Purchase successfully made", {
        variant: "success",
      });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
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
                {loading && (
                  <ListItem>
                    <CircularProgress />
                  </ListItem>
                )}
              </List>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
}

export default PaymentForm;
