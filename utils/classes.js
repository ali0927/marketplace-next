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
    marginTop: 1,
    textAlign: "center",
  },
  section: {
    marginTop: 1,
    marginBottom: 1,
  },

  // header
  appbar: {
    backgroundColor: "#203040",
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

  // search
  searchForm: {
    border: "1px solid #ffffff",
    backgroundColor: "#ffffff",
    borderRadius: 1,
  },
  searchInput: {
    paddingLeft: 1,
    color: "#000000",
    "& ::placeholder": {
      color: "#606060",
    },
  },
  searchButton: {
    backgroundColor: "#f8c040",
    padding: 1,
    borderRadius: "0 5px 5px 0",
    "& span": {
      color: "#000000",
    },
  },
};
export default classes;
