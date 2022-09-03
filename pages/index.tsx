import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className="px-8">
      <Head>
        <title>Health tracker</title>
        <meta name="description" content="Track your weight etc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center py-16 h-[90vh]">
        <h1 className="text-3xl font-bold underline">
          Content here...
        </h1>
      </main>

      <footer className="flex justify-center items-center grow border-t-[1px]">
        Generic footer
      </footer>
    </div>
  )
}

export default Home
