import axios from "axios";

const context = `
À propos :
Je suis Anas Akil, développeur full stack (Flutter, MERN, Laravel, WordPress).
Je conçois des applications web et mobiles, des sites e-commerce, des chatbots, etc.

Services :
- Développement d'apps mobile Flutter (Android/iOS)
- Création de sites vitrines et e-commerce avec WordPress
- Automatisation avec n8n    Web scraping Python & Scrapy
- Déploiement via Netlify, Docker, cPanel

Contact :
- Email : anas@example.com
- Téléphone : +212 6 12 34 56 78

Tarifs :
- Site vitrine : à partir de 500€
- App mobile Flutter : à partir de 1200€
`;

export default async function handler(req, res) {
  // ✅ Activer CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Répondre aux requêtes OPTIONS (pré-vol CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Ne garder que POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Le message est requis et doit être une chaîne non vide." });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "moonshotai/kimi-k2-instruct",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant personnel de Anas Akil. Tu dois répondre uniquement à partir de ces informations :\n\n${context}\n\nSi tu ne sais pas, réponds honnêtement.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ answer: reply });
  } catch (error) {
    console.error("Erreur Groq:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erreur serveur Groq" });
  }
}
