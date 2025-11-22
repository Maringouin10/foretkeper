'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

export default function Home() {
  const [isReporting, setIsReporting] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const mapSectionRef = useRef<HTMLDivElement>(null)

  const handleStartReporting = () => {
    setIsReporting(true)
    setSelectedLocation(null)
    // Scroll to map
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (isReporting) {
      setSelectedLocation({ lat, lng })
    }
  }

  const handleCancel = () => {
    setIsReporting(false)
    setSelectedLocation(null)
    setDescription('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLocation) return

    setIsSubmitting(true)
    try {
      // Create new report object
      const newReport = {
        id: Date.now(), // Simple ID generation
        x: selectedLocation.lat,
        y: selectedLocation.lng,
        description,
        createdAt: new Date().toISOString(),
      }

      // Save to LocalStorage
      const storedReports = localStorage.getItem('reports')
      const reports = storedReports ? JSON.parse(storedReports) : []
      reports.push(newReport)
      localStorage.setItem('reports', JSON.stringify(reports))

      alert('Signalement envoyé !')
      handleCancel()
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white font-sans">
      {/* Header */}
      <header className="p-6 bg-stone-900 border-b border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-lg">
        <h1 className="text-2xl font-bold text-green-500 tracking-tight">Forest Keeper</h1>
        <button
          onClick={handleStartReporting}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Signaler un arbre tombé
        </button>
      </header>

      {/* Content */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">

        {/* Instructions / Status */}
        <AnimatePresence>
          {isReporting && !selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-center text-blue-100"
            >
              <p className="text-lg font-medium">Cliquez sur la carte pour indiquer l'emplacement de l'arbre.</p>
              <button onClick={handleCancel} className="mt-2 text-sm underline hover:text-white">Annuler</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Section */}
        <div ref={mapSectionRef} className="relative rounded-2xl overflow-hidden border border-stone-700 shadow-2xl h-[60vh] md:h-[70vh]">
          <LeafletMap
            onMapClick={handleMapClick}
            selectedLocation={selectedLocation}
          />
        </div>

        {/* Reporting Form (Outside Map) */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-stone-900 p-6 rounded-xl border border-stone-700 shadow-xl max-w-2xl mx-auto"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-green-500 w-3 h-3 rounded-full block"></span>
                Détails du signalement
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-stone-400 mb-2">Description (optionnel)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Gros chêne en travers du sentier..."
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    rows={4}
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
