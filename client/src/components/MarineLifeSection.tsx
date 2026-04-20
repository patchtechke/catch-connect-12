import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Fish, Globe, Anchor } from "lucide-react";

// Add type declaration for window.google
declare global {
  interface Window {
    google: any;
  }
}

const MarineLifeSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const googleMapsApiKey = 'AIzaSyAO1t0XwmQOVs2OLUDzXGIGAj2vInLiYHY&libraries=places';

  // Large Marine Areas data
  const lmeAreas = [
    { 
      name: "Canary Current", 
      countries: ["Morocco", "Mauritania", "Senegal", "Gambia", "Guinea-Bissau", "Guinea", "Sierra Leone"], 
      color: "#FF6B6B",
      coordinates: [
        { lat: 35.7, lng: -5.9 }, // Morocco coast start
        { lat: 31.5, lng: -9.8 },
        { lat: 28.7, lng: -11.0 },
        { lat: 25.0, lng: -14.5 },
        { lat: 20.8, lng: -17.0 }, // Mauritania
        { lat: 16.0, lng: -16.5 }, // Senegal
        { lat: 13.5, lng: -16.7 }, // Gambia
        { lat: 12.0, lng: -16.9 }, // Guinea-Bissau
        { lat: 10.0, lng: -14.0 }, // Guinea
        { lat: 7.5, lng: -12.5 }, // Sierra Leone
        { lat: 7.5, lng: -15.0 }, // Extend to sea
        { lat: 15.0, lng: -20.0 },
        { lat: 25.0, lng: -20.0 },
        { lat: 35.7, lng: -10.0 }
      ]
    },
    { 
      name: "Guinea Current", 
      countries: ["Liberia", "Côte d'Ivoire", "Ghana", "Togo", "Benin", "Nigeria", "Cameroon"], 
      color: "#4ECDC4",
      coordinates: [
        { lat: 7.5, lng: -12.5 }, // Sierra Leone/Liberia border
        { lat: 6.5, lng: -10.5 }, // Liberia
        { lat: 5.0, lng: -7.5 }, // Côte d'Ivoire
        { lat: 5.1, lng: -3.0 }, // Ghana
        { lat: 6.2, lng: 1.2 }, // Togo
        { lat: 6.3, lng: 2.5 }, // Benin
        { lat: 6.5, lng: 3.4 }, // Nigeria start
        { lat: 4.5, lng: 5.0 },
        { lat: 4.2, lng: 6.5 },
        { lat: 4.0, lng: 8.0 }, // Nigeria end
        { lat: 3.8, lng: 9.5 }, // Cameroon
        { lat: 2.5, lng: 9.8 }, // Cameroon end
        { lat: 0.0, lng: 5.0 }, // Extend to sea
        { lat: 0.0, lng: -5.0 },
        { lat: 5.0, lng: -15.0 }
      ]
    },
    { 
      name: "Benguela Current", 
      countries: ["Gabon", "Equatorial Guinea", "São Tomé and Príncipe", "Congo", "DRC", "Angola", "Namibia", "South Africa"], 
      color: "#45B7D1",
      coordinates: [
        { lat: 2.5, lng: 9.8 }, // Cameroon/Gabon border
        { lat: 0.6, lng: 8.8 }, // Gabon
        { lat: -0.5, lng: 8.8 }, // Equatorial Guinea
        { lat: -4.0, lng: 11.0 }, // Congo
        { lat: -5.0, lng: 12.0 }, // DRC
        { lat: -6.0, lng: 12.3 }, // Angola start
        { lat: -8.8, lng: 13.2 },
        { lat: -11.7, lng: 13.7 },
        { lat: -15.8, lng: 11.8 },
        { lat: -17.3, lng: 11.5 }, // Angola end
        { lat: -22.9, lng: 14.5 }, // Namibia
        { lat: -28.6, lng: 16.4 }, // South Africa (west coast)
        { lat: -33.0, lng: 17.9 }, // Cape Town
        { lat: -35.0, lng: 15.0 }, // Extend to sea
        { lat: -35.0, lng: 5.0 },
        { lat: -5.0, lng: 0.0 },
        { lat: 0.0, lng: 5.0 }
      ]
    },
    { 
      name: "Agulhas Current", 
      countries: ["South Africa", "Mozambique"], 
      color: "#96CEB4",
      coordinates: [
        { lat: -33.0, lng: 17.9 }, // Cape Town
        { lat: -34.0, lng: 18.5 }, // False Bay
        { lat: -34.8, lng: 20.0 }, // South Africa south coast
        { lat: -34.0, lng: 22.0 },
        { lat: -33.6, lng: 26.5 },
        { lat: -33.0, lng: 27.9 },
        { lat: -31.6, lng: 29.5 },
        { lat: -29.8, lng: 31.0 }, // Durban
        { lat: -26.9, lng: 32.9 }, // South Africa/Mozambique border
        { lat: -25.9, lng: 32.6 }, // Maputo
        { lat: -21.0, lng: 35.0 }, // Mozambique central
        { lat: -16.0, lng: 40.0 }, // Mozambique north
        { lat: -10.5, lng: 40.5 }, // Mozambique/Tanzania border
        { lat: -15.0, lng: 45.0 }, // Extend to sea
        { lat: -35.0, lng: 40.0 },
        { lat: -38.0, lng: 25.0 },
        { lat: -36.0, lng: 18.0 }
      ]
    },
    { 
      name: "Western Indian Ocean", 
      countries: ["Tanzania", "Kenya", "Somalia", "Madagascar", "Mauritius", "Seychelles"], 
      color: "#FFEAA7",
      coordinates: [
        { lat: -10.5, lng: 40.5 }, // Mozambique/Tanzania border
        { lat: -6.2, lng: 39.2 }, // Zanzibar
        { lat: -2.5, lng: 40.5 }, // Tanzania/Kenya border
        { lat: 0.0, lng: 42.0 }, // Kenya
        { lat: 2.0, lng: 45.0 }, // Somalia start
        { lat: 5.0, lng: 48.0 },
        { lat: 8.0, lng: 50.0 },
        { lat: 11.5, lng: 51.3 }, // Horn of Africa
        { lat: 12.0, lng: 51.0 }, // Somalia end
        { lat: 5.0, lng: 55.0 }, // Extend to sea
        { lat: -4.6, lng: 55.5 }, // Seychelles
        { lat: -20.0, lng: 57.5 }, // Mauritius
        { lat: -12.0, lng: 49.0 }, // Madagascar north
        { lat: -15.0, lng: 50.5 }, // Madagascar east
        { lat: -18.9, lng: 47.5 }, // Madagascar central
        { lat: -25.0, lng: 47.0 }, // Madagascar south
        { lat: -15.0, lng: 45.0 } // Connect back to Mozambique
      ]
    },
    { 
      name: "Red Sea and Gulf of Aden", 
      countries: ["Egypt", "Sudan", "Eritrea", "Djibouti"], 
      color: "#DDA0DD",
      coordinates: [
        { lat: 30.0, lng: 32.5 }, // Egypt north
        { lat: 27.0, lng: 34.0 }, // Egypt Red Sea
        { lat: 24.0, lng: 35.5 }, // Egypt/Sudan border
        { lat: 20.0, lng: 37.5 }, // Sudan
        { lat: 18.0, lng: 38.5 }, // Sudan/Eritrea border
        { lat: 15.0, lng: 40.0 }, // Eritrea
        { lat: 12.5, lng: 43.0 }, // Eritrea/Djibouti border
        { lat: 11.5, lng: 43.5 }, // Djibouti
        { lat: 11.0, lng: 45.0 }, // Gulf of Aden
        { lat: 12.0, lng: 51.0 }, // Somalia
        { lat: 15.0, lng: 52.0 }, // Extend to sea
        { lat: 20.0, lng: 45.0 },
        { lat: 25.0, lng: 40.0 },
        { lat: 30.0, lng: 35.0 }
      ]
    }
  ];

  // Sample seller data
  const sellers = [
    { id: 1, name: "Cape Coast Fishermen", country: "Ghana", lat: 5.1, lng: -1.2, lme: "Guinea Current", catch: "Tuna, Sardines" },
    { id: 2, name: "Dakar Marine Cooperative", country: "Senegal", lat: 14.7, lng: -17.4, lme: "Canary Current", catch: "Octopus, Sole" },
    { id: 3, name: "Lagos Bay Traders", country: "Nigeria", lat: 6.5, lng: 3.4, lme: "Guinea Current", catch: "Shrimp, Mackerel" },
    { id: 4, name: "Walvis Bay Collective", country: "Namibia", lat: -22.9, lng: 14.5, lme: "Benguela Current", catch: "Pilchard, Anchovy" },
    { id: 5, name: "Maputo Fisheries", country: "Mozambique", lat: -25.9, lng: 32.6, lme: "Agulhas Current", catch: "Prawns, Kingfish" },
    { id: 6, name: "Zanzibar Spice Islands", country: "Tanzania", lat: -6.2, lng: 39.2, lme: "Western Indian Ocean", catch: "Tuna, Snappers" },
    { id: 7, name: "Port Victoria Fishers", country: "Seychelles", lat: -4.6, lng: 55.5, lme: "Western Indian Ocean", catch: "Tuna, Dorado" },
    { id: 8, name: "Antananarivo Coastal", country: "Madagascar", lat: -18.9, lng: 47.5, lme: "Western Indian Ocean", catch: "Lobster, Crab" }
  ];

  // Featured catches data with SVG icons and LME associations
  const featuredCatches = [
    { 
      name: "Tuna", 
      lme: ["Guinea Current", "Western Indian Ocean"], 
      icon: "M12,2C6.47,2 2,6.47 2,12s4.47,10 10,10s10-4.47 10-10S17.53,2 12,2z M17.25,14.25c-1.79,1.79-4.69,1.79-6.48,0l-2.52-2.52c-1.79-1.79-1.79-4.69,0-6.48 s4.69-1.79,6.48,0l2.52,2.52C19.04,9.56,19.04,12.46,17.25,14.25z",
      color: "#3B82F6",
      locations: [
        { lat: 5.5, lng: -1.0 }, // Ghana
        { lat: -5.0, lng: 39.0 }, // Tanzania
        { lat: -4.0, lng: 55.0 }  // Seychelles
      ]
    },
    { 
      name: "Sardines", 
      lme: ["Guinea Current", "Canary Current"], 
      icon: "M12,2C6.47,2 2,6.47 2,12s4.47,10 10,10s10-4.47 10-10S17.53,2 12,2z M16,16H8v-2h8V16z M16,12H8v-2h8V12z M16,8H8V6h8V8z",
      color: "#10B981",
      locations: [
        { lat: 4.8, lng: -1.5 }, // Ghana
        { lat: 14.2, lng: -17.0 } // Senegal
      ]
    },
    { 
      name: "Shrimp", 
      lme: ["Guinea Current"], 
      icon: "M12,2C6.47,2 2,6.47 2,12s4.47,10 10,10s10-4.47 10-10S17.53,2 12,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8 S16.42,20,12,20z M13.5,12c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5S13.5,12.83,13.5,12z M7.5,12 c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5S7.5,12.83,7.5,12z",
      color: "#F59E0B",
      locations: [
        { lat: 6.2, lng: 3.0 } // Nigeria
      ]
    },
    { 
      name: "Octopus", 
      lme: ["Canary Current"], 
      icon: "M12,2C6.47,2 2,6.47 2,12s4.47,10 10,10s10-4.47 10-10S17.53,2 12,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8 S16.42,20,12,20z M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z",
      color: "#EC4899",
      locations: [
        { lat: 15.0, lng: -17.2 } // Senegal
      ]
    },
    { 
      name: "Lobster", 
      lme: ["Western Indian Ocean"], 
      icon: "M12,2C6.47,2 2,6.47 2,12s4.47,10 10,10s10-4.47 10-10S17.53,2 12,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8 S16.42,20,12,20z M16.5,11c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S15.67,11,16.5,11z M7.5,11 c0.83,0,1.5,0.67,1.5,1.5S8.33,14,7.5,14S6,13.33,6,12.5S6.67,11,7.5,11z M12,17.5c2.33,0,4.31-1.46,5.11-3.5H6.89 C7.69,16.04,9.67,17.5,12,17.5z",
      color: "#EF4444",
      locations: [
        { lat: -19.5, lng: 47.0 } // Madagascar
      ]
    },
    { 
      name: "Mackerel", 
      lme: ["Guinea Current", "Benguela Current"], 
      icon: "M12,2C6.47,2 2,6.47 2,12s4.47,10 10,10s10-4.47 10-10S17.53,2 12,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8 S16.42,20,12,20z M15,12c0-1.66-1.34-3-3-3s-3,1.34-3,3s1.34,3,3,3S15,13.66,15,12z",
      color: "#8B5CF6",
      locations: [
        { lat: 6.8, lng: 3.8 }, // Nigeria
        { lat: -23.5, lng: 14.0 } // Namibia
      ]
    }
  ];

  const loadGoogleMapsScript = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    map.current = new window.google.maps.Map(mapContainer.current, {
      center: { lat: 0, lng: 20 }, // Centered on Africa
      zoom: 3,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#193341" }]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#2c5530" }]
        },
        {
          // Show country borders
          featureType: "administrative.country",
          elementType: "geometry.stroke",
          stylers: [
            { color: "#FFFFFF" },
            { weight: 2 },
            { visibility: "on" }
          ]
        },
        {
          // Show country names
          featureType: "administrative.country",
          elementType: "labels.text.fill",
          stylers: [
            { color: "#FFFFFF" },
            { visibility: "on" }
          ]
        },
        {
          // Add text stroke to country names for better visibility
          featureType: "administrative.country",
          elementType: "labels.text.stroke",
          stylers: [
            { color: "#000000" },
            { weight: 4 },
            { visibility: "on" }
          ]
        },
        {
          // Increase country label size
          featureType: "administrative.country",
          elementType: "labels.text",
          stylers: [
            { visibility: "on" },
            { weight: 2 }
          ]
        }
      ]
    });

    // Add LME area polygons
    lmeAreas.forEach((lme) => {
      if (lme.coordinates && lme.coordinates.length > 0) {
        const lmePolygon = new window.google.maps.Polygon({
          paths: lme.coordinates,
          strokeColor: lme.color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: lme.color,
          fillOpacity: 0.35,
          map: map.current
        });

        // Add click listener to polygon
        lmePolygon.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; min-width: 200px;">
                <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">${lme.name}</h3>
                <p style="font-size: 14px; margin-bottom: 4px;"><strong>Countries:</strong> ${lme.countries.join(', ')}</p>
              </div>
            `,
            position: lme.coordinates[0] // Position at first coordinate
          });
          infoWindow.open(map.current);
        });
        
        // Calculate center of the LME polygon for label placement
        const bounds = new window.google.maps.LatLngBounds();
        lme.coordinates.forEach(coord => {
          bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
        });
        const center = bounds.getCenter();
        
        // Adjust center for better label placement based on LME name
        let adjustedCenter = { lat: center.lat(), lng: center.lng() };
        
        // Custom adjustments for specific LMEs to improve label visibility
        if (lme.name === "Canary Current") {
          adjustedCenter = { lat: center.lat() - 2, lng: center.lng() + 1 };
        } else if (lme.name === "Guinea Current") {
          adjustedCenter = { lat: center.lat() - 1, lng: center.lng() + 1 };
        } else if (lme.name === "Red Sea and Gulf of Aden") {
          adjustedCenter = { lat: center.lat() + 1, lng: center.lng() - 2 };
        } else if (lme.name === "Benguela Current") {
          adjustedCenter = { lat: center.lat() + 2, lng: center.lng() - 1 };
        } else if (lme.name === "Agulhas Current") {
          adjustedCenter = { lat: center.lat() + 1, lng: center.lng() + 1 };
        } else if (lme.name === "Western Indian Ocean") {
          adjustedCenter = { lat: center.lat() - 2, lng: center.lng() - 2 };
        }
        
        // Create a custom overlay for the LME label with background
        const labelOverlay = new window.google.maps.OverlayView();
        labelOverlay.setMap(map.current);
        
        labelOverlay.onAdd = function() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
           div.style.backgroundColor = lme.color;
           div.style.color = 'white';
           div.style.fontWeight = 'bold';
           div.style.fontSize = '14px';
           div.style.padding = '6px 10px';
           div.style.borderRadius = '20px';
           div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5)';
           div.style.whiteSpace = 'nowrap';
           div.style.textAlign = 'center';
           div.style.opacity = '0.95';
           div.style.border = '2px solid white';
           div.style.textShadow = '1px 1px 2px rgba(0,0,0,0.7)';
           div.style.letterSpacing = '0.5px';
           div.style.cursor = 'pointer';
           div.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
           div.innerHTML = lme.name;
           
           // Add hover effect
           div.onmouseover = function() {
             this.style.transform = 'scale(1.05)';
             this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.6)';
           };
           div.onmouseout = function() {
             this.style.transform = 'scale(1)';
             this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5)';
           };
          
          this.div_ = div;
          const panes = this.getPanes();
          panes.overlayMouseTarget.appendChild(div);
          
          // Make the label clickable to show info window
          div.addEventListener('click', () => {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 12px; min-width: 200px;">
                  <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">${lme.name}</h3>
                  <p style="font-size: 14px; margin-bottom: 4px;"><strong>Countries:</strong> ${lme.countries.join(', ')}</p>
                </div>
              `,
              position: adjustedCenter
            });
            infoWindow.open(map.current);
          });
        };
        
        labelOverlay.draw = function() {
          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(
            new window.google.maps.LatLng(adjustedCenter.lat, adjustedCenter.lng)
          );
          
          const div = this.div_;
          div.style.left = (position.x - div.offsetWidth / 2) + 'px';
          div.style.top = (position.y - div.offsetHeight / 2) + 'px';
        };
        
        labelOverlay.onRemove = function() {
          this.div_.parentNode.removeChild(this.div_);
          this.div_ = null;
        };
      }
    });

    // Add sellers as markers
    sellers.forEach((seller) => {
      const lmeColor = lmeAreas.find(lme => lme.name === seller.lme)?.color || '#333';
      
      // Create custom marker icon
      const markerIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: lmeColor,
        fillOpacity: 1,
        scale: 10,
        strokeColor: 'white',
        strokeWeight: 3,
      };

      const marker = new window.google.maps.Marker({
        position: { lat: seller.lat, lng: seller.lng },
        map: map.current,
        icon: markerIcon,
        title: seller.name,
        zIndex: 1000 // Ensure markers appear above polygons
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">${seller.name}</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 4px;">${seller.country}</p>
            <p style="font-size: 14px; margin-bottom: 4px;"><strong>LME:</strong> ${seller.lme}</p>
            <p style="font-size: 14px;"><strong>Main Catch:</strong> ${seller.catch}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map.current, marker);
      });
    });

    // Track marker positions to prevent overlapping
    const markerPositions = [];
    
    // Add seller positions to the tracking array
    sellers.forEach(seller => {
      markerPositions.push({ lat: seller.lat, lng: seller.lng });
    });
    
    // Helper function to check if a position is too close to existing markers
    const isTooClose = (position, minDistance = 0.5) => {
      return markerPositions.some(existingPos => {
        const latDiff = Math.abs(existingPos.lat - position.lat);
        const lngDiff = Math.abs(existingPos.lng - position.lng);
        // Using a simple distance calculation (not perfect but efficient)
        return (latDiff * latDiff + lngDiff * lngDiff) < (minDistance * minDistance);
      });
    };
    
    // Helper function to find a non-overlapping position
    const findNonOverlappingPosition = (originalPosition, attempts = 8) => {
      // If original position doesn't overlap, use it
      if (!isTooClose(originalPosition)) {
        markerPositions.push(originalPosition);
        return originalPosition;
      }
      
      // Try positions in a spiral pattern around the original
      const offsets = [
        { lat: 0.3, lng: 0 },    // North
        { lat: 0.2, lng: 0.2 },  // Northeast
        { lat: 0, lng: 0.3 },    // East
        { lat: -0.2, lng: 0.2 }, // Southeast
        { lat: -0.3, lng: 0 },   // South
        { lat: -0.2, lng: -0.2 },// Southwest
        { lat: 0, lng: -0.3 },   // West
        { lat: 0.2, lng: -0.2 }  // Northwest
      ];
      
      // Try each offset position
      for (let i = 0; i < Math.min(attempts, offsets.length); i++) {
        const newPosition = {
          lat: originalPosition.lat + offsets[i].lat,
          lng: originalPosition.lng + offsets[i].lng
        };
        
        if (!isTooClose(newPosition)) {
          markerPositions.push(newPosition);
          return newPosition;
        }
      }
      
      // If all attempts fail, use original position but with a small random offset
      const fallbackPosition = {
        lat: originalPosition.lat + (Math.random() * 0.4 - 0.2),
        lng: originalPosition.lng + (Math.random() * 0.4 - 0.2)
      };
      markerPositions.push(fallbackPosition);
      return fallbackPosition;
    };

    // Add featured catches as fish icons on the map
    featuredCatches.forEach((fish) => {
      // Add a marker for each location of this fish type
      fish.locations.forEach((location) => {
        // Create custom fish icon
        const fishIcon = {
          path: fish.icon,
          fillColor: fish.color,
          fillOpacity: 0.9,
          scale: 1.2,
          strokeColor: 'white',
          strokeWeight: 1,
          anchor: new window.google.maps.Point(12, 12), // Center the icon
        };

        // Find which LME this location belongs to
        let fishLme = "";
        lmeAreas.forEach((lme) => {
          // Simple check if the location is within the general area of the LME
          // For a more accurate check, we would need to use the containsLocation method
          const lmeCenter = lme.coordinates.reduce(
            (acc, coord) => ({ lat: acc.lat + coord.lat, lng: acc.lng + coord.lng }),
            { lat: 0, lng: 0 }
          );
          const centerLat = lmeCenter.lat / lme.coordinates.length;
          const centerLng = lmeCenter.lng / lme.coordinates.length;
          
          // Calculate distance (very rough approximation)
          const latDiff = Math.abs(centerLat - location.lat);
          const lngDiff = Math.abs(centerLng - location.lng);
          if (latDiff < 10 && lngDiff < 10 && fish.lme.includes(lme.name)) {
            fishLme = lme.name;
          }
        });

        // Find a non-overlapping position for this marker
        const adjustedPosition = findNonOverlappingPosition(location);

        const marker = new window.google.maps.Marker({
          position: adjustedPosition,
          map: map.current,
          icon: fishIcon,
          title: fish.name,
          zIndex: 1200 // Ensure fish icons appear above seller markers
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 200px;">
              <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px;">${fish.name}</h3>
              <p style="font-size: 14px; margin-bottom: 4px;"><strong>Marine Area:</strong> ${fishLme}</p>
              <p style="font-size: 14px; color: #666;">Featured catch in this region</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map.current, marker);
        });
      });
    });
  };

  useEffect(() => {
    // Automatically load the map when component mounts
    setIsApiLoaded(true);
    setTimeout(loadGoogleMapsScript, 100);
    
    return () => {
      // Google Maps cleanup is handled automatically
    };
  }, []);

  return (
    <section id="marine-life" className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-ocean bg-clip-text text-transparent tracking-tight">
            MarineCatch Network
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting fishers and buyers across 12 pilot countries, with plans to scale to 32 coastal nations and 6 island states in 6 Large Marine Areas
          </p>
        </div>

        {!isApiLoaded ? (
          <Card className="max-w-2xl mx-auto mb-10 shadow-3 hover:shadow-4 transition-all duration-300">
            <CardContent className="p-8 flex justify-center items-center">
              <div className="text-center">
                <Globe className="w-14 h-14 text-primary mx-auto mb-5 animate-pulse" />
                <h3 className="text-lg font-semibold mb-3 uppercase tracking-wide">Loading Interactive Map...</h3>
                <p className="text-sm text-muted-foreground tracking-wide">
                  Please wait while we initialize the map
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
          {/* Large Marine Areas Section - Now Above the Map */}
          <Card className="shadow-2 hover:shadow-3 transition-all duration-300 mb-10">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-3 uppercase tracking-wide">
                <MapPin className="w-6 h-6 text-primary" />
                Large Marine Areas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {lmeAreas.map((lme, index) => (
                  <div key={index} className="flex flex-col items-center p-3 hover:bg-muted/30 rounded-lg transition-all duration-300 text-center">
                    <div 
                      className="w-8 h-8 rounded-full shadow-1 mb-2"
                      style={{ backgroundColor: lme.color }}
                    />
                    <p className="font-medium text-sm tracking-wide">{lme.name}</p>
                    <p className="text-xs text-muted-foreground tracking-wide">
                      {lme.countries.length} countries
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map and Stats Section */}
          <div className="grid lg:grid-cols-3 gap-10 mb-10">
            <div className="lg:col-span-2">
              <Card className="h-[600px] shadow-3 hover:shadow-4 transition-all duration-300">
                <CardContent className="p-0 h-full">
                  <div ref={mapContainer} className="w-full h-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">



              <Card className="shadow-2 hover:shadow-3 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-5 flex items-center gap-3 uppercase tracking-wide">
                    <Fish className="w-6 h-6 text-primary" />
                    Featured Catches
                  </h3>
                  <div className="space-y-2">
                    {featuredCatches.map((fish, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-all duration-300">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: fish.color }}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                            <path d={fish.icon} />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{fish.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {fish.lme.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                    <p>Icons on map show catch locations</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </>
        )}

        <div className="text-center">
          <Button variant="logo" size="lg" className="uppercase tracking-wide shadow-3 hover:shadow-4">
            Join Our Marine Network
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarineLifeSection;
