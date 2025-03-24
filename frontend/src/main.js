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
`;

// 🔹 Capturar o evento de envio do formulário
document.getElementById("textForm").addEventListener("submit", sendData);

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

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        responseText.innerText = data.result || "Erro ao processar!";
    } catch (error) {
        responseText.innerText = "Erro ao conectar com o backend!";
        console.error("Erro ao conectar:", error);
    }
}

setupCounter(document.querySelector('#counter'));
