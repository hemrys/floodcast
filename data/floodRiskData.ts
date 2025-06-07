// Types
export interface FloodRiskArea {
  id: number;
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
  radius: number;
  riskLevel: 'high' | 'medium' | 'low' | string;
  detailedInfo: {
    waterLevel: string;
    probability: string;
    timeframe: string;
    affectedArea: string;
    evacuationStatus: string;
    emergencyContacts: string;
  };
}

// Sample flood risk data
export const floodRiskAreas: FloodRiskArea[] = [
  {
    id: 1,
    coordinate: { latitude: 55.6050, longitude: 13.0038 }, // Central Malmö
    title: "High Risk Area",
    description: "Severe flooding expected in central Malmö",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.5 meters above normal",
      probability: "75%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Central Malmö, including Stortorget and surrounding streets",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  },
  {
    id: 2,
    coordinate: { latitude: 55.5872, longitude: 12.9701 }, // Near Limhamn
    title: "Medium Risk Area",
    description: "Moderate flooding possible near coastal areas",
    radius: 600,
    riskLevel: "medium",
    detailedInfo: {
      waterLevel: "1.2 meters above normal",
      probability: "50%",
      timeframe: "Next 48-72 hours",
      affectedArea: "Limhamn coastal areas and harbor",
      evacuationStatus: "Be prepared for possible evacuation",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  },
  {
    id: 3,
    coordinate: { latitude: 55.6204, longitude: 13.0320 }, // Near Kirseberg
    title: "Low Risk Area",
    description: "Minor flooding possible in eastern Malmö",
    radius: 500,
    riskLevel: "low",
    detailedInfo: {
      waterLevel: "0.5 meters above normal",
      probability: "25%",
      timeframe: "Next 3-5 days",
      affectedArea: "Parts of Kirseberg and surrounding low-lying areas",
      evacuationStatus: "No evacuation needed, stay informed",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  },
  {
    id: 4,
    coordinate: { latitude: 55.5698, longitude: 13.0415 }, // Near Hyllie
    title: "Medium Risk Area",
    description: "Moderate flooding expected in southern Malmö",
    radius: 700,
    riskLevel: "medium",
    detailedInfo: {
      waterLevel: "1.0 meters above normal",
      probability: "60%",
      timeframe: "Next 24-72 hours",
      affectedArea: "Hyllie and surrounding residential areas",
      evacuationStatus: "Be prepared for possible evacuation",
      emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
    }
  },
  {
    id: 5,
    coordinate: { latitude: 59.3293, longitude: 18.0686 },
    title: "High Risk Area",
    description: "Severe flooding expected near Riddarfjärden",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.8 meters above normal",
      probability: "80%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Riddarfjärden waterfront and Gamla Stan",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Stockholm Flood Hotline: 08-508-00-508"
    }
  },
  {
    id: 6,
    coordinate: { latitude: 59.3165, longitude: 18.0758 },
    title: "High Risk Area",
    description: "Severe flooding expected near Södermalm waterfront",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.6 meters above normal",
      probability: "75%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Södermalm southern waterfront and Slussen area",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Stockholm Flood Hotline: 08-508-00-508"
    }
  },
  {
    id: 7,
    coordinate: { latitude: 59.3378, longitude: 18.0895 },
    title: "Medium Risk Area",
    description: "Moderate flooding possible near Östermalm",
    radius: 600,
    riskLevel: "medium",
    detailedInfo: {
      waterLevel: "1.4 meters above normal",
      probability: "55%",
      timeframe: "Next 48-72 hours",
      affectedArea: "Östermalm waterfront and Strandvägen",
      evacuationStatus: "Be prepared for possible evacuation",
      emergencyContacts: "Emergency Services: 112, Stockholm Flood Hotline: 08-508-00-508"
    }
  },
  {
    id: 8,
    coordinate: { latitude: 59.3012, longitude: 18.0345 },
    title: "Low Risk Area",
    description: "Minor flooding possible in southern Stockholm",
    radius: 500,
    riskLevel: "low",
    detailedInfo: {
      waterLevel: "0.7 meters above normal",
      probability: "30%",
      timeframe: "Next 3-5 days",
      affectedArea: "Årsta and surrounding residential areas",
      evacuationStatus: "No evacuation needed, stay informed",
      emergencyContacts: "Emergency Services: 112, Stockholm Flood Hotline: 08-508-00-508"
    }
  },
  {
    id: 9,
    coordinate: { latitude: 56.0465, longitude: 12.6945 },
    title: "High Risk Area",
    description: "Severe flooding expected in central Helsingborg",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.4 meters above normal",
      probability: "70%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Helsingborg harbor and Kärnan area",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Helsingborg Emergency: 042-105000"
    }
  },
  {
    id: 10,
    coordinate: { latitude: 56.0298, longitude: 12.7012 },
    title: "High Risk Area",
    description: "Severe flooding expected near Öresund coast",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.7 meters above normal",
      probability: "78%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Öresund waterfront and Pålsjö area",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Helsingborg Emergency: 042-105000"
    }
  },
  {
    id: 11,
    coordinate: { latitude: 56.0612, longitude: 12.6823 },
    title: "Medium Risk Area",
    description: "Moderate flooding possible in northern Helsingborg",
    radius: 600,
    riskLevel: "medium",
    detailedInfo: {
      waterLevel: "1.3 meters above normal",
      probability: "52%",
      timeframe: "Next 48-72 hours",
      affectedArea: "Ramlösa and northern residential areas",
      evacuationStatus: "Be prepared for possible evacuation",
      emergencyContacts: "Emergency Services: 112, Helsingborg Emergency: 042-105000"
    }
  },
  
  {
    id: 13,
    coordinate: { latitude: 55.5556, longitude: 14.3528 },
    title: "High Risk Area",
    description: "Severe flooding expected in Simrishamn harbor",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.3 meters above normal",
      probability: "72%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Simrishamn harbor and central waterfront",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Simrishamn Emergency: 0414-81000"
    }
  },
  {
    id: 14,
    coordinate: { latitude: 55.5623, longitude: 14.3445 },
    title: "High Risk Area",
    description: "Severe flooding expected near Baltic Sea coast",
    radius: 800,
    riskLevel: "high",
    detailedInfo: {
      waterLevel: "2.5 meters above normal",
      probability: "76%",
      timeframe: "Next 24-48 hours",
      affectedArea: "Baltic Sea coastline and Tobisvik area",
      evacuationStatus: "Evacuation recommended",
      emergencyContacts: "Emergency Services: 112, Simrishamn Emergency: 0414-81000"
    }
  },
  {
    id: 15,
    coordinate: { latitude: 55.5489, longitude: 14.3612 },
    title: "Medium Risk Area",
    description: "Moderate flooding possible in southern Simrishamn",
    radius: 600,
    riskLevel: "medium",
    detailedInfo: {
      waterLevel: "1.2 meters above normal",
      probability: "48%",
      timeframe: "Next 48-72 hours",
      affectedArea: "Southern residential areas and Brantevik road",
      evacuationStatus: "Be prepared for possible evacuation",
      emergencyContacts: "Emergency Services: 112, Simrishamn Emergency: 0414-81000"
    }
  },
  {
    id: 16,
    coordinate: { latitude: 55.5434, longitude: 14.3389 },
    title: "Low Risk Area",
    description: "Minor flooding possible in western Simrishamn",
    radius: 500,
    riskLevel: "low",
    detailedInfo: {
      waterLevel: "0.8 meters above normal",
      probability: "32%",
      timeframe: "Next 3-5 days",
      affectedArea: "Western outskirts and agricultural areas",
      evacuationStatus: "No evacuation needed, stay informed",
      emergencyContacts: "Emergency Services: 112, Simrishamn Emergency: 0414-81000"
    }
  }
];
