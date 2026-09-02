// Configuração do multer para upload de arquivos
// Responsabilidade única: setup do middleware de upload

const multer = require('multer');
const path = require('path');

const storagePath = process.env.STORAGE_PATH || path.join(__dirname, '../../storage');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath);
  },
  filename: (req, file, cb) => {
    // Salva com UUID (gerado posteriormente pelo DocumentService)
    // Multer usa timestamp por padrão, Document.js gerará ID único
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Aceita qualquer tipo de arquivo por enquanto
  cb(null, true);
};

const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = {
  upload,
  storagePath,
};
