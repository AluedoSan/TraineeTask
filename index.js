import express from "express";
import axios from "axios";
import path from "path";
import { JSDOM } from "jsdom";

const app = express();
const port = 3000;
app.use(express.json());


// 🔹 Rota para buscar o título da Amazon
async function getData() {
    try {
        const response = await axios.get("https://www.amazon.com.br", {
            headers: { 
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Referer": "https://www.google.com/"
            }
        });

        const dom = new JSDOM(response.data);
        const title = dom.window.document.title;

        return title || "Title not found"; // Se title for vazio, retorna fallback
    } catch (error) {
        console.error("Error fetching data:", error.message);
        return "Error loading title";
    }
}

// 🔹 Rota para processar dados enviados pelo frontend
app.post("/api/process", (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Texto é obrigatório!" });
    }

    console.log("Texto recebido:", text);

    // Simula um processamento no backend
    const processedText = text.toUpperCase();

    res.json({ message: "Texto processado com sucesso!", result: processedText });
});
 
// 🔹 Rota API para o frontend consumir
app.get("/api/title", async (req, res) => {
    try {
        const title = await getData();
        res.json({ title });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔹 Servir o frontend do Vite (pós-build)
app.use(express.static("frontend"));

app.get("*", (req, res) => {
    res.sendFile(path.join(import.meta.dir, "frontend/index.html"));
});

// 🔹 Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Backend rodando em: http://localhost:${port}`);
});
