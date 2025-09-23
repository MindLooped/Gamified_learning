export const climateChangeLessons = {
  "climate-basics": {
    id: "climate-basics",
    title: "Understanding Climate Change Basics",
    description: "Learn the fundamental concepts of climate change, greenhouse gases, and their impact on our planet.",
    totalPoints: 500,
    estimatedTime: "15 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "story-intro",
        type: "story" as const,
        title: "Welcome to Earth's Climate Story",
        content: "Imagine Earth as a cozy house with a blanket around it. This blanket is made of invisible gases in our atmosphere that keep our planet warm enough for life.\n\nBut what happens when this blanket gets too thick? Let's explore the fascinating world of climate and discover how small changes can have big impacts!",
        image: "/icons/earth.svg",
        points: 10
      },
      {
        id: "greenhouse-effect",
        type: "info" as const,
        title: "The Greenhouse Effect Explained",
        content: "The greenhouse effect is like a natural thermostat for Earth. Solar energy from the sun enters our atmosphere, and greenhouse gases trap some of this heat, keeping our planet warm.\n\nWithout the greenhouse effect, Earth would be too cold for most life forms. However, too much of these gases can make our planet uncomfortably warm.\n\nThe most abundant greenhouse gas is actually water vapor (H₂O), followed by carbon dioxide (CO₂), methane (CH₄), and nitrous oxide (N₂O).",
        points: 20
      },
      {
        id: "carbon-sources",
        type: "info" as const,
        title: "Sources of Carbon Emissions",
        content: "Carbon dioxide is released through various human activities. The main sources include:\n\n• Burning fossil fuels (coal, oil, gas) for electricity and heat\n• Transportation (cars, planes, ships)\n• Industrial processes and manufacturing\n• Deforestation and land use changes\n• Agriculture and livestock farming\n\nSimple ways to reduce your carbon footprint include: using bicycles, walking, using public transport, switching to renewable energy, and reducing energy consumption at home.",
        points: 30
      },
      {
        id: "climate-impacts",
        type: "info" as const,
        title: "Climate Change Impacts",
        content: "Climate change affects our world in many ways:\n\n🌡️ Rising global temperatures\n🌊 Sea level rise due to melting ice caps\n🌀 More frequent extreme weather events\n🐧 Threats to wildlife and ecosystems\n🌾 Changes in agricultural patterns\n💧 Water scarcity in some regions\n\nThese changes happen gradually but have long-lasting effects on our planet and future generations.",
        points: 20
      },
      {
        id: "solutions-game",
        type: "info" as const,
        title: "Climate Solutions",
        content: "There are many solutions to combat climate change! From renewable energy to sustainable transportation, from forest conservation to innovative technologies.\n\nEvery action counts, whether it's individual choices or global policies. The key is working together towards a sustainable future.\n\nSolar energy is currently the fastest-growing renewable energy source globally, with costs dropping rapidly each year.",
        points: 40
      },
      {
        id: "take-action",
        type: "info" as const,
        title: "Your Climate Action Plan",
        content: "Now that you understand climate change, it's time to take action! Small steps can lead to big changes:\n\n✅ Use renewable energy when possible\n✅ Choose sustainable transportation (walking, cycling, public transport)\n✅ Reduce, reuse, and recycle\n✅ Support climate-friendly policies\n✅ Educate others about climate change\n✅ Make conscious consumer choices\n✅ Plant trees and support reforestation\n✅ Reduce meat consumption\n\nRemember: You have the power to make a difference! Every small action contributes to a larger global movement.",
        points: 50
      }
    ]
  },
  
  "renewable-energy": {
    id: "renewable-energy",
    title: "Renewable Energy Revolution",
    description: "Discover the power of renewable energy sources and their role in fighting climate change.",
    totalPoints: 600,
    estimatedTime: "20 minutes", 
    difficulty: "Intermediate" as const,
    steps: [
      {
        id: "energy-intro",
        type: "story" as const,
        title: "The Energy Revolution Begins",
        content: "For centuries, humans have burned fossil fuels for energy. But now, we're witnessing an incredible transformation - the renewable energy revolution!\n\nThis isn't just about new technology; it's about reimagining how we power our world sustainably.",
        points: 15
      },
      {
        id: "solar-power",
        type: "info" as const,
        title: "Solar Power: Harnessing the Sun",
        content: "Solar panels convert sunlight directly into electricity using photovoltaic cells. India has made remarkable progress in solar energy, with massive solar parks and rooftop installations.\n\nSolar energy is now one of the cheapest forms of electricity in many parts of the world!\n\nIndia's solar capacity target for 2030 is 280 GW, which will significantly help in reducing carbon emissions and achieving energy independence.",
        points: 25
      },
      {
        id: "wind-energy",
        type: "info" as const,
        title: "Wind Energy: Power from the Air",
        content: "Wind turbines capture kinetic energy from moving air and convert it into electricity. Modern wind farms can power entire cities!\n\nIndia has excellent wind resources, especially in coastal areas and hills. Wind energy is clean, renewable, and becoming increasingly cost-effective.\n\nKey advantages of wind energy over fossil fuels include: zero emissions during operation, unlimited fuel source, low operating costs, and job creation in rural areas.",
        points: 35
      },
      {
        id: "other-renewables",
        type: "info" as const,
        title: "More Renewable Sources",
        content: "Beyond solar and wind, there are other exciting renewable energy sources:\n\n💧 Hydroelectric power from flowing water\n🌍 Geothermal energy from Earth's heat\n🌊 Ocean energy from waves and tides\n🌿 Biomass energy from organic materials\n\nEach source has unique advantages and can contribute to a diverse, clean energy portfolio.",
        points: 20
      },
      {
        id: "energy-storage",
        type: "info" as const,
        title: "Energy Storage Solutions",
        content: "One challenge with renewable energy is storage - the sun doesn't always shine, and the wind doesn't always blow.\n\nBattery technology is rapidly improving, making it possible to store renewable energy for use when needed. This is crucial for a fully renewable energy system.\n\nLithium-ion batteries are commonly used for grid-scale energy storage due to their high efficiency, long lifespan, and decreasing costs.",
        points: 45
      },
      {
        id: "future-energy",
        type: "info" as const,
        title: "The Future of Energy",
        content: "The renewable energy future is bright! Costs continue to fall, technology improves, and adoption accelerates worldwide.\n\nIndia aims to achieve 500 GW of renewable energy capacity by 2030. This ambitious goal will help reduce emissions and create millions of jobs in the clean energy sector.\n\nBy 2030, India plans to generate 50% of its electricity from renewable sources, making it one of the world's leaders in clean energy transition.",
        points: 60
      }
    ]
  }
};

