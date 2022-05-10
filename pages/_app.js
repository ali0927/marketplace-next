import { createGlobalStyle } from "styled-components";
import { StoreProvider } from "../utils/Store";
import { MarketplaceProvider } from "../utils/MarketplaceContext";
import { SnackbarProvider } from "notistack";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
import Head from "next/head";

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
  .MuiCardContent-root {
    padding: 16px 0px 0px 0px;
  }
`;

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <>
      <Head>
        <title>Nex10 Marketplace</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&display=swap"
        />
      </Head>
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
    </>
  );
}

export default MyApp;
