//react/next
import React from "react";
//material ui
import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
//component
import Layout from "../components/Layout";
import useStyles from "../utils/styles";

function Checkout() {
  const classes = useStyles();
  return (
    <Layout title="Checkout">
      <form className={classes.form}>
        <Typography component="h1" variant="h1">
          Checkout
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="ethaddress"
              label="Eth Address"
              inputProps={{ type: "ethaddress" }}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="physicaladdress"
              label="Physical Address"
              inputProps={{ type: "physicaladdress" }}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="discordid"
              label="Discord Id"
              inputProps={{ type: "discordid" }}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: "email" }}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Check Out
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

export default Checkout;
