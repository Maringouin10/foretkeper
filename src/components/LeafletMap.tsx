'use client'

import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// @ts-ignore
import toGeoJSON from 'togeojson'

// Fix for default marker icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

type Report = {
    id: number
    x: number // Latitude
    y: number // Longitude
    description: string | null
    createdAt: string
}

function LocationMarker({ onLocationSelect, isAdmin }: { onLocationSelect: (lat: number, lng: number) => void, isAdmin: boolean }) {
    useMapEvents({
        click(e) {
            if (!isAdmin) {
                onLocationSelect(e.latlng.lat, e.latlng.lng)
            }
        },
    })
    return null
}

type LeafletMapProps = {
    isAdmin?: boolean
    onMapClick?: (lat: number, lng: number) => void
    selectedLocation?: { lat: number; lng: number } | null
}

export default function LeafletMap({ isAdmin = false, onMapClick, selectedLocation }: LeafletMapProps) {
    const [geoJsonData, setGeoJsonData] = useState<any>(null)
    const [reports, setReports] = useState<Report[]>([])
    // Removed internal newReport state and form logic
    // const [newReport, setNewReport] = useState<{ lat: number; lng: number } | null>(null)
    // const [description, setDescription] = useState('')
    // const [isSubmitting, setIsSubmitting] = useState(false)
    const newMarkerRef = useRef<L.Marker>(null)

    // Use selectedLocation prop instead of internal state
    /*
    useEffect(() => {
        if (newReport && newMarkerRef.current) {
            newMarkerRef.current.openPopup()
        }
    }, [newReport])
    */

    useEffect(() => {
        // Fetch KML
        fetch('/foret.kml')
            .then((res) => res.text())
            .then((kmlText) => {
                const parser = new DOMParser()
                const kml = parser.parseFromString(kmlText, 'text/xml')
                const converted = toGeoJSON.kml(kml)
                setGeoJsonData(converted)
            })

        // Load Reports from LocalStorage
        const storedReports = localStorage.getItem('reports')
        if (storedReports) {
            setReports(JSON.parse(storedReports))
        }
    }, [])

    // Removed fetchReports function as we use localStorage
    /*
    const fetchReports = async () => {
        ...
    }
    */

    const handleLocationSelect = (lat: number, lng: number) => {
        if (onMapClick) {
            onMapClick(lat, lng)
        }
    }

    const handleDelete = async (id: number) => {
        if (!isAdmin) return
        if (!confirm('Supprimer ce signalement ?')) return

        const updatedReports = reports.filter((r) => r.id !== id)
        setReports(updatedReports)
        localStorage.setItem('reports', JSON.stringify(updatedReports))
    }

    // Removed internal handleSubmit
    /*
    const handleSubmit = async (e: React.FormEvent) => {
        ...
    }
    */

    // Center map on the forest (approximate from KML data or hardcoded)
    // From KML: 45.265723, -73.335837
    const center: [number, number] = [45.2657, -73.3358]

    return (
        <div className="h-screen w-full relative z-0">
            <MapContainer center={center} zoom={16} maxZoom={22} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxNativeZoom={19}
                    maxZoom={22}
                />

                {geoJsonData && <GeoJSON data={geoJsonData} style={() => ({ color: 'blue', weight: 4 })} />}

                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[report.x, report.y]}
                        eventHandlers={{
                            click: () => isAdmin && handleDelete(report.id),
                        }}
                    >
                        <Popup>
                            <p>{report.description || 'Arbre tombé'}</p>
                            <small>{new Date(report.createdAt).toLocaleDateString()}</small>
                            {isAdmin && <p className="text-red-500 font-bold mt-2 cursor-pointer">Cliquez pour supprimer</p>}
                        </Popup>
                    </Marker>
                ))}

                {selectedLocation && (
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                )}

                <LocationMarker onLocationSelect={handleLocationSelect} isAdmin={isAdmin} />
            </MapContainer>
        </div>
    )
}
