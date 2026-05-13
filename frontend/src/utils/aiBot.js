// Base canned replies for quick intent hits
const canned = [
  { match: ["bleeding", "injury", "wound"], reply: "Keep the animal warm and limit movement. If bleeding is heavy, apply gentle pressure with clean cloth and call a vet. I marked this High priority." },
  { match: ["fracture", "bone"], reply: "Avoid moving the limb; keep the animal still. Volunteers will handle transport. I set this High priority." },
  { match: ["volunteer", "nearby", "help"], reply: "Volunteers see nearby cases automatically. Enable location and ensure the case is accepted." },
  { match: ["status", "case"], reply: "Track status in Dashboard → timeline. Pending → Accepted → Completed means rescued." },
  { match: ["settings", "theme", "dark"], reply: "Switch between light/dark in the header menu or Settings page." },
  { match: ["hello", "hi"], reply: "Hi! I'm your RescueAI assistant. Ask me about reporting, volunteers, or priorities." },
];

// Generate ~200 FAQ entries across species/issues/actions
const species = ["dog", "cat", "cow", "bird", "monkey", "goat", "horse", "donkey", "pig", "puppy"];
const issues = ["bleeding", "fracture", "limping", "heatstroke", "dehydrated", "burn", "hit by vehicle", "poison", "snake bite", "stuck"];
const actions = ["report", "handle", "treat", "wait for help", "transport"];

const faq = [];
for (const s of species) {
  for (const i of issues) {
    for (const a of actions) {
      if (faq.length >= 200) break;
      const q = `${a} ${s} ${i}`;
      const answer = `For a ${s} with ${i}: keep calm, ensure safety, limit movement, provide shade/water if safe, and upload a photo + location. Volunteers are alerted.`;
      faq.push({ q, reply: answer });
    }
    if (faq.length >= 200) break;
  }
  if (faq.length >= 200) break;
}

export const getAIResponse = (text) => {
  const lower = text.toLowerCase();

  // If photo hint present
  if (lower.includes("[photo]")) {
    return "I see you attached a photo. Make sure it’s clear and close to the injury. Volunteers will use it to assess faster.";
  }

  // FAQ match (200 generated)
  const hit = faq.find((f) => lower.includes(f.q.split(" ")[1]) && lower.includes(f.q.split(" ")[2]));
  if (hit) return hit.reply;

  // Simple canned intents
  for (const item of canned) {
    if (item.match.some((m) => lower.includes(m))) {
      return item.reply;
    }
  }

  return "Thanks for asking! Include photo + location + urgency keywords (bleeding, fracture, stuck) so I can flag priority and alert nearby volunteers.";
};
