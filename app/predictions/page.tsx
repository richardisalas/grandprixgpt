"use client"

import React, { useState } from 'react'
import Link from 'next/link'

// Modularized prediction component for reuse with different GPs
const JapanGrandPrixPrediction = () => {
  return (
    <div className="w-full max-w-3xl bg-transparent backdrop-blur-sm border border-gray-300 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-10">
      <div className="p-6 border-b border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Japanese Grand Prix Prediction</h2>
        <p className="text-sm text-gray-500">Suzuka Circuit</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Track History and Conditions</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>The upcoming race is at Suzuka, Japan, a track where Red Bull and Mercedes have historically performed well.</li>
            <li>Max Verstappen has won the last two races at Suzuka in 2022 and 2023.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team and Car Performance in 2025</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>McLaren has been strong in 2025, with Lando Norris leading the driver standings and Oscar Piastri also performing exceptionally.</li>
            <li>Red Bull, with Max Verstappen and Yuki Tsunoda, is traditionally strong at Suzuka.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Driver Form and Team Dynamics</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Lando Norris and Oscar Piastri, both from McLaren, have won the first two races of the 2025 season, making them strong contenders.</li>
            <li>Max Verstappen remains a formidable opponent, especially given his history at Suzuka and Red Bull's strong car performance.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Conclusion</h3>
          <p className="text-gray-600">
            Given McLaren's current form, with Norris and Piastri both having won races this season, they are strong contenders for the win. However, Max Verstappen's success at Suzuka and Red Bull's potential cannot be overlooked.
          </p>
        </div>
        
        <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Predicted Podium Finishes</h3>
          <ol className="pl-5 space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-yellow-400 rounded-full text-white font-bold">1</span>
              <span className="font-medium">Lando Norris (McLaren)</span>
            </li>
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-gray-300 rounded-full text-white font-bold">2</span>
              <span className="font-medium">Max Verstappen (Red Bull)</span>
            </li>
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-amber-600 rounded-full text-white font-bold">3</span>
              <span className="font-medium">Oscar Piastri (McLaren)</span>
            </li>
          </ol>
          <p className="mt-4 text-sm text-gray-500 italic">
            These predictions take into account recent performance, track history, and car capabilities. Weather conditions will also play a crucial role, with a high chance of rain potentially impacting race strategies.
          </p>
        </div>
      </div>
    </div>
  )
}

