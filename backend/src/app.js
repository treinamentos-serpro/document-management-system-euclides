// Seed do servidor backend do Document Management System.
//
// Este arquivo é apenas um ponto de partida mínimo. Ao longo do workshop você
// vai usar o Agent Mode do GitHub Copilot para construir as camadas:
//   - routes/       (definição das rotas)
//   - controllers/  (entrada HTTP e validação)
//   - services/     (regras de negócio)
//   - repositories/ (persistência: arquivos locais + metadados em memória)
//
// Restrição do projeto: uploads são gravados no filesystem local da aplicação
// usando multer com diskStorage. Não utilize provedores externos.

const express = require('express');
const path = require('path');

// Importa camadas de aplicação
const DocumentRepository = require('./repositories/DocumentRepository');
const StorageService = require('./services/StorageService');
const DocumentService = require('./services/DocumentService');
const createDocumentRoutes = require('./routes/documents');
const { storagePath } = require('./config/multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint de verificação de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Injeção de dependências
const repository = new DocumentRepository();
const storageService = new StorageService(storagePath);
const documentService = new DocumentService(repository, storageService);

// Monta rotas de documentos
app.use('/api', createDocumentRoutes(documentService));

// Middleware de erro global
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 400;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DMS backend ouvindo na porta ${PORT}`);
  });
}

module.exports = app;
