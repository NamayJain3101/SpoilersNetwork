import Head from "next/head";
import React from "react";

const HeadTags = () => (
  <React.Fragment>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta charSet="UTF-8" />
      <link rel="icon" href="/favicon.png" sizes="16*16" type="image/png" />

      <link rel="stylesheet" type="text/css" href="/listMessages.css" />

      <link rel="stylesheet" type="text/css" href="/styles.css" />
      <link rel="stylesheet" type="text/css" href="/nprogress.css" />

      <title>Mini Social Media</title>
    </Head>
  </React.Fragment>
);
export default HeadTags;
