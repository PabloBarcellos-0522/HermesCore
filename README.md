# 📦 HermesCore

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
-   **Autenticação Segura**: Acesso à API protegido por uma chave (API Key) configurada em um arquivo `.env`.
-   **Sistema de Comandos Dinâmico**: Encaminha comandos personalizados do WhatsApp para sua API externa de forma configurável.
-   **Webhook Externo**: Notifica uma API externa configurável sempre que uma nova mensagem é recebida, permitindo comunicação bidirecional.
-   **Gerenciamento de Sessão**: Utiliza o `whatsapp-web.js` para manter a sessão ativa, com reconexão automática e armazenamento local da sessão.
-   **Estrutura Modular**: Código organizado para facilitar a manutenção e a adição de novas funcionalidades.
-   **Logs Detalhados**: Fornece feedback claro sobre o status da conexão e as operações realizadas.

## ⚙️ Como Começar

Siga os passos abaixo para configurar e executar o projeto.

### 1. Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   `npm` (geralmente instalado com o Node.js)

### 2. Instalação

Primeiro, clone o repositório para sua máquina local:

```bash
git clone https://github.com/seu-usuario/HermesCore.git
cd HermesCore
```

Em seguida, instale as dependências do projeto:

```bash
npm install
```

### 3. Configuração do Ambiente

O projeto utiliza um arquivo `.env` para gerenciar as variáveis de ambiente. Copie o arquivo de exemplo e preencha com suas informações:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e configure as seguintes variáveis:

-   `API_KEY`: Uma chave secreta para proteger o acesso à sua API.
-   `EXTERNAL_API_URL`: A URL base da sua API externa (ex: `http://minha-api.com/`).
-   `EXTERNAL_API_TOKEN`: (Opcional) Token de autenticação (`Bearer`) para sua API externa.
-   `EXTERNAL_API_COMMANDS`: Uma lista de comandos, separados por vírgula, que serão encaminhados para sua API externa (ex: `!notas,!faltas,!horario`).
-   `PORT`: A porta onde o servidor do HermesCore será executado (padrão: `3000`).

### 4. Executando o Servidor

Para iniciar o servidor em modo de desenvolvimento (com reinício automático ao salvar alterações), use:

```bash
npm run dev
```

Para iniciar em modo de produção:

```bash
npm start
```

Na primeira execução, um **QR Code** será exibido no terminal. Escaneie-o com o aplicativo do WhatsApp no seu celular (em "Aparelhos conectados") para autenticar a sessão.

## 🔐 Autenticação

Todas as requisições para a API do HermesCore devem incluir a `API_KEY` no cabeçalho `x-api-key` para serem autorizadas.

## 📡 Endpoints da API

### Enviar Mensagem de Texto

-   **Endpoint**: `POST /send/text`
-   **Body**: `{ "number": "...", "message": "..." }`

### Enviar Mídia (Imagem ou Documento)

-   **Endpoint**: `POST /send/media`
-   **Descrição**: Envia um arquivo (imagem, documento, etc.) a partir de uma string Base64.
-   **Body**: `{ "number": "...", "fileData": "...", "mimetype": "...", "filename": "...", "caption": "..." }`

## 🤖 Sistema de Comandos e Webhook Externo

### Webhook de Mensagens Recebidas

Para _toda_ mensagem recebida no WhatsApp, HermesCore enviará automaticamente um `POST` para a `EXTERNAL_API_URL` configurada no `.env` (se estiver definida). Sua API externa pode usar isso para logs, análises ou qualquer outra lógica que precise de todas as mensagens.

### Sistema de Comandos Dinâmico

Este é o recurso principal para criar um bot. Você define quais comandos devem ser processados na sua variável `EXTERNAL_API_COMMANDS` no `.env`.

**Como Funciona:**

1.  **Configuração**: No `.env`, você define `EXTERNAL_API_COMMANDS=!notas,!horario`.
2.  **Usuário Envia**: Um usuário envia a mensagem `!notas 12345` para o WhatsApp.
3.  **HermesCore Mapeia**: HermesCore detecta o comando `!notas` e vê que ele está na lista de comandos externos. Ele então mapeia o comando para uma requisição HTTP.
    -   Comando: `!notas`
    -   Argumentos: `12345`
    -   Requisição Gerada: `GET {EXTERNAL_API_URL}/notas?args=12345`
4.  **Sua API Externa Responde**: Sua API, na rota `/notas`, recebe a requisição, processa os argumentos e retorna um JSON com a resposta que deve ser enviada de volta ao usuário. O formato esperado é:
    ```json
    {
        "data": "Suas notas são: \nMatemática: 10\nHistória: 8"
    }
    ```
5.  **HermesCore Responde**: HermesCore pega o conteúdo da propriedade `data` e o envia como resposta no WhatsApp para o usuário original.

**Comandos Internos:**

-   `!ajuda`: Retorna uma lista de todos os comandos disponíveis, combinando os comandos internos e os configurados em `EXTERNAL_API_COMMANDS`.

Este sistema permite que toda a lógica do bot resida na sua API externa, mantendo o HermesCore apenas como um gateway de comunicação.

## 🏗️ Arquitetura do Projeto

A estrutura de pastas foi projetada para separar responsabilidades e garantir um código limpo e organizado.

```
HermesCore/
│
├── src/
│   ├── api/              # Define os endpoints da API REST (rotas e controllers)
│   ├── whatsapp/         # Gerencia a conexão com o WhatsApp (cliente, eventos e reconexão)
│   ├── services/         # Contém a lógica de negócio, como o envio de webhooks
│   ├── config/           # Carregamento e validação das variáveis de ambiente
│   └── utils/            # Funções auxiliares (logs, formatadores, etc.)
│
├── .env.example          # Arquivo de exemplo para as variáveis de ambiente
├── package.json          # Dependências e scripts do projeto
└── README.md             # Documentação do projeto
```

## 🧱 Roadmap

-   [ ] Dashboard com status da sessão do WhatsApp.
-   [ ] Suporte para múltiplas instâncias (vários números).
-   [ ] Implementação de _rate limiter_ para os endpoints.
-   [ ] Migração do projeto para TypeScript.
-   [ ] Fila de envio de mensagens com sistema de _retry_.

## 🤝 Contribuindo

Pull Requests são bem-vindos! Se você tiver ideias para melhorar o projeto, sinta-se à vontade para criar uma _issue_ ou enviar um PR.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
