// Script de Automação de Redações - Versão Final e Auto-executável (IIFE)
// Projetado para ser carregado via Bookmarklet (Link RAW)

(function() {
    'use strict';

    // 🛑 CRÍTICO: INSIRA SUA CHAVE DE API REAL AQUI 🛑
    // Se esta chave estiver vazia ou incorreta, o script NÃO FUNCIONARÁ.
    const API_KEY = "AIzaSyANPnG350V1qIE0ofWqWTKIe_5Iggji9c0"; // <--- Sua Chave de API Gemini aqui!
    const MODEL_NAME = "gemini-2.5-flash"; 
    
    // --- ESTILOS DO CARD DE STATUS (CSS INLINE) ---
    function createStatusCard(message, type = 'info') {
        const cardId = 'auto-redacao-status-card';
        let cardContainer = document.getElementById(cardId);

        if (!cardContainer) {
            cardContainer = document.createElement('div');
            cardContainer.id = cardId;
            // Estilos para o Card (Tema Escuro, Profissional, sem CSS externo)
            cardContainer.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.85); backdrop-filter: blur(4px);
                display: flex; justify-content: center; align-items: center; z-index: 999999;
                font-family: 'Inter', sans-serif; opacity: 0; transition: opacity 0.3s;
            `;
            document.body.appendChild(cardContainer);
        }

        let typeColor = '#ffffff';
        let typeLabel = 'INFO';
        if (type === 'error') { typeColor = '#e06c75'; typeLabel = 'ERRO'; }
        if (type === 'success') { typeColor = '#98c379'; typeLabel = 'SUCESSO'; }

        cardContainer.innerHTML = `
            <div style="background: #111111; color: #ffffff; padding: 25px; border-radius: 8px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7); max-width: 400px; width: 90%;
                        border-left: 5px solid ${typeColor};">
                <div style="font-size: 1.1em; font-weight: 700; margin-bottom: 10px; color: ${typeColor};">
                    [${typeLabel}]
                </div>
                <div style="font-size: 0.95em; line-height: 1.5; white-space: pre-wrap;">
                    ${message}
                </div>
                <button onclick="document.getElementById('${cardId}').style.opacity = '0';"
                        style="margin-top: 15px; padding: 8px 15px; background-color: ${typeColor};
                                color: #111111; border: none; border-radius: 4px; cursor: pointer;
                                float: right; font-weight: 600;">
                    OK
                </button>
            </div>
        `;

        cardContainer.style.opacity = '1';
    }

    // --- FUNÇÕES DE LÓGICA DO SCRIPT ---

    async function insertTextIntoTextarea(container, text) {
        const textarea = container.querySelector("textarea:not([aria-hidden=\"true\"])");
        if (!textarea) return false;

        // Tenta contornar frameworks (React, etc.)
        textarea.value = text;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
        textarea.dispatchEvent(new Event("blur", { bubbles: true }));

        // Fallback para frameworks mais complexos
        const reactKeys = Object.keys(textarea).filter(key => key.startsWith("__reactProps$"));
        if (reactKeys.length > 0) {
            try {
                const reactProps = textarea[reactKeys[0]];
                if (reactProps && typeof reactProps.onChange === "function") {
                    const event = { target: { value: text }, preventDefault: () => {} };
                    reactProps.onChange(event);
                }
            } catch (error) {
                console.error("[ERRO] Falha na injeção via React:", error);
            }
        }
        return true;
    }

    async function getAIResponse(prompt) {
        if (!API_KEY) {
            throw new Error("Chave de API ausente ou vazia.");
        }
        
        createStatusCard("Conectando à IA... Aguarde.", 'info');

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[ERRO] Detalhes do Erro da API:", errorData);
                throw new Error(`Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                if (data.candidates?.[0]?.finishReason === "SAFETY") {
                   throw new Error("Resposta bloqueada por segurança da IA.");
                }
                throw new Error("Resposta inválida da API ou texto de resposta vazio.");
            }

            return text;
        } catch (error) {
            createStatusCard(`Falha na IA: ${error.message}. Verifique sua chave de API.`, 'error');
            throw error;
        }
    }

    async function processEssay() {
        const decodedMessage = "W0lORk9dIHNjcmlwdCBmZWl0byBwb3Igc2FpbnRzIHwgZGlzY29yZC5nZy8zQnY3cWhGWnwgc2Ugdm9jZSBwYWdvdSBwb3IgaXNzbyB2b2NlIGZvaSBlbmdhbmFkbw==";
        console.log(atob(decodedMessage));

        // 1. Verificação inicial da chave de API
        if (!API_KEY) {
            createStatusCard("🚨 ERRO CRÍTICO: A CHAVE DE API ESTÁ VAZIA. Edite o arquivo no GitHub e preencha a 'const API_KEY'.", 'error');
            return;
        }

        // 2. Coleta de dados (Seletores CSS originais)
        const essayData = {
            coletanea: document.querySelector(".ql-editor") ? document.querySelector(".ql-editor").innerHTML : 'Não encontrado',
            enunciado: document.querySelector(".ql-align-justify") ? document.querySelector(".ql-align-justify").innerText : 'Não encontrado',
            generoTextual: document.querySelector(".css-1cq7p20") ? document.querySelector(".css-1cq7p20").innerText : 'Não Especificado',
            criteriosAvaliacao: document.querySelector(".css-1pvvm3t") ? document.querySelector(".css-1pvvm3t").innerText : 'Não Especificado'
        };

        if (essayData.enunciado === 'Não encontrado') {
             createStatusCard("⚠️ AVISO: Não consegui encontrar o enunciado da redação. Isso pode causar uma resposta incorreta. Tentando continuar...", 'error');
        }


        // 3. Prompt de Geração
        const generationPrompt = `
            Você é um escritor de redações especializado no formato ENEM/Vestibular. Crie uma redação completa.
            INSTRUÇÕES CRÍTICAS:
            - Garanta que o texto pareça 100% humanizado e natural, escrito por um estudante.
            - O FORMATO DA RESPOSTA DEVE SER EXATAMENTE ESTE:
            TITULO: [O seu título aqui]
            TEXTO: [O texto completo da sua redação aqui]
            DADOS DA REDAÇÃO: ${JSON.stringify(essayData)}
        `;

        // 4. Geração e Humanização
        let aiResponse;
        try {
            aiResponse = await getAIResponse(generationPrompt);
        } catch (error) {
            console.error("[ERRO] Falha na Geração: ", error);
            return;
        }
        
        // 5. Extração e Validação
        if (!aiResponse.includes("TITULO:") || !aiResponse.includes("TEXTO:")) {
            createStatusCard("Erro: A IA não seguiu o formato de resposta esperado (TITULO:/TEXTO:). Tente novamente.", 'error');
            return;
        }

        const title = aiResponse.match(/TITULO:\s*([\s\S]*?)TEXTO:/i)?.[1]?.trim() || "Título Gerado";
        const essayText = aiResponse.match(/TEXTO:\s*([\s\S]*)/i)?.[1]?.trim() || "";

        if (!essayText) {
             createStatusCard("Erro: A IA gerou um texto vazio.", 'error');
             return;
        }

        // 6. Inserção
        const allTextareas = document.querySelectorAll("textarea");
        if (allTextareas.length < 2) {
            createStatusCard("Erro: Não encontrei os campos de Título e Texto (apenas encontrei " + allTextareas.length + " campos). Os seletores CSS da plataforma podem ter mudado.", 'error');
            return;
        }
        
        // Insere Título e depois o Texto com um pequeno delay
        await insertTextIntoTextarea(allTextareas[0].parentElement, title);
        await insertTextIntoTextarea(allTextareas[allTextareas.length - 1].parentElement, essayText);

        createStatusCard("✨ Redação inserida com sucesso! Lembre-se de revisar o texto.", 'success');
    }

    // Inicia o processo
    processEssay();
    
})();
