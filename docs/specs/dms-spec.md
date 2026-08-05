# Especificação do Document Management System

## 1. Objetivo

Entregar um sistema simples de gestão de documentos que permita enviar, listar e baixar arquivos, com armazenamento local no servidor e metadados mantidos em memória.

## 2. Escopo

### Dentro do escopo

- Upload de documentos via formulário.
- Listagem de documentos cadastrados.
- Download de documentos por identificador.
- Armazenamento local dos arquivos no filesystem do backend.
- Metadados de documentos mantidos em memória.
- Backend organizado com Clean Architecture simples em camadas: routes, controllers, services, repositories.

### Fora do escopo

- Armazenamento em nuvem ou provedores externos.
- Versionamento de documentos.
- Autenticação e autorização complexas.
- Edição ou exclusão de documentos.
- Pesquisa avançada ou filtros sofisticados.

## 3. Requisitos funcionais

| ID    | Requisito                                                                 |
| ----- | -------------------------------------------------------------------------- |
| RF-01 | O usuário pode enviar um documento via `POST /upload`.                     |
| RF-02 | O usuário pode listar todos os documentos via `GET /documents`.            |
| RF-03 | O usuário pode baixar um documento específico via `GET /documents/:id/download`. |
| RF-04 | O sistema deve validar que o upload contém um arquivo antes de salvar.     |
| RF-05 | O sistema deve retornar erros claros quando o documento não for encontrado. |

## 4. Requisitos não funcionais

| ID     | Requisito                                                                 |
| ------ | -------------------------------------------------------------------------- |
| RNF-01 | Arquivos gravados no filesystem local da aplicação.                        |
| RNF-02 | Uso de `multer` com `diskStorage` para persistir os uploads.               |
| RNF-03 | Metadados mantidos em memória nesta fase inicial.                          |
| RNF-04 | Estrutura de backend organizada em camadas: routes, controllers, services, repositories. |
| RNF-05 | Configuração do servidor via variáveis de ambiente (`PORT`, `STORAGE_DIR`). |
| RNF-06 | API REST simples com respostas JSON para metadados e códigos HTTP apropriados. |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição                                   |
| ------------ | ------ | ------------------------------------------- |
| id           | string | Identificador único do documento            |
| originalName | string | Nome original do arquivo enviado            |
| storageName  | string | Nome do arquivo gravado no disco local      |
| size         | number | Tamanho em bytes                             |
| mimeType     | string | Tipo MIME do arquivo                         |
| uploadedAt   | string | Data/hora do upload no formato ISO 8601      |
| owner        | string | Identificador do usuário dono (simplificado) |

> Nota: `storageName` é um campo interno usado pelo repositório para localizar o arquivo no `backend/storage`.

## 6. Contratos de API

### POST /upload

- Entrada:
  - `multipart/form-data`
  - campo `file` contendo o arquivo a ser enviado
- Processamento:
  - valida arquivo presente
  - salva arquivo em `backend/storage` com `multer.diskStorage`
  - gera `id` único e metadados
  - persiste metadados em memória
- Saída:
  - `201 Created`
  - corpo JSON com metadados do documento
- Exemplo de resposta:
  ```json
  {
    "id": "df7c9e30-1a8b-4d40-9d1f-2c9b5f6b2abc",
    "originalName": "contrato.pdf",
    "storageName": "file-1680000000000-123456789.pdf",
    "size": 234567,
    "mimeType": "application/pdf",
    "uploadedAt": "2026-08-05T12:34:56.789Z",
    "owner": "anonymous"
  }
  ```

### GET /documents

- Entrada: nenhuma
- Processamento:
  - retorna a lista de metadados de todos os documentos em memória
- Saída:
  - `200 OK`
  - corpo JSON com array de metadados
- Exemplo de resposta:
  ```json
  [
    {
      "id": "df7c9e30-1a8b-4d40-9d1f-2c9b5f6b2abc",
      "originalName": "contrato.pdf",
      "storageName": "file-1680000000000-123456789.pdf",
      "size": 234567,
      "mimeType": "application/pdf",
      "uploadedAt": "2026-08-05T12:34:56.789Z",
      "owner": "anonymous"
    }
  ]
  ```

### GET /documents/:id/download

- Entrada:
  - parâmetro de rota `id`
- Processamento:
  - busca metadados em memória
  - localiza arquivo no disco usando `storageName`
  - envia o arquivo como download
- Saída:
  - `200 OK` com conteúdo binário
  - cabeçalho `Content-Disposition: attachment; filename="originalName"`
- Erros:
  - `404 Not Found` se o documento ou o arquivo não existir

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples:
  - `routes/` para definição de endpoints
  - `controllers/` para controle HTTP e validação básica
  - `services/` para regras de negócio e fluxo de upload/download
  - `repositories/` para persistência local de arquivos e metadados em memória
- `multer` com `diskStorage` para uploads locais no diretório `backend/storage`.
- Metadados mantidos em memória por simplicidade e por restrição do exercício.
- Configuração via variáveis de ambiente para porta e diretório de storage.
- A API deve ser consumível por um frontend React usando prefixo `/api` ou diretamente no backend.

## 8. Plano de execução

1. Preparar a estrutura backend:
   - criar diretórios `backend/src/routes`, `backend/src/controllers`, `backend/src/services`, `backend/src/repositories`.
   - garantir a existência de `backend/storage` como destino de uploads.
2. Implementar o repositório de documentos:
   - criar `DocumentRepository` com armazenamento em memória para metadados.
   - expor métodos `saveMetadata`, `list`, `findById`, `getStoragePath`.
3. Implementar a camada de serviço:
   - criar `DocumentService` com métodos `createDocument`, `listDocuments`, `getDocumentById`, `getDocumentPath`.
   - gerar `id` único e encapsular regras de negócio.
4. Implementar controladores HTTP:
   - criar `DocumentController` para `POST /upload`, `GET /documents`, `GET /documents/:id/download`.
   - tratar validação básica e respostas de erro.
5. Implementar rotas:
   - criar `documentRoutes` e conectar controladores aos endpoints.
   - aplicar middleware `multer` no endpoint de upload.
6. Integrar no `backend/src/app.js`:
   - carregar as rotas principais.
   - manter endpoint `/health`.
   - usar `express.json()` e criar o diretório de storage se necessário.
7. Testar fluxos principais:
   - verificar upload de documento.
   - verificar listagem de documentos.
   - verificar download por id.
   - verificar retorno de erro para id inexistente.
8. Validar requisitos não funcionais:
   - confirmar uploads gravados em `backend/storage`.
   - confirmar metadados não persistidos em banco externo.
   - confirmar variáveis de ambiente controlando porta/diretório.

## 9. Critérios de aceite

- `POST /upload` salva arquivo no disco local e retorna metadados JSON.
- `GET /documents` retorna lista completa de documentos cadastrados.
- `GET /documents/:id/download` transfere o arquivo correto com cabeçalho de download.
- Arquivos aparecem em `backend/storage` após upload.
- Metadados são mantidos em memória sem uso de banco de dados externo.
- O backend respeita a separação `routes -> controllers -> services -> repositories`.
