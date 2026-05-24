const animalKeywords = {
  dog: ["dog", "puppy", "street dog", "canine"],
  cat: ["cat", "kitten", "feline"],
  cow: ["cow", "calf", "cattle"],
  bird: ["bird", "pigeon", "crow", "parrot"],
};

const severityRules = [
  { level: "critical", score: 95, words: ["bleeding", "fracture", "not moving", "accident", "critical", "unconscious"] },
  { level: "medium", score: 70, words: ["injured", "limping", "wound", "weak", "pain", "crying"] },
];

const detectAnimalType = (description, selectedAnimalType) => {
  if (selectedAnimalType && selectedAnimalType !== "other") return selectedAnimalType;
  const normalized = description.toLowerCase();

  const match = Object.entries(animalKeywords).find(([, keywords]) =>
    keywords.some((word) => normalized.includes(word))
  );

  return match ? match[0] : "other";
};

const detectSeverity = (description, emergencyLevel) => {
  if (emergencyLevel === "critical") return { severity: "critical", score: 98 };
  const normalized = description.toLowerCase();
  const match = severityRules.find((rule) =>
    rule.words.some((word) => normalized.includes(word))
  );

  if (match) return { severity: match.level, score: match.score };
  if (emergencyLevel === "high") return { severity: "medium", score: 74 };
  if (emergencyLevel === "medium") return { severity: "medium", score: 62 };
  return { severity: "mild", score: 38 };
};

const buildSuggestions = (severity, animalType) => {
  const base = [
    "Share a landmark or nearby shop name so the volunteer can reach the exact location quickly.",
    "Stay nearby only if it is safe and avoid crowding the animal.",
  ];

  if (severity === "critical") {
    return [
      "Do not force the animal to stand or move if major trauma is visible.",
      "Keep vehicles and bystanders away until help arrives.",
      ...base,
    ];
  }

  if (animalType === "bird") {
    return [
      "Use a cloth or box only if the bird can be handled safely without causing extra stress.",
      ...base,
    ];
  }

  return [
    "Approach slowly and avoid sudden movements around the animal.",
    ...base,
  ];
};

export const analyzeCaseReport = ({ description, animalType, emergencyLevel }) => {
  const detectedAnimalType = detectAnimalType(description, animalType);
  const { severity, score } = detectSeverity(description, emergencyLevel);

  return {
    animalType: detectedAnimalType,
    injuryDetected: severity !== "mild",
    severity,
    score,
    duplicateRisk: description.trim().length < 30 ? "review" : "low",
    suggestions: buildSuggestions(severity, detectedAnimalType),
  };
};
