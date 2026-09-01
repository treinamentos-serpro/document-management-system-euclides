# Especificação - Document Management System

## 1. Objetivo

Disponibilizar uma aplicação web para que usuários enviem, consultem e baixem seus próprios documentos, com arquivos armazenados localmente e metadados mantidos em memória.

## 2. Escopo

### Dentro do escopo

- Upload de um documento por requisição HTTP.
- Listagem dos documentos pertencentes ao usuário solicitante.
- Download de um documento pelo identificador, quando ele pertencer ao usuário solicitante.
- Identificação simples do dono pelo cabeçalho obrigatório `X-User-Id`.
- Armazenamento físico de arquivos em `backend/storage` por meio de `multer.diskStorage`.
- Armazenamento em memória dos metadados dos documentos durante a execução do processo.
- Interface React para enviar, listar e baixar documentos.

### Fora do escopo

- Autenticação, autorização robusta ou gestão de contas de usuário.
- Banco de dados, cache persistente ou recuperação de metadados após reinicialização.
- Armazenamento externo, em nuvem ou serviços de terceiros.
- Edição, exclusão, versionamento, compartilhamento ou pré-visualização de documentos.
- Busca, filtros, ordenação configurável ou paginação.
- Upload de múltiplos arquivos na mesma requisição.

## 3. Requisitos funcionais

| ID    | Requisito |
| ----- | ---------- |
| RF-01 | O sistema deve aceitar o envio de um arquivo no campo multipart `file` para um usuário identificado por `X-User-Id`. |
| RF-02 | O sistema deve rejeitar uploads sem arquivo ou sem um valor válido para `X-User-Id`. |
| RF-03 | Ao receber um upload válido, o sistema deve gerar um identificador único, salvar o arquivo localmente e registrar seus metadados em memória. |
| RF-04 | O sistema deve listar somente os metadados dos documentos cujo `ownerId` corresponda ao `X-User-Id` da requisição. |
| RF-05 | O sistema deve disponibilizar o download de um documento pelo identificador apenas ao respectivo dono. |
| RF-06 | O sistema deve responder com `404` quando o documento não existir ou não pertencer ao usuário solicitante. |
| RF-07 | O sistema deve devolver erros de validação e erros internos em formato JSON consistente. |

## 4. Requisitos não funcionais

| ID     | Requisito |
| ------ | ---------- |
| RNF-01 | O backend deve usar Node.js, Express e módulos CommonJS. |
| RNF-02 | Os arquivos devem ser gravados exclusivamente no filesystem local em `backend/storage`, por `multer.diskStorage`. |
| RNF-03 | Metadados devem existir somente em memória nesta fase e não devem usar banco de dados ou provedor externo. |
| RNF-04 | Porta, diretório de armazenamento, limite de tamanho e tipos MIME permitidos devem ser configuráveis por variáveis de ambiente. |
| RNF-05 | Falhas de entrada HTTP e de leitura ou escrita no filesystem devem ser tratadas nos limites do sistema, sem expor detalhes internos ao cliente. |
| RNF-06 | O backend deve ser testável com o runner nativo `node:test`; os testes devem cobrir os fluxos de upload, listagem, download e erros relevantes. |
| RNF-07 | O frontend deve usar React, componentes funcionais e `fetch` por meio do prefixo `/api` configurado no proxy do Vite. |

## 5. Modelo de dados (metadados do documento)

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| id | string | Identificador UUID único do documento. |
| originalName | string | Nome original informado pelo arquivo enviado. |
| storedName | string | Nome único do arquivo gravado em `backend/storage`; não deve expor o caminho absoluto. |
| mimeType | string | Tipo MIME recebido para o arquivo. |
| size | number | Tamanho do arquivo em bytes. |
| uploadedAt | string | Data e hora do upload no formato ISO 8601. |
| ownerId | string | Identificador do dono, recebido no cabeçalho `X-User-Id`. |

O arquivo binário é persistido localmente. A coleção de metadados é volátil: ao reiniciar o processo do backend, documentos já presentes no diretório de armazenamento não serão listados nem baixados até que uma estratégia de persistência seja introduzida.

## 6. Contratos de API

O frontend chama as rotas com o prefixo `/api`. Durante o desenvolvimento, o proxy do Vite remove esse prefixo antes de encaminhar a requisição ao backend; portanto, o backend registra `/upload`, `/documents` e `/documents/:id/download`.

### Convenções gerais

