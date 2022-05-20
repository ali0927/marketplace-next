//in rem
const classes = {
  //common
  flex: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
  visible: {
    display: 'initial',
  },
  sort: {
    marginRight: 1,
  },
  fullWidth: {
    width: '100%',
  },
  error: {
    color: '#f04040',
  },

  //layout
  main: {
    marginTop: 2, //rem
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Oxanium',
    borderTop: '1px solid #30358C',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  section: {
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: '#ffffff',
  },

  // header
  appbar: {
    backgroundColor: 'transparent',
    top: 0,
    height: '70px',
    zIndex: 100,
    '& a': {
      color: '#ffffff',
      marginLeft: 1,
    },
  },
  appBarTransparent: {
    backgroundColor: 'transparent',
  },
  appBarSolid: {
    backgroundColor: '#000',
  },
  toolbar: {
    justifyContent: 'space-between',
    position: 'relative',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },
  menuButton: { padding: 0 },
  metamaskButton: {
    outline: 0,
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '500',
    textDecoration: 'none',
    position: 'relative',
    borderRadius: '40px',
    border: 0,
    letterSpacing: '1.5px',
    padding: '10px 15px',
    textAlign: 'center',
    backgroundColor: '#0097DA',
    cursor: 'pointer',
  },
  connectedMetamaskButton: {
    outline: 0,
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '500',
    textDecoration: 'none',
    position: 'relative',
    borderRadius: '40px',
    letterSpacing: '1.5px',
    padding: '10px 15px',
    textAlign: 'center',
    background: 'rgb(21, 17, 32, 0.4)',
    cursor: 'default',
    border: '2px solid #0097DA',
  },
  //landing page
  marketplaceSelect: {
    color: '#ffffff',
    fontSize: '32px',
    letterSpacing: '1.5px',
    textAlign: 'center',
    fontFamily: 'Oxanium',
  },
  logoImg: {
    background: 'transparent',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
  },
  ssLogoImg: {
    background: 'transparent',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    filter: 'brightness(50%)',
  },
  enterMarketplace: {
    display: 'initial',
    background: 'red',
    color: '#ffffff',
  },
  //marketplace
  mobileHeaderIcons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.2rem',
  },
  mobileHeaderIconsVisible: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.2rem',
  },
  //cart
  listItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '20px',
    justifyContent: 'space-between',
  },
  //nftCard
  nftCard: {
    backgroundColor: '#152266',
    padding: '30px 15px',
    color: '#ffffff',
  },
  nftCardText: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  //how to purchase
  dialogTitle: {
    color: '#ffffff',
    fontFamily: 'Oxanium',
    fontWeight: '600',
    fontSize: '22px',
    textAlign: 'center',
  },
  //payment form
  paperStyleDesktop: {
    padding: '0 15px 40px 15px',
    width: '500px',
  },
  paperStyleMobile: {
    padding: '0 15px 40px 15px',
    width: '300px',
  },
  submitForm: {
    background: '#F333CB',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Oxanium',
    borderRadius: '50px',
    padding: '5px 20px',
    width: '60%',
    textTransform: 'unset',
  },
  dialogApprovalButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    padding: '0.5rem 1.5rem',
    fontWeight: '500',
    color: '#ffffff',
    maxWidth: '200px',
    background: '#F333CB',
    borderRadius: '50px',
    margin: '0 auto',
    textDecoration: 'none',
    boxShadow: '7px 6px 28px 1px rgba(0, 0, 0, 0.24)',
    outline: 'none',
    transition: '0.2s all',
    textTransform: 'unset',
    fontFamily: 'Oxanium',

    '&:active': {
      transform: 'scale(0.98)',
      boxShadow: '3px 2px 22px 1px rgba(0, 0, 0, 0.5)',
    },
  },
  //admin product edit
  editContainer: {
    display: 'flex',
    gap: '0.5rem',
  },
  btnStyle: { marginTop: 10 },
  //utils
  avatar: {
    backgroundColor: '#152266',
  },
  loading: {
    position: 'absolute',
    top: '30%',
    right: '50%',
    transform: 'translate(50%,-50%)',
  },
  wrongNetwork: {
    textAlign: 'center',
    fontSize: '18px',
    margin: '50px auto',
    width: 'calc(100% - 40px)',
    lineHeight: '180%',
    color: '#fff',
  },
  approveContract: {
    padding: '0px',
    marginBottom: '0px',
  },
};
export default classes;
