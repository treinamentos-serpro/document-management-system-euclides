const { test } = require('node:test');
const assert = require('node:assert');
const DocumentService = require('../../src/services/DocumentService');
const DocumentRepository = require('../../src/repositories/DocumentRepository');
const Document = require('../../src/domain/Document');

// Mock StorageService
class MockStorageService {
  async saveFile(multerFile) {
    if (!multerFile || !multerFile.path) {
      throw new Error('Invalid multer file');
    }
    return multerFile.path;
  }

  async readFile(documentId) {
    // Return mock stream
    const { Readable } = require('stream');
    return Readable.from(['mock file content']);
  }

  async deleteFile(documentId) {
    // No-op for mock
  }
}

test('DocumentService - uploadDocument with valid file and owner', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  const multerFile = {
    originalname: 'test.pdf',
    size: 1024,
    path: '/tmp/test.pdf',
  };

  const document = await service.uploadDocument(multerFile, 'user123');

  assert.strictEqual(document.originalName, 'test.pdf');
  assert.strictEqual(document.size, 1024);
  assert.strictEqual(document.owner, 'user123');
  assert.ok(document.id);
  assert.ok(document.uploadedAt);

  // Verify document is in repository
  const found = repository.findById(document.id);
  assert.ok(found);
});

test('DocumentService - uploadDocument throws on invalid file', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  try {
    await service.uploadDocument(null, 'user123');
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('File is required'));
  }
});

test('DocumentService - uploadDocument throws on invalid owner', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  const multerFile = {
    originalname: 'test.pdf',
    size: 1024,
    path: '/tmp/test.pdf',
  };

  try {
    await service.uploadDocument(multerFile, null);
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('Owner must be'));
  }
});

test('DocumentService - listDocuments returns user documents', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  const multerFile = {
    originalname: 'test.pdf',
    size: 1024,
    path: '/tmp/test.pdf',
  };

  await service.uploadDocument(multerFile, 'user123');
  await service.uploadDocument(multerFile, 'user123');
  await service.uploadDocument(multerFile, 'user456');

  const user123Docs = service.listDocuments('user123');
  assert.strictEqual(user123Docs.length, 2);

  const user456Docs = service.listDocuments('user456');
  assert.strictEqual(user456Docs.length, 1);
});

test('DocumentService - listDocuments throws on missing owner', () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  assert.throws(
    () => service.listDocuments(null),
    /Owner must be/
  );
});

test('DocumentService - downloadDocument returns stream and metadata', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  const multerFile = {
    originalname: 'test.pdf',
    size: 1024,
    path: '/tmp/test.pdf',
  };

  const uploaded = await service.uploadDocument(multerFile, 'user123');
  const result = await service.downloadDocument(uploaded.id, 'user123');

  assert.ok(result.stream);
  assert.ok(result.document);
  assert.strictEqual(result.document.id, uploaded.id);
});

test('DocumentService - downloadDocument throws on invalid id', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  try {
    await service.downloadDocument('invalid-id', 'user123');
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('Invalid document ID'));
  }
});

test('DocumentService - downloadDocument throws on document not found', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  const validUUID = '550e8400-e29b-41d4-a716-446655440000';

  try {
    await service.downloadDocument(validUUID, 'user123');
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('not found'));
  }
});

test('DocumentService - downloadDocument throws on unauthorized access', async () => {
  const repository = new DocumentRepository();
  const storage = new MockStorageService();
  const service = new DocumentService(repository, storage);

  const multerFile = {
    originalname: 'test.pdf',
    size: 1024,
    path: '/tmp/test.pdf',
  };

  const uploaded = await service.uploadDocument(multerFile, 'user123');

  try {
    await service.downloadDocument(uploaded.id, 'user456');
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('Unauthorized'));
  }
});

test('DocumentService - constructor requires repository', () => {
  const storage = new MockStorageService();

  assert.throws(
    () => new DocumentService(null, storage),
    /Repository is required/
  );
});

test('DocumentService - constructor requires storageService', () => {
  const repository = new DocumentRepository();

  assert.throws(
    () => new DocumentService(repository, null),
    /StorageService is required/
  );
});
