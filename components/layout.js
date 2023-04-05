

import Head from 'next/head';

const Layout = (props) => (
  <>
    <Head>
      <title>DOMO APP</title>
      <link rel='icon' href='../assets/logo.svg' />
    </Head>
    <main>
      <div >{props.children}</div>
    </main>

  </>
);

export default Layout;