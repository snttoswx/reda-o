// Script de Automação de Redação (LIMPO, Legível e Otimizado para 2000 caracteres)
(function() {
    'use strict';

    // --- CONFIGURAÇÕES CRÍTICAS (Ajustadas para 2000 caracteres) ---
    const API_KEY = "AIzaSyANPnG350V1qIE0ofWqWTKIe_5Iggji9c0";
    const MODEL_NAME = "gemini-2.5-flash-preview-09-2025"; 
    const MAX_CHARACTERS = 2000; // Limite de caracteres que você deseja
    const MAX_TOKENS = 3000; // Limite de tokens aumentado para garantir que chegue perto de 2000 caracteres

    // MENSAGEM DE AVISO ATUALIZADA: Incluindo créditos e alerta contra scam.
    const GENERIC_WELCOME_MESSAGE = `
⚠️ ALERTA IMPORTANTE! ⚠️
Se você pagou por este script, você foi SCAMADO(A).

Este código é GRATUITO, open source, e foi feito com ❤️ por Saints.
Apoie o desenvolvimento e participe da comunidade:
- Servidor Discord: NetworkClass
- Criador: Saints
    
Clique OK para começar a gerar a redação (máx. ${MAX_CHARACTERS} caracteres).
`;
    
    /**
     * Cria o elemento base do Card flutuante (modal) no centro da tela.
     */
    function createBaseCardElement() {
        const cardId = 'auto-redacao-card-container';
        let cardContainer = document.getElementById(cardId);

        if (cardContainer) return cardContainer;

        cardContainer = document.createElement('div');
        cardContainer.id = cardId;
        
        // Estilo para o CARD CENTRO E BONITINHO (Tema Escuro Profissional, baseado no CSS fornecido)
        cardContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9); /* Fundo mais escuro e opaco */
            backdrop-filter: blur(5px); /* Efeito de vidro moderno */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        `;
        
        // Estrutura interna do CARD
        cardContainer.innerHTML = `
            <div id="auto-redacao-card-content" style="
                background: #0d0d0d; /* Fundo escuro levemente mais elevado */
                color: #ffffff;
                padding: 30px;
                border-radius: 12px; /* Mais arredondado */
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9); /* Sombra mais profunda */
                max-width: 90%;
                min-width: 350px;
                text-align: left;
                font-family: 'Inter', sans-serif; 
                border: 1px solid rgba(255, 255, 255, 0.15); /* Borda sutil */
                transform: scale(0.95);
                transition: transform 0.3s;
            ">
                <div id="card-message-type" style="
                    font-size: 1.1em;
                    font-weight: 700;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* Linha divisória mais visível */
                    color: #e0e0e0;
                "></div>
                <div id="card-message-text" style="
                    font-size: 1em;
                    line-height: 1.6; 
                    white-space: pre-wrap;
                    color: #ffffff;
                    margin-bottom: 20px; 
                "></div>
                <!-- Botão OK (Sempre visível e funcional) -->
                <button id="card-ok-button" style="
                    float: right;
                    padding: 10px 20px;
                    background-color: #ffffff; /* Botão claro para contraste */
                    color: #000000;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9em;
                    transition: all 0.2s;
                " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='#ffffff'" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
                    OK
                </button>
            </div>
        `;
        
        document.body.appendChild(cardContainer);
        return cardContainer;
    }

    /**
     * Exibe o Card de Status no centro da tela.
     * @param {string} message A mensagem a ser exibida.
     * @param {('info'|'warn'|'success'|'error')} type O tipo de notificação.
     */
    function showStatusCard(message, type = 'info') {
        // Loga no console
        console.log(`[NOTIFICAÇÃO ${type.toUpperCase()}] ${message}`);

        const cardContainer = createBaseCardElement();
        const cardContent = document.getElementById('auto-redacao-card-content');
        const messageTypeEl = document.getElementById('card-message-type');
        const messageTextEl = document.getElementById('card-message-text');
        const okButton = document.getElementById('card-ok-button'); // Pega o botão

        let typeLabel = '';
        let typeColor = '#61afef'; // INFO
        let typeIcon = ' [i] '; // Ícone de informação (sem emoji)

        if (type === 'success') {
            typeLabel = 'SUCESSO';
            typeColor = '#98c379';
            typeIcon = ' [OK] '; // Ícone de sucesso (sem emoji)
        } else if (type === 'error') {
            typeLabel = 'ERRO FATAL';
            typeColor = '#e06c75';
            typeIcon = ' [X] '; // Ícone de erro (sem emoji)
        } else if (type === 'warn') {
            typeLabel = 'AVISO';
            typeColor = '#e5c07b';
            typeIcon = ' [!!] '; // Ícone de aviso (sem emoji)
        }
        
        // Remove emoji, usa o texto do ícone
        messageTypeEl.textContent = `${typeIcon}${typeLabel}`; 
        messageTypeEl.style.color = typeColor;
        messageTextEl.textContent = message;
        
        // Adiciona um brilho sutil ao redor do card com a cor do status
        cardContent.style.boxShadow = `0 0 10px ${typeColor}66, 0 20px 40px rgba(0, 0, 0, 0.9)`;
        cardContent.style.border = `1px solid ${typeColor}`;
        cardContainer.style.pointerEvents = 'auto';
        cardContainer.style.opacity = '1';

        // Função para fechar o card
        const closeCard = () => {
            cardContainer.style.opacity = '0';
            cardContainer.style.pointerEvents = 'none';
        };

        // Adiciona o evento de clique no botão (SEMPRE ATIVO)
        okButton.onclick = closeCard;
        okButton.style.display = 'block'; 
        cardContainer.onclick = null; 
    }

    // A função showNotification agora é um wrapper para o novo Card de Status
    function showNotification(message, type = 'info') {
        showStatusCard(message, type); 
    }

    /**
     * Tenta inserir texto em um elemento textarea, utilizando métodos
     * para contornar frameworks como React e garantir a atualização.
     */
    async function insertTextIntoTextarea(container, text) {
        // Encontra o textarea visível
        const textarea = container.querySelector("textarea:not([aria-hidden=\"true\"])");
        if (!textarea) {
            console.error("[ERRO] Elemento textarea não encontrado no container.");
            showStatusCard("Erro: Campo de texto não encontrado. Clique OK para continuar.", 'error');
            return false;
        }

        let insertionAttempted = false;

        // 1. Método de Injeção de Propriedades (React/Frameworks)
        try {
            const reactKeys = Object.keys(textarea).filter(key => 
                key.startsWith("__reactProps$") || 
                key.startsWith("__reactEventHandlers$") || 
                key.startsWith("__reactFiber$") ||
                key.startsWith("__react")
            );

            if (reactKeys.length > 0) {
                for (const key of reactKeys) {
                    const reactProps = textarea[key];
                    if (reactProps && typeof reactProps.onChange === "function") {
                        console.log("[DEBUG] Tentativa 1: Manipulador onChange encontrado e usado.");
                        
                        const event = {
                            target: { value: text },
                            currentTarget: { value: text },
                            preventDefault: () => {},
                            stopPropagation: () => {}
                        };

                        reactProps.onChange(event);
                        insertionAttempted = true;
                        break; 
                    }
                }
            }
        } catch (error) {
            console.error("[ERRO] Falha na tentativa de inserção via React:", error);
        }

        // 2. Método de Eventos Padrão (Fallback)
        if (!insertionAttempted) {
            try {
                textarea.value = text;
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
                textarea.dispatchEvent(new Event("change", { bubbles: true }));
                textarea.dispatchEvent(new Event("blur", { bubbles: true }));
                insertionAttempted = true;
                console.log("[DEBUG] Tentativa 2: Eventos DOM padrão disparados.");
            } catch (error) {
                console.error("[ERRO] Falha na tentativa de inserção via Eventos Padrão:", error);
            }
        }

        setTimeout(() => {
            if (textarea.value === text) {
                console.log("[SUCESSO] Texto inserido e campo atualizado.");
            } else {
                console.error("[ERRO] Falha na inserção final. Valor atual:", textarea.value);
            }
        }, 500);

        return insertionAttempted;
    }

    /**
     * Chama a API do Gemini para gerar conteúdo.
     */
    async function getAIResponse(prompt) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
        
        showStatusCard("Conectando à IA... Clique em OK para fechar.", 'info');

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.8,
                        topK: 40,
                        maxOutputTokens: MAX_TOKENS 
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("[ERRO] Detalhes do Erro da API:", errorData);
                showStatusCard(`Erro API: ${response.status}. Clique OK para fechar.`, 'error');
                throw new Error(`Erro na API do Gemini: ${response.status}`);
            }

            const data = await response.json();

            if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
                const finishReason = data.candidates?.[0]?.finishReason;
                let userMessage = `A resposta foi bloqueada pela IA. Razão: ${finishReason || 'Desconhecida'}.`;
                    
                if (finishReason === "SAFETY") {
                    userMessage = "A resposta foi bloqueada pela segurança da IA. Clique OK para fechar.";
                } else if (finishReason === "MAX_OUTPUT_TOKENS") {
                    userMessage = `A IA parou de escrever devido ao limite de tokens/tamanho (${MAX_TOKENS} tokens). Clique OK para fechar.`;
                }
                    
                showStatusCard(userMessage, 'error'); 
                throw new Error(`A API bloqueou a resposta: ${finishReason}.`);
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("[ERRO] Falha ao obter resposta da IA:", error);
            // Se o erro não for tratado acima (como erro 400), mostra este:
            if (!document.getElementById('auto-redacao-card-container').style.opacity === '1') {
                showStatusCard(`Falha na IA: ${error.message}. Clique OK para fechar.`, 'error'); 
            }
            throw error;
        }
    }

    /**
     * Função principal para processar e inserir a redação.
     */
    async function processEssay() {
        // 1. Verificação da Página
        if (!document.body || !document.body.textContent.includes("Redação")) {
            console.error("[ERRO] Script deve ser executado em uma página de redação.");
            showStatusCard("Erro: Execute este script na página de Redação. Clique OK para fechar.", 'error');
            return;
        }
        
        // 2. Mensagem de Boas-Vindas
        // Exibe a mensagem de alerta/créditos usando o tipo 'warn' para destaque
        showStatusCard(GENERIC_WELCOME_MESSAGE, 'warn'); 
        
        // Espera o usuário clicar em OK no aviso inicial
        const okButton = document.getElementById('card-ok-button');

        await new Promise(resolve => {
            if (okButton) {
                okButton.addEventListener('click', () => {
                    resolve();
                }, { once: true });
            } else {
                setTimeout(resolve, 3000);
            }
        });
        
        // 3. Coleta de Dados da Página
        // Tentativa de coletar dados do enunciado e critérios (os seletores podem variar)
        const coletanea = document.querySelector(".ql-editor") ? document.querySelector(".ql-editor").innerHTML : "Não encontrado";
        const enunciado = document.querySelector(".ql-align-justify") ? document.querySelector(".ql-align-justify").innerText : "Não encontrado";
        const generoTextual = document.querySelector(".css-1cq7p20") ? document.querySelector(".css-1cq7p20").innerText : "Não Especificado";
        const criteriosAvaliacao = document.querySelector(".css-1pvvm3t") ? document.querySelector(".css-1pvvm3t").innerText : "Não Especificado";

        const essayData = {
            coletanea: coletanea,
            enunciado: enunciado,
            generoTextual: generoTextual,
            criteriosAvaliacao: criteriosAvaliacao
        };

        // 4. Prompt para Geração de Redação
        const generationPrompt = `
Você é um escritor de redações especializado no formato ENEM/Vestibular.

Com base nos seguintes dados da redação, crie uma redação completa.

INSTRUÇÕES CRÍTICAS:
- O TÍTULO e o TEXTO JUNTOS devem ter NO MÁXIMO ${MAX_CHARACTERS} CARACTERES.
- O texto deve ser escrito com tom e vocabulário de um estudante do ensino médio, evitando linguagem robótica ou excessivamente formal.
- Garanta que o texto pareça 100% humanizado e natural.
- Adapte ao gênero textual: ${generoTextual}.
- A redação deve ser dividida em parágrafos (Introdução, Desenvolvimento, Conclusão).
- CRÍTICO: NÃO inclua no texto final NENHUMA menção a limites de caracteres, que o texto foi gerado por IA, ou qualquer metadado de geração. O texto deve ser puramente a redação.

DADOS DA REDAÇÃO:
${JSON.stringify(essayData)}

FORMATO DA RESPOSTA (obrigatório, sem texto adicional):
TITULO: [Aqui o título da redação]
TEXTO: [Aqui o texto completo da redação]
`;

        showNotification(`Gerando redação (Limite: ${MAX_CHARACTERS} caracteres)... Clique OK para fechar.`, 'info');
        console.log(`[INFO] Gerando redação com IA (máx. ${MAX_CHARACTERS} caracteres e ${MAX_TOKENS} tokens)...`);

        try {
            const aiResponse = await getAIResponse(generationPrompt);

            if (!aiResponse.includes("TITULO:") || !aiResponse.includes("TEXTO:")) {
                throw new Error("Formato de resposta da IA inválido.");
            }

            // Extração do Título e Texto
            const titleMatch = aiResponse.match(/TITULO:\s*([\s\S]*?)TEXTO:/i);
            const textMatch = aiResponse.match(/TEXTO:\s*([\s\S]*)/i);

            const title = titleMatch && titleMatch[1] ? titleMatch[1].trim() : "Redação Gerada Automaticamente";
            let essayText = textMatch && textMatch[1] ? textMatch[1].trim() : "";

            if (!essayText) {
                throw new Error("O texto da redação gerado está vazio.");
            }

            // 5. Verificação e Ajuste de Limite de Caracteres
            const totalLength = title.length + essayText.length;

            if (totalLength > MAX_CHARACTERS) {
                const excess = totalLength - MAX_CHARACTERS;
                // Corta o texto para garantir o limite, adicionando apenas reticências, sem mensagem de "encurtado"
                essayText = essayText.slice(0, essayText.length - excess) + "..."; 
                showNotification(`Aviso: Redação excedeu o limite e foi encurtada. Clique OK para fechar.`, 'warn');
                console.warn(`[AVISO] Redação excedeu o limite (${totalLength} chars). Encurtada para ${title.length + essayText.length} chars.`);
            }

            showNotification("Redação gerada. Inserindo nos campos... Clique OK para fechar.", 'info');

            // 6. Inserção nos Campos
            const finalTextareas = document.querySelectorAll("textarea");

            if (finalTextareas.length < 2) {
                showStatusCard("Erro: Campos de título/texto não encontrados. Clique OK para fechar.", 'error');
                return;
            }

            // Insere o Título (primeiro textarea)
            const titleContainer = finalTextareas[0].parentElement;
            await insertTextIntoTextarea(titleContainer, title);

            // Insere o Texto (último textarea) após um pequeno atraso
            setTimeout(async () => {
                const essayContainer = finalTextareas[finalTextareas.length - 1].parentElement;
                await insertTextIntoTextarea(essayContainer, essayText);

                setTimeout(() => {
                    showStatusCard("Redação inserida com sucesso! Não se esqueça de revisar. Clique OK para fechar.", 'success');
                    console.log(`[SUCESSO] Redação inserida! Tamanho total: ${title.length + essayText.length}/${MAX_CHARACTERS} caracteres.`);
                }, 1000);
            }, 1000);

        } catch (error) {
            console.error(`[ERRO FATAL] Ocorreu um erro durante o processamento: ${error.message}`);
        }
    }

    // Executa a função principal
    processEssay();
    console.log("Script de automação de redação carregado e em execução.");
})();
