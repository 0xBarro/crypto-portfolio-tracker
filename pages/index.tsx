import type { NextPage } from 'next'
import Head from 'next/head'
import processWallets from '../lib/processWallets'

// 
export async function getStaticProps() {
  const allPostsData = processWallets()
  return {
    props: {
    }
  }
}

const Home: NextPage = () => {
  return (
    <div className='bg-slate-200 min-h-screen p-5'>
      <Head>
        <title>Portfolio Tracker</title>
        <meta name="description" content="Cripto Portfolio Tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1> Wallet Tracker </h1>
      </main>

      <footer>
      </footer>
    </div>
  )
}

export default Home
