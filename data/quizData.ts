export const climateChangeQuiz = [
  {
    question: "What is the most abundant greenhouse gas in our atmosphere?",
    options: [
      "Carbon Dioxide (CO₂)",
      "Water Vapor (H₂O)",
      "Methane (CH₄)",
      "Oxygen (O₂)"
    ],
    answer: "Water Vapor (H₂O)"
  },
  {
    question: "Which renewable energy source is growing fastest globally?",
    options: [
      "Wind Energy",
      "Solar Energy",
      "Hydroelectric Power",
      "Geothermal Energy"
    ],
    answer: "Solar Energy"
  },
  {
    question: "What percentage of India's electricity should come from renewables by 2030?",
    options: [
      "30%",
      "40%",
      "50%",
      "60%"
    ],
    answer: "50%"
  },
  {
    question: "Which activity contributes MOST to carbon emissions?",
    options: [
      "Transportation",
      "Burning fossil fuels for electricity",
      "Agriculture",
      "Deforestation"
    ],
    answer: "Burning fossil fuels for electricity"
  },
  {
    question: "What is India's solar capacity target for 2030?",
    options: [
      "200 GW",
      "250 GW", 
      "280 GW",
      "300 GW"
    ],
    answer: "280 GW"
  }
];

export const wasteManagementQuiz = [
  {
    question: "Which type of waste can be composted?",
    options: [
      "Plastic bottles",
      "Food scraps",
      "Electronic devices",
      "Glass containers"
    ],
    answer: "Food scraps"
  },
  {
    question: "What is the correct order of the 3 R's?",
    options: [
      "Recycle, Reduce, Reuse",
      "Reduce, Reuse, Recycle",
      "Reuse, Reduce, Recycle",
      "Reduce, Recycle, Reuse"
    ],
    answer: "Reduce, Reuse, Recycle"
  },
  {
    question: "Which is the BEST example of reusing an item?",
    options: [
      "Throwing it in recycling bin",
      "Using old jars for storage",
      "Buying fewer items",
      "Composting food waste"
    ],
    answer: "Using old jars for storage"
  }
];

export const energyConservationQuiz = [
  {
    question: "What uses the most energy in most homes?",
    options: [
      "Lighting",
      "Electronics",
      "Heating and cooling",
      "Water heating"
    ],
    answer: "Heating and cooling"
  },
  {
    question: "Which is the best way to save energy at home?",
    options: [
      "Leave lights on for security",
      "Use energy-efficient appliances",
      "Keep windows open in winter",
      "Run dishwasher half-empty"
    ],
    answer: "Use energy-efficient appliances"
  }
];

export const renewableEnergyQuiz = [
  {
    question: "What do solar panels convert sunlight into?",
    options: [
      "Heat energy",
      "Chemical energy",
      "Electrical energy",
      "Mechanical energy"
    ],
    answer: "Electrical energy"
  },
  {
    question: "What type of battery is commonly used for grid-scale energy storage?",
    options: [
      "Lead-acid batteries",
      "Lithium-ion batteries",
      "Alkaline batteries",
      "Nickel-cadmium batteries"
    ],
    answer: "Lithium-ion batteries"
  },
  {
    question: "Wind turbines capture energy from:",
    options: [
      "Flowing water",
      "Moving air",
      "Underground heat",
      "Solar radiation"
    ],
    answer: "Moving air"
  }
];

export const waterConservationQuiz = [
  {
    question: "Which uses the most water in a typical home?",
    options: [
      "Drinking and cooking",
      "Washing clothes",
      "Showering and bathing",
      "Watering plants"
    ],
    answer: "Showering and bathing"
  },
  {
    question: "What is the best way to save water?",
    options: [
      "Take longer showers",
      "Fix leaky faucets",
      "Water plants at noon",
      "Leave tap running while brushing teeth"
    ],
    answer: "Fix leaky faucets"
  }
];

export const biodiversityQuiz = [
  {
    question: "What does biodiversity mean?",
    options: [
      "The number of people in an area",
      "The variety of plant and animal life",
      "The amount of water in ecosystems",
      "The temperature of environments"
    ],
    answer: "The variety of plant and animal life"
  },
  {
    question: "Which is the best way to protect biodiversity?",
    options: [
      "Build more cities",
      "Protect natural habitats",
      "Use more pesticides",
      "Cut down forests"
    ],
    answer: "Protect natural habitats"
  }
];

// Function to get quiz data for a specific course
export const getQuizForCourse = (courseName: string) => {
  switch (courseName) {
    case "climate_change":
      return climateChangeQuiz;
    case "waste_management":
      return wasteManagementQuiz;
    case "energy_conservation":
      return energyConservationQuiz;
    case "renewable_energy":
      return renewableEnergyQuiz;
    case "water_conservation":
      return waterConservationQuiz;
    case "biodiversity":
      return biodiversityQuiz;
    default:
      return climateChangeQuiz;
  }
};