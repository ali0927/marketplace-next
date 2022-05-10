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
    fontFamily: "Oxanium",
  },
  section: {
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: "#ffffff",
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
    fontFamily: "Oxanium",
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
    backgroundColor: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "default",
  },
  logoImg: {
    background: "transparent",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
  },
  ssLogoImg: {
    background: "transparent",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    filter: "brightness(50%)",
  },
  enterMarketplace: {
    display: "initial",
    background: "red",
    color: "#ffffff",
  },
  //nftCard
  nftCard: {
    backgroundColor: "#152266",
    padding: "20px 25px",
    color: "#ffffff",
  },
  nftCardText: {
    display: "flex",
    justifyContent: "space-between",
  },
  //payment form
  paperStyle: {
    padding: "0 15px 40px 15px",
    width: "250px",
  },
  particularsTitle: {
    fontFamily: "Oxanium",
    fontSize: "24px",
    fontWeight: "600",
    color: "#ffffff",
  },
  particularsCaption: {
    color: "#ffffff",
    fontSize: "12px",
    fontFamily: "Oxanium",
  },
  particularsField: {
    marginBottom: 1,
    color: "#ffffff",
  },
  particularsLastField: {
    color: "#ffffff",
  },
  dialogApprovalButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    padding: "0.5rem 1.5rem",
    fontWeight: "500",
    color: "#ffffff",
    maxWidth: "200px",
    background: "#0097DA",
    borderRadius: "50px",
    margin: "0 auto",
    textDecoration: "none",
    boxShadow: "7px 6px 28px 1px rgba(0, 0, 0, 0.24)",
    outline: "none",
    transition: "0.2s all",
    textTransform: "unset",
    fontFamily: "Oxanium",

    "&:active": {
      background: "#0097DA",
      transform: "scale(0.98)",
      boxShadow: "3px 2px 22px 1px rgba(0, 0, 0, 0.5)",
    },
  },
  //admin product edit
  editContainer: {
    display: "flex",
    gap: "0.5rem",
  },
  btnStyle: { marginTop: 10 },
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
  approveContract: {
    padding: "0px",
    marginBottom: "0px",
  },
};
export default classes;
