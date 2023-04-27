

import Head from 'next/head';

const Layout = (props) => (
  <>
    <Head>
      <title>DOMO APP</title>
    </Head>
    <main>
      <div >{props.children}</div>
    </main>

  </>
);

export default Layout;