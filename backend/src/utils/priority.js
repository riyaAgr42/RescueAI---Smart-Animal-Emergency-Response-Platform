const KEYWORDS = {
  critical: ["bleeding", "fracture", "unconscious", "severe", "burn", "hit by", "crushed"],
  elevated: ["limping", "injured", "stuck", "trapped", "vomit", "can't move", "weak"],
};

export const inferPriority = (description = "") => {
  const text = description.toLowerCase();
  let score = 0;
  let injuryDetected = false;

  KEYWORDS.critical.forEach((word) => {
    if (text.includes(word)) {
      score += 3;
      injuryDetected = true;
    }
  });
  KEYWORDS.elevated.forEach((word) => {
    if (text.includes(word)) {
      score += 2;
      injuryDetected = true;
    }
  });

  let priority = "low";
  if (score >= 4) priority = "high";
  else if (score >= 2) priority = "medium";

  return { priority, injuryDetected, score };
};
