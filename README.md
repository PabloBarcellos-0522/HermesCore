# 📦 HermesCore

HermesCore é um gateway de API para WhatsApp, projetado para ser simples, seguro e altamente extensível. Ele permite que sistemas externos enviem mensagens (texto, imagem e documentos) e recebam notificações de mensagens recebidas, facilitando a automação e a criação de bots com lógicas de negócio personalizadas.

O projeto é ideal para centralizar a comunicação via WhatsApp, integrando-a com outras APIs para criar fluxos de trabalho complexos, como consultas a sistemas internos através de comandos.

## 🚀 Principais Recursos

- **Envio de Mensagens**: Suporte para texto, imagens e documentos através de uma API REST.
- **Autenticação Segura**: Acesso à API protegido por uma chave (API Key) configurada em um arquivo `.env`.
- **Sistema de Comandos**: Capacidade de identificar comandos (ex: `!notas`) em mensagens recebidas e encaminhá-los para uma API externa.
- **Webhook Externo**: Notifica uma API externa configurável sempre que uma nova mensagem é recebida, permitindo comunicação bidirecional.
- **Gerenciamento de Sessão**: Utiliza o `whatsapp-web.js` para manter a sessão ativa, com reconexão automática e armazenamento local da sessão.
- **Estrutura Modular**: Código organizado para facilitar a manutenção e a adição de novas funcionalidades.
- **Logs Detalhados**: Fornece feedback claro sobre o status da conexão e as operações realizadas.

## ⚙️ Como Começar

Siga os passos abaixo para configurar e executar o projeto.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` (geralmente instalado com o Node.js)

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

Abra o arquivo `.env` e configure as seguintes variáveis (substitua `SUA_CHAVE_AQUI` por um valor seguro para `API_KEY`):

- `API_KEY`: Uma chave secreta para proteger o acesso à sua API.
- `EXTERNAL_API_URL`: O endpoint da sua API externa que receberá as notificações de novas mensagens (webhooks).
- `PORT`: A porta onde o servidor do HermesCore será executado (padrão: `3000`).

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

**Exemplo de Header:**

```
x-api-key: SUA_CHAVE_SECRETA_CONFIGURADA_NO_.ENV
```

Requisições sem a chave ou com uma chave inválida receberão um erro `401 Unauthorized`.

**Como Testar:**
Para testar a autenticação, inicie o servidor (`npm run dev`) e tente acessar a rota de *health check* (`/`) usando uma ferramenta como `curl` ou Postman.

- **Com API Key correta:**
  ```bash
  curl -H "x-api-key: SUA_CHAVE_AQUI" http://localhost:3000/
  ```
  (Substitua `SUA_CHAVE_AQUI` pela chave configurada no seu `.env`)

- **Sem API Key (ou com chave incorreta):**
  ```bash
  curl http://localhost:3000/
  ```
  Isso deve retornar um erro `401 Unauthorized`.

## 📡 Endpoints da API

### Enviar Mensagem de Texto

- **Endpoint**: `POST /send/text`
- **Descrição**: Envia uma mensagem de texto para um número de telefone.

**Body (JSON):**

```json
{
  "number": "5511999999999",
  "message": "Olá! Esta é uma mensagem enviada via HermesCore."
}
```

### Enviar Mídia (Imagem ou Documento)

- **Endpoint**: `POST /send/media`
- **Descrição**: Envia uma imagem ou documento a partir de uma URL.

**Body (JSON):**

```json
{
  "number": "5511999999999",
  "fileUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "caption": "Segue o documento solicitado."
}
```

## 🤖 Sistema de Comandos e Webhook Externo

Uma das principais funcionalidades do HermesCore é a capacidade de interagir com APIs externas. O fluxo funciona da seguinte maneira:

1.  Um usuário envia uma mensagem para o número de WhatsApp conectado (ex: `!notas`).
2.  HermesCore recebe a mensagem e, se uma `EXTERNAL_API_URL` estiver configurada no `.env`, ele dispara uma requisição `POST` para essa URL.
3.  O corpo da requisição enviada ao webhook contém os detalhes da mensagem recebida, como o número de origem (`from`) e o texto (`body`).
4.  Sua API externa pode então processar essa informação. Se for um comando como `!notas`, sua API pode buscar os dados correspondentes e retornar uma resposta.
5.  Para responder ao usuário, sua API externa simplesmente faz uma chamada de volta para um dos endpoints do HermesCore (ex: `/send/text`), que encaminhará a resposta para o usuário original.

## 🏗️ Arquitetura do Projeto

A estrutura de pastas foi projetada para separar responsabilidades e garantir um código limpo e organizado.

```
HermesCore/
│
├── src/
│   ├── api/              # Define os endpoints da API REST (rotas e controllers)
│   ├── whatsapp/         # Gerencia a conexão com o WhatsApp (cliente, eventos e reconexão)
│   ├── services/         # Contém a lógica de negócio, como o envio de webhooks
│   ├── commands/         # (Opcional) Lógica para manipulação de comandos específicos
│   ├── config/           # Carregamento e validação das variáveis de ambiente
│   └── utils/            # Funções auxiliares (logs, formatadores, etc.)
│
├── .env.example          # Arquivo de exemplo para as variáveis de ambiente
├── package.json          # Dependências e scripts do projeto
└── README.md             # Documentação do projeto
```

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Fastify**: Framework para a criação da API REST.
- **whatsapp-web.js**: Biblioteca para interagir com o WhatsApp Web.
- **Axios**: Cliente HTTP para enviar webhooks para a API externa.
- **Dotenv**: Para carregar variáveis de ambiente a partir de um arquivo `.env`.
- **Nodemon**: Para reiniciar o servidor automaticamente durante o desenvolvimento.

## 🧱 Roadmap

- [ ] Dashboard com status da sessão do WhatsApp.
- [ ] Suporte para múltiplas instâncias (vários números).
- [ ] Implementação de *rate limiter* para os endpoints.
- [ ] Migração do projeto para TypeScript.
- [ ] Fila de envio de mensagens com sistema de *retry*.

## 🤝 Contribuindo

Pull Requests são bem-vindos! Se você tiver ideias para melhorar o projeto, sinta-se à vontade para criar uma *issue* ou enviar um PR.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
