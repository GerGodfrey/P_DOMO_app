import '../styles/globals.css'
import Link from 'next/link'
import Navbar from '../components/Navbar'

function App({ Component, pageProps }) {
  return (
    <div>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </div> 
  )
}


export default App