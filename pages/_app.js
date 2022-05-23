import { createGlobalStyle } from 'styled-components';
import { StoreProvider } from '../utils/Store';
import { MarketplaceProvider } from '../utils/MarketplaceContext';
import { SnackbarProvider } from 'notistack';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import Head from 'next/head';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-family: 'Oxanium', cursive;
    background-image: url("/images/bg/background-1.png");
    background-repeat: no-repeat;
    background-size: cover;
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
  // .css-1im6ja8-MuiToolbar-root {
  //   padding: 30px 40px 20px;
  // }

  /* Cart Desktop */
  // .MuiList-root.MuiList-padding.MuiMenu-list.css-1ari148-MuiList-root-MuiMenu-list {
  //   padding: 0px
  // }
  /* Grid Container */
  // .css-yfyvtz-MuiContainer-root {
  //   display: flex;
  //   justify-content: center;
  // }
  
  /* Main Container */
  .MuiContainer-root.MuiContainer-maxWidthLg.css-yfyvtz-MuiContainer-root {
    // min-height: 79vh;
    margin-top: 0px;
    padding-bottom: 100px;
  }

  /* Payment Details Form */  
  .MuiOutlinedInput-root.MuiInputBase-root.MuiInputBase-colorPrimary.MuiInputBase-fullWidth.MuiInputBase-formControl {
    border-radius: 50px;
    color: #ffffff;
    background: #152266;
  }
  .MuiOutlinedInput-input.MuiInputBase-input {
    text-align: center;
  }
  .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.Mui-required {
    color: #ffffff;
  }
  /* NFT Card */
  .css-1iyusmy-MuiCardContent-root, .MuiCardActions-root.MuiCardActions-spacing.css-1t6e9jv-MuiCardActions-root {
    padding: 0px
  }

  /* Admin Product Edit */
  .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiCard-root.css-p5io6o-MuiPaper-root-MuiCard-root {
    background-color: #30358C;
    color: #ffffff;
  }
  .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.MuiFormLabel-filled.css-i6mjds-MuiFormLabel-root-MuiInputLabel-root,
  .MuiTableCell-root.MuiTableCell-head.MuiTableCell-sizeMedium.css-1ygcj2i-MuiTableCell-root,
  .MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-1ex1afd-MuiTableCell-root
   {
    color: #ffffff;
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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
