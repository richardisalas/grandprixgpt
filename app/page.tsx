"use client"

import React from 'react'
import Chat from './components/Chat'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-10">
        GrandPrix GPT
      </h1>
      <Chat onSubmit={(message) => console.log(message)} />
    </main>
  )
} 