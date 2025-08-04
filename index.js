import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());

const context = `
À propos :
Je suis Anas Akil, développeur full stack (Flutter, MERN, Laravel, WordPress).
Je conçois des applications web et mobiles, des sites e-commerce, des chatbots, etc.

Services :
- Développement d'apps Flutter (Android/iOS)
- Création de sites vitrines et e-commerce avec WordPress
- Automatisation avec Python & Scrapy
- Intégration Odoo
- Déploiement via Netlify, Docker, cPanel

Contact :
- Email : anas@example.com
- Téléphone : +212 6 12 34 56 78

Tarifs :
- Site vitrine : à partir de 500 €
- App mobile Flutter : à partir de 1200 €
`;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant personnel de Anas Akil. Réponds uniquement à partir de ces informations :\n\n${context}\n\nSi tu ne sais pas, réponds honnêtement. Réponds toujours en français.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://anasakil.netlify.app",
          "X-Title": "Anas-Akil-Chatbot",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ answer: reply });
  } catch (error) {
    console.error("Erreur OpenRouter:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erreur serveur OpenRouter" });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur OpenRouter en ligne sur http://localhost:${port}`);
});
