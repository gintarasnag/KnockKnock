'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Euro } from 'lucide-react'

interface Property {
  id: string
  name: string
  price: number
  lat: number
  lng: number
  image: string
  host: string
  rating?: number
  amenities: string[]
}

interface InteractiveMapProps {
  properties: Property[]
  selectedProperty: Property | null
  onSelectProperty: (property: Property) => void
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '1rem',
  overflow: 'hidden',
  border: '2px solid rgba(255,255,255,0.1)'
}

const center = {
  lat: 53.4129,
  lng: -7.9449
}

const irelandBounds: L.LatLngBoundsExpression = [
  [51.4, -10.6],
  [55.4, -5.4]
]

export default function InteractiveMap({ properties, selectedProperty, onSelectProperty }: InteractiveMapProps) {
  const [map, setMap] = useState<L.Map | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)

  useEffect(() => {
    if (map) {
      map.fitBounds(irelandBounds)
      map.setMaxBounds(irelandBounds.pad(0.1))
    }
  }, [map])

  const createCustomIcon = (property: Property, isHovered: boolean) => {
    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div class="price-marker ${isHovered ? 'hovered' : ''} ${selectedProperty?.id === property.id ? 'selected' : ''}">
          <div class="price-content">
            <span class="price-amount">€${property.price}</span>
            ${property.rating ? `
              <div class="rating">
                <span class="star">★</span>
                <span class="rating-value">${property.rating}</span>
              </div>
            ` : ''}
          </div>
          ${isHovered ? `
            <div class="property-preview">
              <img src="${property.image}" alt="${property.name}" class="preview-image"/>
              <div class="preview-content">
                <div class="preview-name">${property.name}</div>
                <div class="preview-host">by ${property.host}</div>
              </div>
            </div>
          ` : ''}
        </div>
      `,
      iconSize: [120, isHovered ? 160 : 60],
      iconAnchor: [60, isHovered ? 160 : 30]
    })
  }

  return (
    <div className="map-container relative">
      <style jsx global>{`
        .price-marker {
          background: transparent;
          transition: all 0.3s ease;
        }
        .price-content {
          background: white;
          padding: 8px 16px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 2px solid #ffffff;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        .price-amount {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 16px;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }
        .star {
          color: #fbbf24;
        }
        .price-marker.hovered .price-content,
        .price-marker.selected .price-content {
          background: #4f46e5;
          border-color: #ffffff;
          transform: translateY(-4px);
        }
        .price-marker.hovered .price-amount,
        .price-marker.selected .price-amount {
          color: white;
        }
        .property-preview {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 200px;
          overflow: hidden;
          margin-top: 8px;
        }
        .preview-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }
        .preview-content {
          padding: 8px;
        }
        .preview-name {
          font-weight: 600;
          font-size: 14px;
          color: #1a1a1a;
        }
        .preview-host {
          font-size: 12px;
          color: #666;
        }
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
      <MapContainer
        center={center as L.LatLngExpression}
        zoom={7}
        style={mapContainerStyle}
        whenCreated={setMap}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ZoomControl position="bottomright" />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={createCustomIcon(property, hoveredProperty === property.id)}
            eventHandlers={{
              click: () => onSelectProperty(property),
              mouseover: () => setHoveredProperty(property.id),
              mouseout: () => setHoveredProperty(null),
            }}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-bold text-lg mb-1">{property.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-indigo-600">
                    €{property.price}/night
                  </span>
                  {property.rating && (
                    <span className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      {property.rating}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {property.amenities.join(' · ')}
                </div>
                <p className="text-sm text-indigo-500 mb-2">
                  Hosted by {property.host}
                </p>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    const element = document.getElementById(`property-${property.id}`)
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

