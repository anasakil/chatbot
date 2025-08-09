import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config();
const app = express();
const port = 4500; 

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 20,
  message: "Trop de requêtes, réessayez plus tard.",
});
app.use(limiter);

// ✅ Contexte du chatbot
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

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ Validation du message
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Le message est requis et doit être une chaîne non vide." });
    }

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
    res.json({ answer: reply });
  } catch (error) {
    console.error("Erreur Groq:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erreur serveur Groq" });
  }
});

// ✅ Endpoint de test
app.get("/ping", (req, res) => res.send("pong"));

app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${port}`);
});
