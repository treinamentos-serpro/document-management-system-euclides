const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const StorageService = require('../../src/services/StorageService');

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

test('StorageService - constructor requires storagePath', () => {
  assert.throws(
    () => new StorageService(null),
    /Storage path is required/
  );
});

test('StorageService - getFilePath with valid id', () => {
  const service = new StorageService('/tmp/storage');
  const filePath = service.getFilePath(VALID_UUID);

  assert.ok(filePath.includes(VALID_UUID));
  assert.ok(filePath.includes('/tmp/storage'));
});

test('StorageService - getFilePath throws on missing id', () => {
  const service = new StorageService('/tmp/storage');

  assert.throws(
    () => service.getFilePath(null),
    /Document ID is required/
  );
});

test('StorageService - getFilePath prevents directory traversal', () => {
  const service = new StorageService('/tmp/storage');

  // Path traversal attempts are rejected by UUID validation
  assert.throws(
    () => service.getFilePath('../../../etc/passwd'),
    /Invalid document ID format/
  );
});

test('StorageService - getFilePath rejects invalid UUID format', () => {
  const service = new StorageService('/tmp/storage');

  assert.throws(
    () => service.getFilePath('not-a-uuid'),
    /Invalid document ID format/
  );
});

test('StorageService - saveFile requires multerFile', async () => {
  const service = new StorageService('/tmp/storage');

  try {
    await service.saveFile(null);
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('Multer file object'));
  }
});

test('StorageService - saveFile requires file path', async () => {
  const service = new StorageService('/tmp/storage');

  try {
    await service.saveFile({ originalname: 'test.pdf', size: 1024 });
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('path is missing'));
  }
});

test('StorageService - deleteFile requires id', async () => {
  const service = new StorageService('/tmp/storage');

  try {
    await service.deleteFile(null);
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('Document ID is required'));
  }
});

test('StorageService - readFile requires id', async () => {
  const service = new StorageService('/tmp/storage');

  try {
    await service.readFile(null);
    assert.fail('Should have thrown error');
  } catch (error) {
    assert.ok(error.message.includes('Document ID is required'));
  }
});

