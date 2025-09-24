export const climateChangeLessons = {
  "climate-video-lesson": {
    id: "climate-video-lesson",
    title: "Climate Change Interactive Videos",
    description: "Watch videos with popup questions",
    totalPoints: 100,
    estimatedTime: "20 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "intro",
        type: "video" as const,
        title: "Understanding Climate Change",
        content: "Learn about the basics of climate change and its impact",
        videoUrl: "https://www.youtube.com/watch?v=dcBXmj1nMTQ",
        points: 40,
        videoQuestions: [
          {
            time: 60,
            question: "What is the main cause of climate change?",
            options: [
              "Greenhouse gas emissions",
              "Solar flares",
              "Ocean currents",
              "Wind patterns"
            ],
            correctAnswer: "Greenhouse gas emissions",
            points: 20
          }
        ]
      }
    ]
  }
};

export const wasteManagementLessons = {
  "waste-basics": {
    id: "waste-basics",
    title: "Waste Management",
    description: "Learn waste management through videos",
    totalPoints: 100,
    estimatedTime: "15 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "intro",
        type: "video" as const,
        title: "Waste Management Basics",
        content: "Learn about proper waste management techniques",
        videoUrl: "https://www.youtube.com/watch?v=OasbYWF4_S8",
        points: 40,
        videoQuestions: [
          {
            time: 60,
            question: "What are the 3 R's of waste management?",
            options: [
              "Reduce, Reuse, Recycle",
              "Read, Write, Run",
              "React, Return, Repeat",
              "Review, Repair, Replace"
            ],
            correctAnswer: "Reduce, Reuse, Recycle",
            points: 20
          }
        ]
      }
    ]
  }
};

export const energyConservationLessons = {
  "energy-basics": {
    id: "energy-basics",
    title: "Energy Conservation",
    description: "Learn energy saving through videos",
    totalPoints: 100,
    estimatedTime: "15 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "intro",
        type: "video" as const,
        title: "Energy Conservation Methods",
        content: "Learn how to save energy effectively",
        videoUrl: "https://www.youtube.com/watch?v=1-g73ty9v04",
        points: 40,
        videoQuestions: [
          {
            time: 60,
            question: "Which action saves the most energy?",
            options: [
              "Using LED bulbs",
              "Keeping windows open",
              "Using old appliances",
              "Leaving lights on"
            ],
            correctAnswer: "Using LED bulbs",
            points: 20
          }
        ]
      }
    ]
  }
};

export const waterConservationLessons = {
  "water-basics": {
    id: "water-basics",
    title: "Water Conservation",
    description: "Learn water saving through videos",
    totalPoints: 100,
    estimatedTime: "15 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "intro",
        type: "video" as const,
        title: "Water Conservation Techniques",
        content: "Learn effective ways to save water",
        videoUrl: "https://www.youtube.com/watch?v=yeqwDLsZJn8",
        points: 40,
        videoQuestions: [
          {
            time: 60,
            question: "How can you save water in the bathroom?",
            options: [
              "Fix leaking faucets",
              "Take longer showers",
              "Leave taps running",
              "Use more water"
            ],
            correctAnswer: "Fix leaking faucets",
            points: 20
          }
        ]
      }
    ]
  }
};

export const biodiversityLessons = {
  "biodiversity-basics": {
    id: "biodiversity-basics",
    title: "Biodiversity",
    description: "Learn about biodiversity through videos",
    totalPoints: 100,
    estimatedTime: "15 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "intro",
        type: "video" as const,
        title: "Understanding Biodiversity",
        content: "Learn about the importance of biodiversity",
        videoUrl: "https://www.youtube.com/watch?v=GK_vRtHJZu4",
        points: 40,
        videoQuestions: [
          {
            time: 60,
            question: "What is biodiversity?",
            options: [
              "The variety of life in an ecosystem",
              "Only plant species",
              "Only animal species",
              "Only marine life"
            ],
            correctAnswer: "The variety of life in an ecosystem",
            points: 20
          }
        ]
      }
    ]
  }
};

export const renewableEnergyLessons = {
  "renewable-basics": {
    id: "renewable-basics",
    title: "Renewable Energy",
    description: "Learn about renewable energy through videos",
    totalPoints: 100,
    estimatedTime: "15 minutes",
    difficulty: "Beginner" as const,
    steps: [
      {
        id: "intro",
        type: "video" as const,
        title: "Introduction to Renewable Energy",
        content: "Learn about different types of renewable energy",
        videoUrl: "https://www.youtube.com/watch?v=1kUE0BZtTRc",
        points: 40,
        videoQuestions: [
          {
            time: 60,
            question: "Which of these is a renewable energy source?",
            options: [
              "Solar power",
              "Coal",
              "Oil",
              "Natural gas"
            ],
            correctAnswer: "Solar power",
            points: 20
          }
        ]
      }
    ]
  }
};

export const getLessonsForCourse = (courseName: string) => {
  switch (courseName) {
    case "climate_change":
      return climateChangeLessons;
    case "waste_management":
      return wasteManagementLessons;
    case "energy_conservation":
      return energyConservationLessons;
    case "renewable_energy":
      return renewableEnergyLessons;
    case "water_conservation":
      return waterConservationLessons;
    case "biodiversity":
      return biodiversityLessons;
    default:
      return climateChangeLessons;
  }
};
