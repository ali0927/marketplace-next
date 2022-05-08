import { createGlobalStyle } from "styled-components";
import { StoreProvider } from "../utils/Store";
import { MarketplaceProvider } from "../utils/MarketplaceContext";
import { SnackbarProvider } from "notistack";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-family: 'Oxanium', cursive;
    background-image: url("/images/bg/background-1.png");
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    transition: all .3s;
  }

  /* width */
  body::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  body::-webkit-scrollbar-track {
    background: #ffffff;
  }

  /* Handle */
  body::-webkit-scrollbar-thumb {
    background: #212121;
    border-radius: 20px;
  }

  /* Handle on hover */
  body::-webkit-scrollbar-thumb:hover {
    background: rgb(43, 43, 43);
  }
  
  /* Overriding MateriaL UI Styles */
  
  /* App Bar */
  .css-1im6ja8-MuiToolbar-root {
    padding: 30px 40px 20px;
  }
  /* Grid Container */
  .css-yfyvtz-MuiContainer-root {
    display: flex;
    justify-content: center;
  }
  /* NFT Card */
  .css-bhp9pd-MuiPaper-root-MuiCard-root {
    background-color: #152266;
    padding: 20px 25px;
    color: #ffffff;
  }
  .MuiCardContent-root {
    padding: 16px 0px 0px 0px;
  }
  

  /* Contract Approval Dialog */
  .css-1t1j96h-MuiPaper-root-MuiDialog-paper {
    background: #30358C;
    box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
    display: block;
    padding: 24px;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
  }
`;

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MarketplaceProvider>
          <StoreProvider>
            <GlobalStyle />
            <Component {...pageProps} />
          </StoreProvider>
        </MarketplaceProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;
