# ⚡ HermesCore

<div align="center">
  <img src="resouces/HERMES-MENSAGEIRO.jpg" alt="Hermer, o mensageiro dos Deuses" width="400">
</div>
<br>

HermesCore é um gateway de API para WhatsApp, projetado para ser simples, seguro e altamente extensível. Ele permite que sistemas externos enviem mensagens (texto, imagem e documentos) e recebam notificações de mensagens recebidas, facilitando a automação e a criação de bots com lógicas de negócio personalizadas.

O projeto é ideal para centralizar a comunicação via WhatsApp, integrando-a com outras APIs para criar fluxos de trabalho complexos, como consultas a sistemas internos através de comandos.

## 🛠️ Tecnologias Utilizadas

-   **Node.js**: Ambiente de execução JavaScript.
-   **Fastify**: Framework para a criação da API REST.
-   **whatsapp-web.js**: Biblioteca para interagir com o WhatsApp Web.
-   **Axios**: Cliente HTTP para enviar webhooks para a API externa.
-   **Dotenv**: Para carregar variáveis de ambiente a partir de um arquivo `.env`.
-   **Nodemon**: Para reiniciar o servidor automaticamente durante o desenvolvimento.

## 🚀 Principais Recursos

-   **Envio de Mensagens**: Suporte para texto, imagens e documentos através de uma API REST.
-   **Autenticação Segura**: Acesso à API protegido por chaves distintas para diferentes funções (API principal vs. Webhooks).
-   **Sistema de Comandos Dinâmico**: Encaminha comandos personalizados do WhatsApp para sua API externa de forma configurável.
-   **Webhook de Saída**: Notifica uma API externa configurável sempre que uma nova mensagem é recebida no WhatsApp.
-   **Webhook de Entrada**: Permite que sistemas externos notifiquem o HermesCore sobre eventos (ex: "novo cliente"), fazendo com que ele envie mensagens pré-definidas.
-   **Gerenciamento de Sessão Inteligente**: Utiliza o `whatsapp-web.js` para manter a sessão ativa. Em caso de desconexão (ex: por uma queda de rede), o cliente tentará se reconectar automaticamente para manter a aplicação online.

## ⚙️ Como Começar

### 1. Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   `npm` (geralmente instalado com o Node.js)

### 2. Instalação

```bash
git clone https://github.com/seu-usuario/HermesCore.git
cd HermesCore
npm install
```

### 3. Configuração do Ambiente

Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

-   `API_KEY`: Chave secreta para proteger os endpoints de envio direto (`/send/*`).
-   `WEBHOOK_TOKEN`: Chave secreta para proteger os endpoints de eventos (`/webhooks/events/*`).
-   `EXTERNAL_API_URL`: URL base da sua API externa para o sistema de comandos (`!comando`).
-   `EXTERNAL_API_TOKEN`: (Opcional) Token de autenticação para a sua API externa.
-   `EXTERNAL_API_COMMANDS`: Comandos que serão encaminhados para sua API externa (ex: `!notas,!faltas`).
-   `PORT`: Porta onde o servidor será executado (padrão: `3000`).

### 4. Executando em Modo de Desenvolvimento

```bash
npm run dev
```

Na primeira execução, um **QR Code** será exibido no terminal. Escaneie-o com o WhatsApp para conectar.

### 5. Deploy em Produção com PM2

Para executar a aplicação em um ambiente de produção de forma estável, é recomendado o uso do PM2, um gerenciador de processos para Node.js.

**a. Instale o PM2 globalmente:**

```bash
npm install pm2 -g
```

**b. Inicie a aplicação:**
Este comando irá iniciar o HermesCore em modo de produção, utilizando o arquivo de configuração `scripts/pm2.config.js`.

```bash
npm run pm2:start
```

**c. Monitore a aplicação:**
Você pode ver o status, uso de CPU, memória e logs com os seguintes comandos:

```bash
pm2 list
pm2 monit
pm2 logs HermesCore
```

**d. Pare a aplicação:**
Este comando irá parar e remover a aplicação da lista do PM2.

```bash
npm run pm2:stop
```

## 📡 Endpoints da API

A API é dividida por função e modelo de segurança.

### Endpoints de Envio Direto

Estes endpoints dão controle direto sobre o envio. Requerem a `API_KEY` no cabeçalho `x-api-key`.

-   **`POST /send/text`**
    -   **Body**: `{ "number": "...", "message": "..." }`
-   **`POST /send/media`**
    -   **Body**: `{ "number": "...", "fileData": "...", "mimetype": "...", "filename": "..." }`

### Endpoint de Webhook de Eventos

Este endpoint permite que sistemas externos notifiquem HermesCore sobre eventos. Requer o `WEBHOOK_TOKEN` no cabeçalho `x-webhook-token`. A lógica da mensagem é definida no HermesCore.

-   **`POST /webhooks/events/new-customer`**
    -   **Descrição**: Dispara uma mensagem de boas-vindas para um novo cliente.
    -   **Body**: `{ "name": "Nome do Cliente", "number": "5511..." }`
    -   **Ação do HermesCore**: Envia a mensagem "Olá Nome do Cliente, bem-vindo(a) ao HermesCore! Agradecemos por se juntar a nós." para o número fornecido.

## 🤖 Sistema de Comandos e Webhook de Saída

### Webhook de Saída (Mensagens Recebidas)

Para _toda_ mensagem recebida no WhatsApp, HermesCore enviará um `POST` para a `EXTERNAL_API_URL` configurada no `.env`. Sua API externa pode usar isso para logs, análises ou qualquer outra lógica.

### Sistema de Comandos Dinâmico

Você pode definir comandos personalizados no `.env` que serão processados pela sua API externa.

-   **Configuração**: `.env` -> `EXTERNAL_API_COMMANDS=!notas,!horario`
-   **Usuário Envia**: `!notas 12345`
-   **HermesCore Mapeia**: Detecta o comando e faz a requisição `GET {EXTERNAL_API_URL}/notas?args=12345`
-   **Sua API Responde**: Sua API na rota `/notas` processa a requisição e retorna um JSON `{ "data": "Sua nota é 10." }`.
-   **HermesCore Responde ao Usuário**: "Sua nota é 10."

Este sistema permite que toda a lógica do bot resida na sua API externa, mantendo o HermesCore apenas como um gateway de comunicação.

## 🏗️ Arquitetura do Projeto

... (O restante do arquivo permanece o mesmo) ...
