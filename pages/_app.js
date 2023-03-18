import '../styles/globals.css'
import Link from 'next/link'
import '../index.css'

function App({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
    </div> 
  )
}


export default App