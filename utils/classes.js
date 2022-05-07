//in rem
const classes = {
  //common
  flex: {
    display: "flex",
  },
  hidden: {
    display: "none",
  },
  visible: {
    display: "initial",
  },
  sort: {
    marginRight: 1,
  },
  fullHeight: { height: "100vh" },
  fullWidth: {
    width: "100%",
  },
  error: {
    color: "#f04040",
  },

  //layout
  main: {
    marginTop: 2, //rem
    minHeight: "80vh",
  },
  footer: {
    marginTop: 3,
    paddingBottom: 3,
    textAlign: "center",
    color: "#ffffff",
    fontSize: "14px",
  },
  section: {
    marginTop: 1,
    marginBottom: 1,
  },

  // header
  appbar: {
    backgroundColor: "transparent",
    "& a": {
      color: "#ffffff",
      marginLeft: 1,
    },
  },
  toolbar: {
    justifyContent: "space-between",
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  navbarButton: {
    color: "#ffffff",
    textTransform: "initial",
  },
  menuButton: { padding: 0 },
  metamaskButton: {
    outline: 0,
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: "500",
    textDecoration: "none",
    position: "relative",
    borderRadius: "40px",
    border: 0,
    letterSpacing: "1.5px",
    padding: "10px 15px",
    textAlign: "center",
    backgroundColor: "#0097DA",
    cursor: "pointer",
  },
  connectedMetamaskButton: {
    outline: 0,
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: "500",
    textDecoration: "none",
    position: "relative",
    borderRadius: "40px",
    letterSpacing: "1.5px",
    padding: "10px 15px",
    textAlign: "center",
    background: "rgb(21, 17, 32, 0.4)",
    cursor: "default",
    border: "2px solid #0097DA",
  },
  //landing page
  marketplaceSelect: {
    color: "#ffffff",
    fontSize: "32px",
    letterSpacing: "1.5px",
    textAlign: "center",
  },
  marketplaceUUCard: {
    height: "380px",
    width: "480px",
    border: "1px solid #152266",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "&:hover": {
      transform: "scale3d(1.05, 1.05, 1)",
      border: "2px solid #F333CB",
      cursor: "pointer",
    },
  },
  marketplaceSSCard: {
    height: "380px",
    width: "480px",
    border: "1px solid #152266",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "&:hover": {
      transform: "scale3d(1.05, 1.05, 1)",
      border: "2px solid #F33333",
      cursor: "pointer",
    },
  },
  logoImg: {
    background: "transparent",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  enterMarketplace: {
    display: "initial",
    background: "red",
    color: "#ffffff",
  },
  //nftCard
  nftCardText: {
    display: "flex",
    justifyContent: "space-between",
  },
  //admin product edit
  editContainer: {
    display: "flex",
    gap: "0.5rem",
  },
  //utils
  avatar: {
    backgroundColor: "#152266",
  },
  wrongNetwork: {
    textAlign: "center",
    fontSize: "18px",
    margin: "50px auto",
    width: "calc(100% - 40px)",
    lineHeight: "180%",
    color: "#fff",
  },
};
export default classes;
