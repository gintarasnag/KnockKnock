'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
}

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    fetch('/api/properties')
      .then(response => response.json())
      .then(data => setProperties(data))
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle>{property.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${property.price.toLocaleString()}</p>
              <p>{property.address}</p>
              <p>{property.beds} beds • {property.baths} baths • {property.sqft} sqft</p>
              <Button className="mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