// Saudi Arabian Grand Prix Prediction Component
const SaudiArabianGrandPrixPrediction = () => {
  return (
    <div className="w-full max-w-3xl bg-transparent backdrop-blur-sm border border-gray-300 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-10">
      <div className="p-6 border-b border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Saudi Arabian Grand Prix Prediction</h2>
        <p className="text-sm text-gray-500">Jeddah Corniche Circuit</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Track Characteristics</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>The Jeddah Corniche Circuit is a high-speed street circuit that presents unique challenges.</li>
            <li>Overtaking is possible but can be difficult, making qualifying position crucial.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Qualifying Results</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Max Verstappen starts on pole position.</li>
            <li>Oscar Piastri qualified P2.</li>
            <li>George Russell starts P3.</li>
            <li>Charles Leclerc rounds out the top four.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Car Performance in 2025</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Red Bull has shown strong performance, securing pole position.</li>
            <li>McLaren is competitive, with Piastri starting in P2.</li>
            <li>Mercedes and Ferrari are also in the mix, but slightly behind.</li>
            <li>Williams looks to be lacking pace.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Performance in 2025 so far</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>McLaren leads the constructor standings with 77 points.</li>
            <li>Red Bull is in contention but needs to convert Verstappen's pole into a win.</li>
            <li>Mercedes is showing potential but needs to improve its race pace.</li>
            <li>Ferrari is slightly behind, needing to find more performance.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Driver Form and Historic Results</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Max Verstappen has won the Saudi Arabian Grand Prix twice (2022, 2024), demonstrating his ability at this track.</li>
            <li>Other drivers like Leclerc and Perez have shown strong performances in the past.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Relevant Driver News and Team Chemistry</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Verstappen "has made it very clear that he's part of the team".</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Conclusion</h3>
          <p className="text-gray-600">
            Considering Verstappen's pole position, his past success at this circuit, and Red Bull's overall performance, he is the favorite to win. Piastri's strong qualifying suggests McLaren will be highly competitive, and he could challenge for the win. Russell's starting position gives him a good chance to fight for a podium.
          </p>
        </div>
        
        <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Predicted Podium Finishes</h3>
          <ol className="pl-5 space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-yellow-400 rounded-full text-white font-bold">1</span>
              <span className="font-medium">Max Verstappen (Red Bull)</span>
            </li>
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-gray-300 rounded-full text-white font-bold">2</span>
              <span className="font-medium">Oscar Piastri (McLaren)</span>
            </li>
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-amber-600 rounded-full text-white font-bold">3</span>
              <span className="font-medium">George Russell (Mercedes)</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

// Bahrain Grand Prix Prediction Component
const BahrainGrandPrixPrediction = () => {
  return (
    <div className="w-full max-w-3xl bg-transparent backdrop-blur-sm border border-gray-300 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-10">
      <div className="p-6 border-b border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bahrain Grand Prix Prediction</h2>
        <p className="text-sm text-gray-500">Bahrain International Circuit</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Performance and Form</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>McLaren is currently leading with strong performances from both Lando Norris and Oscar Piastri. Norris is at the top of the standings with 62 points, closely followed by Piastri. The McLarens have shown impressive pace and are considered the cars to beat in Bahrain.</li>
            <li>Red Bull: Max Verstappen, currently second in the standings with 61 points, continues to be a strong contender. He has momentum from a recent win in Suzuka and is known for his ability to perform under pressure.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Qualifying and Track Conditions</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>McLaren drivers are performing well in practice sessions, with Oscar Piastri holding a slight advantage over Norris. This indicates a strong potential for securing pole positions, which is crucial in Bahrain due to the track's overtaking challenges.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Historical Performance</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Max Verstappen has shown strong performance in recent years, including wins in other challenging circuits like Suzuka. However, McLaren's recent form suggests they might reclaim victory.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Dynamics and Chemistry</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>The McLaren team appears to have great chemistry, with both drivers pushing each other to perform better. This internal competition can be a catalyst for excellent race results.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Conclusion</h3>
          <p className="text-gray-600">
            Based on the above analysis, McLaren is well-positioned to win the next race in Bahrain. Their car performance, driver form, and team dynamics give them a slight edge over Red Bull.
          </p>
        </div>
        
        <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Predicted Podium Finishes</h3>
          <ol className="pl-5 space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-yellow-400 rounded-full text-white font-bold">1</span>
              <span className="font-medium">Oscar Piastri (McLaren)</span>
            </li>
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-gray-300 rounded-full text-white font-bold">2</span>
              <span className="font-medium">Lando Norris (McLaren)</span>
            </li>
            <li className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 mr-3 bg-amber-600 rounded-full text-white font-bold">3</span>
              <span className="font-medium">Max Verstappen (Red Bull)</span>
            </li>
          </ol>
          <p className="mt-4 text-sm text-gray-500 italic">
            This prediction takes into account the current standings, recent performances, and expected qualifying outcomes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Predictions() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGP, setSelectedGP] = useState("Saudi Arabia");
  
  const handleGPSelect = (gp: string) => {
    setSelectedGP(gp);
    setDropdownOpen(false);
  };
  
  return (
    <main className="flex flex-col min-h-screen items-center justify-start pt-10 bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="flex w-full max-w-3xl justify-between items-center mb-8">
        <Link 
          href="/" 
          className="px-5 py-3 bg-transparent backdrop-blur-sm border border-gray-300 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 text-gray-600 text-sm"
        >
          Back to Chat
        </Link>
        
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-5 py-3 bg-transparent backdrop-blur-sm border border-gray-300 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 text-gray-600 text-sm flex items-center"
          >
            {selectedGP} GP
            <svg 
              className={`ml-2 w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-transparent backdrop-blur-sm border border-gray-300 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10">
              <button
                className="text-left w-full px-4 py-2 hover:bg-indigo-50/50 rounded-t-lg text-gray-600"
                onClick={() => handleGPSelect("Japan")}
              >
                Japan GP
              </button>
              <button
                className="text-left w-full px-4 py-2 hover:bg-indigo-50/50 text-gray-600"
                onClick={() => handleGPSelect("Bahrain")}
              >
                Bahrain GP
              </button>
              <button
                className="text-left w-full px-4 py-2 hover:bg-indigo-50/50 rounded-b-lg text-gray-600"
                onClick={() => handleGPSelect("Saudi Arabia")}
              >
                Saudi Arabia GP
              </button>
            </div>
          )}
        </div>
      </div>
      
      {selectedGP === "Japan" 
        ? <JapanGrandPrixPrediction /> 
        : selectedGP === "Saudi Arabia" 
          ? <SaudiArabianGrandPrixPrediction />
          : <BahrainGrandPrixPrediction />
      }
    </main>
  )
} 