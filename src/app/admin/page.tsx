'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'admin123') {
            setIsAuthenticated(true)
        } else {
            alert('Mot de passe incorrect')
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-stone-900">
                <form onSubmit={handleLogin} className="bg-stone-800 p-8 rounded-xl shadow-2xl border border-stone-700">
                    <h2 className="text-white text-2xl font-bold mb-6 text-center">Admin Access</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        className="w-full bg-stone-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white rounded-lg py-3 font-bold hover:bg-green-500 transition-colors"
                    >
                        Entrer
                    </button>
                </form>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-stone-950">
            <LeafletMap isAdmin={true} />
        </main>
    )
}