// Lesson data for other courses (using same structure for demo)
export const wasteManagementLessons = {
  "waste-basics": {
    id: "waste-basics",
    title: "Waste Management Fundamentals",
    description: "Learn about different types of waste and sustainable management practices.",
    totalPoints: 450,
    estimatedTime: "12 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "waste-intro",
        type: "story" as const,
        title: "The Journey of Waste",
        content: "Every day, we create waste. But where does it go? Understanding waste management is crucial for protecting our environment and creating a sustainable future.\n\nLet's explore the fascinating world of waste and discover how we can turn problems into solutions!",
        points: 15
      },
      {
        id: "waste-types",
        type: "info" as const,
        title: "Types of Waste",
        content: "Not all waste is the same! Different types require different handling:\n\n♻️ Recyclable materials (paper, plastic, metal)\n🍌 Organic waste (food scraps, garden waste) - can be composted\n⚠️ Hazardous waste (batteries, chemicals)\n🗑️ Non-recyclable waste (some plastics, mixed materials)\n\nFood scraps and garden waste are perfect for composting, which turns organic waste into nutrient-rich soil!",
        points: 25
      },
      {
        id: "reduce-reuse-recycle",
        type: "info" as const,
        title: "The 3 R's: Reduce, Reuse, Recycle",
        content: "The waste hierarchy helps us prioritize our actions:\n\n1. REDUCE: Use less, buy only what you need\n2. REUSE: Find new purposes for items (like using old jars for storage)\n3. RECYCLE: Process materials into new products\n\nThe goal is to minimize waste and maximize resource efficiency. Creative reuse ideas include turning old jars into storage containers, using newspapers for gift wrapping, and converting cardboard boxes into organizers!",
        points: 35
      }
    ]
  }
};

export const energyConservationLessons = {
  "energy-saving": {
    id: "energy-saving",
    title: "Smart Energy Conservation",
    description: "Discover practical ways to save energy at home and reduce your environmental impact.",
    totalPoints: 400,
    estimatedTime: "10 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "energy-intro",
        type: "story" as const,
        title: "Energy in Our Daily Lives",
        content: "Energy powers everything we do - from lighting our homes to charging our devices. But using energy wisely can save money and protect the environment.\n\nLet's discover simple ways to become energy-smart!",
        points: 10
      },
      {
        id: "home-energy",
        type: "info" as const,
        title: "Energy Use at Home",
        content: "The average home uses energy for:\n\n💡 Lighting (10%)\n🔥 Heating/Cooling (50%) - This uses the most energy!\n📱 Electronics (20%)\n🚿 Water heating (20%)\n\nSmall changes in each area can add up to big savings! Focus on heating and cooling efficiency for maximum impact.",
        points: 20
      }
    ]
  }
};

// Function to get lessons for a specific course
export const getLessonsForCourse = (courseName: string) => {
  switch (courseName) {
    case "climate_change":
      return climateChangeLessons;
    case "waste_management":
      return wasteManagementLessons;
    case "energy_conservation":
      return energyConservationLessons;
    case "renewable_energy":
      return climateChangeLessons; // Using climate lessons for demo
    case "water_conservation":
      return wasteManagementLessons; // Using waste lessons for demo
    case "biodiversity":
      return energyConservationLessons; // Using energy lessons for demo
    default:
      return climateChangeLessons;
  }
};