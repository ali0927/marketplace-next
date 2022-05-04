import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: "#203040",
    padding: "10px",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: "80vh",
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#ffffff",
    textTransform: "initial",
  },
  connectedMetamask: {
    outline: 0,
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    position: "relative",
    borderRadius: "40px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    padding: "15px 20px",
    textAlign: "center",
    background: "rgb(21, 17, 32, 0.4)",
    cursor: "default",
    border: "2px solid rgb(4, 148, 220)",
  },
  connectMetamask: {
    outline: 0,
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    position: "relative",
    borderRadius: "40px",
    border: 0,
    textTransform: "uppercase",
    letterSpacing: "2px",
    padding: "15px 20px",
    textAlign: "center",
    backgroundColor: "rgb(4, 148, 220)",
    cursor: "pointer",
  },
  transparentBackgroud: {
    backgroundColor: "transparent",
  },
  error: {
    color: "#f04040",
  },
  fullWidth: {
    width: "100%",
  },
  reviewForm: {
    maxWidth: 800,
    width: "100%",
  },
  reviewItem: {
    marginRight: "1rem",
    borderRight: "1px #808080 solid",
    paddingRight: "1rem",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  menuButton: { padding: 0 },
  mt1: { marginTop: "1rem" },
  // search
  searchSection: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  searchForm: {
    border: "1px solid #ffffff",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
    color: "#000000",
    "& ::placeholder": {
      color: "#606060",
    },
  },
  iconButton: {
    backgroundColor: "#f8c040",
    padding: 5,
    borderRadius: "0 5px 5px 0",
    "& span": {
      color: "#000000",
    },
  },
  sort: {
    marginRight: 5,
  },

  fullContainer: { height: "100vh" },
  mapInputBox: {
    position: "absolute",
    display: "flex",
    left: 0,
    right: 0,
    margin: "10px auto",
    width: 300,
    height: 40,
    "& input": {
      width: 250,
    },
  },
}));
export default useStyles;
