import type { NextPage } from 'next'
import Head from 'next/head'
import processAll from '../lib/processWallets'


export async function getStaticProps() {
  const allTxdata = await processAll(true)
  console.log(allTxdata.polygon)
  return {
    props: {
      txData: allTxdata,
    }
  }
}

const Home: NextPage = (props) => {
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
