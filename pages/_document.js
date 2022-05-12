// import Document, { Head, Html, Main, NextScript } from "next/document";
// import React from "react";
// import createEmotionServer from "@emotion/server/create-instance";
// import createEmotionCache from "../utils/createEmotionCache";

// export default class MyDocument extends Document {
//   render() {
//     return (
//       <Html lang="en">
//         <Head>
//           <link
//             rel="stylesheet"
//             href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&display=swap"
//           />
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

// MyDocument.getInitialProps = async (ctx) => {
//   const originalRenderPage = ctx.renderPage;

//   // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
//   // However, be aware that it can have global side effects.
//   const cache = createEmotionCache();
//   const { extractCriticalToChunks } = createEmotionServer(cache);

//   ctx.renderPage = () =>
//     originalRenderPage({
//       // eslint-disable-next-line react/display-name
//       enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
//     });

//   const initialProps = await Document.getInitialProps(ctx);
//   // This is important. It prevents emotion to render invalid HTML.
//   // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
//   const emotionStyles = extractCriticalToChunks(initialProps.html);
//   const emotionStyleTags = emotionStyles.styles.map((style) => (
//     <style
//       data-emotion={`${style.key} ${style.ids.join(" ")}`}
//       key={style.key}
//       // eslint-disable-next-line react/no-danger
//       dangerouslySetInnerHTML={{ __html: style.css }}
//     />
//   ));

//   return {
//     ...initialProps,
//     // Styles fragment is rendered after the app and page rendering finish.
//     styles: [
//       ...React.Children.toArray(initialProps.styles),
//       ...emotionStyleTags,
//     ],
//   };
// };

import Document from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
