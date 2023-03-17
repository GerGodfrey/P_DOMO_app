import '../styles/globals.css'
import Link from 'next/link'

function App({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
    </div> 
  )
}


export default App