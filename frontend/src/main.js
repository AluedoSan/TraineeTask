import './style.css'; 
import { setupCounter } from './counter.js';

document.querySelector('#app').innerHTML = `
    <h1>Search Items Amazon</h1>
    <form id="textForm">
      <div class="aline">
        <input type="text" id="textInput">
        <button id="sendButton" type="submit">Send</button>
      </div>
    </form>
    <p id="responseText"></p>
    <h2 id="amazonTitle">Título da Amazon: carregando...</h2>
`;

// 🔹 Captura o evento de envio do formulário
document.getElementById("textForm").addEventListener("submit", sendData);

// 🔹 Busca o título da Amazon ao carregar a página
async function fetchAmazonTitle() {
    try {
        const response = await fetch("http://localhost:3000/api/title");
        const data = await response.json();
        
        document.getElementById("amazonTitle").innerText = `${data.title}`;
    } catch (error) {
        document.getElementById("amazonTitle").innerText = "Erro ao buscar título!";
        console.error("Erro ao buscar título:", error);
    }
}

// 🔹 Envia o formulário sem recarregar a página
async function sendData(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const inputText = document.getElementById("textInput").value;
    const responseText = document.getElementById("responseText");

    if (!inputText) {
        responseText.innerText = "Por favor, digite algo!";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: inputText })
        });

        const data = await response.json();
        responseText.innerText = data.result || "Erro ao processar!";
    } catch (error) {
        responseText.innerText = "Erro ao conectar com o backend!";
        console.error("Erro ao conectar:", error);
    }
}

// 🔹 Chama a função para buscar o título ao iniciar
fetchAmazonTitle();

setupCounter(document.querySelector('#counter'));
