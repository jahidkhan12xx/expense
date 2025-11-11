import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className=''>
        <section className="bg-gray-50 flex items-center flex-col">
  <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
        Manage Your
        <strong className="text-primary"> Expense </strong>
        Control your money
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
        Start creating your budget according to your money
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
        <Link  className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700" href="/dashboard">
          Get Started
        </Link>

        <a className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white" href="#">
          Learn More
        </a>
      </div>
    </div>
  </div>

  <Image
  className="my-5 rounded-lg border-2 py"
  src="/dash.png"
  alt="dashboard"
  height={700}
  width={1000}
/>
</section>
    </div>
  )
}

export default Hero