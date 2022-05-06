import { createGlobalStyle } from "styled-components";
import { StoreProvider } from "../utils/Store";
import { MarketplaceProvider } from "../utils/MarketplaceContext";
import { SnackbarProvider } from "notistack";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-family: 'Roboto', sans-serif;
  }

  p,a,h1,h2,h3,h5,h6,div,span{
    color: inherit;
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

  /* Contract Approval Dialog */
  .css-1t1j96h-MuiPaper-root-MuiDialog-paper {
    background: rgba(34, 28, 51, 0.9);
    color: rgba(255, 255, 255, 0.7);
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