- Cabeçalho de dono: `X-User-Id` é obrigatório e deve conter uma string não vazia.
- Erros JSON seguem o formato:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Mensagem em português para o cliente."
  }
}
```

- O valor de `ownerId` não é exposto nem aceito no corpo da requisição; ele é obtido exclusivamente do cabeçalho.

### POST /api/upload

Envia um documento.

**Entrada**

- Cabeçalho: `X-User-Id: usuario-123`
- `Content-Type: multipart/form-data`
- Campo obrigatório: `file`, com um único arquivo.

**Resposta de sucesso: `201 Created`**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "contrato.pdf",
  "storedName": "550e8400-e29b-41d4-a716-446655440000.pdf",
  "mimeType": "application/pdf",
  "size": 24576,
  "uploadedAt": "2026-09-01T10:00:00.000Z",
  "ownerId": "usuario-123"
}
```

**Erros**

- `400 Bad Request`: cabeçalho ausente, campo de arquivo ausente, tipo não permitido ou tamanho excedido.
- `500 Internal Server Error`: falha não recuperável ao salvar o arquivo ou registrar metadados.

### GET /api/documents

Lista os metadados dos documentos do usuário solicitante.

**Entrada**

- Cabeçalho: `X-User-Id: usuario-123`

**Resposta de sucesso: `200 OK`**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "originalName": "contrato.pdf",
    "storedName": "550e8400-e29b-41d4-a716-446655440000.pdf",
    "mimeType": "application/pdf",
    "size": 24576,
    "uploadedAt": "2026-09-01T10:00:00.000Z",
    "ownerId": "usuario-123"
  }
]
```

**Erros**

- `400 Bad Request`: cabeçalho `X-User-Id` ausente ou vazio.
- `500 Internal Server Error`: falha inesperada durante a consulta.

### GET /api/documents/:id/download

Baixa o arquivo associado a um documento do usuário solicitante.

**Entrada**

- Cabeçalho: `X-User-Id: usuario-123`
- Parâmetro de rota: `id`, UUID do documento.

**Resposta de sucesso: `200 OK`**

- Corpo binário do arquivo.
- `Content-Type` igual ao `mimeType` registrado.
- `Content-Disposition: attachment` com o nome original do arquivo.

**Erros**

- `400 Bad Request`: cabeçalho `X-User-Id` ausente ou vazio.
- `404 Not Found`: documento inexistente, pertencente a outro usuário ou arquivo ausente no filesystem.
- `500 Internal Server Error`: falha inesperada na leitura do arquivo.

## 7. Decisões arquiteturais

- O backend adota Clean Architecture simples, com dependência unidirecional `routes -> controllers -> services -> repositories`.
- As rotas registram endpoints e o middleware do Multer. Controllers tratam requisição e resposta HTTP. Services aplicam regras de negócio e visibilidade por dono. Repositories mantêm os metadados em memória.
- O Multer fica no limite HTTP e usa `diskStorage` para gravar diretamente em `backend/storage`. Nenhuma camada interna depende de Express ou do objeto de requisição.
- Um UUID é usado tanto para o ID público quanto para compor o nome físico do arquivo, evitando colisões e impedindo que o nome original controle o caminho de armazenamento.
- O frontend é organizado em `components/`, `pages/` e `services/`; o serviço de API concentra chamadas `fetch` para `/api`.
- `X-User-Id` é uma identificação transitória de fase inicial. Ele viabiliza segregação funcional por dono, mas não substitui autenticação e autorização reais.

## 8. Plano de execução

1. Criar a configuração de armazenamento local e middleware Multer com diretório, limite e tipos permitidos configuráveis por ambiente.
2. Implementar o repositório de documentos em memória e a geração de IDs únicos.
3. Implementar o serviço com regras de criação, listagem por dono e recuperação de documento para download.
4. Implementar controllers para validar `X-User-Id`, converter erros em respostas HTTP e enviar o arquivo para download.
5. Registrar as rotas `/upload`, `/documents` e `/documents/:id/download` no app Express.
6. Criar testes de integração com `node:test` para sucesso e erros de upload, isolamento de listagem e autorização de download.
7. Implementar o serviço `fetch`, componentes de upload e lista de documentos no frontend React.
8. Integrar frontend e backend pelo proxy `/api` e validar manualmente os fluxos principais.
9. Em uma fase posterior, substituir `X-User-Id` por autenticação e migrar os metadados para persistência durável.