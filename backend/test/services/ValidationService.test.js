const { test } = require('node:test');
const assert = require('node:assert');
const ValidationService = require('../../src/services/ValidationService');

test('ValidationService - validateUploadFile with valid file', () => {
  const file = {
    originalname: 'document.pdf',
    size: 1024,
    path: '/tmp/upload.pdf',
  };

  // Should not throw
  ValidationService.validateUploadFile(file);
});

test('ValidationService - validateUploadFile throws on missing file', () => {
  assert.throws(
    () => ValidationService.validateUploadFile(null),
    /File is required/
  );
});

test('ValidationService - validateUploadFile throws on missing originalname', () => {
  const file = {
    size: 1024,
    path: '/tmp/upload.pdf',
  };

  assert.throws(
    () => ValidationService.validateUploadFile(file),
    /valid originalname/
  );
});

test('ValidationService - validateUploadFile throws on invalid size', () => {
  const file = {
    originalname: 'document.pdf',
    size: 0,
    path: '/tmp/upload.pdf',
  };

  assert.throws(
    () => ValidationService.validateUploadFile(file),
    /greater than 0/
  );
});

test('ValidationService - validateUploadFile throws on size too large', () => {
  const file = {
    originalname: 'document.pdf',
    size: 200 * 1024 * 1024, // 200MB (exceeds 100MB limit)
    path: '/tmp/upload.pdf',
  };

  assert.throws(
    () => ValidationService.validateUploadFile(file),
    /exceeds maximum limit/
  );
});

test('ValidationService - validateUploadFile throws on missing path', () => {
  const file = {
    originalname: 'document.pdf',
    size: 1024,
  };

  assert.throws(
    () => ValidationService.validateUploadFile(file),
    /path is missing/
  );
});

test('ValidationService - validateDocumentId with valid UUID', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000';
  // Should not throw
  ValidationService.validateDocumentId(validUUID);
});

test('ValidationService - validateDocumentId throws on missing id', () => {
  assert.throws(
    () => ValidationService.validateDocumentId(null),
    /non-empty string/
  );
});

test('ValidationService - validateDocumentId throws on invalid format', () => {
  assert.throws(
    () => ValidationService.validateDocumentId('not-a-uuid'),
    /Invalid document ID format/
  );
});

test('ValidationService - validateOwner with valid owner', () => {
  // Should not throw
  ValidationService.validateOwner('user123');
});

test('ValidationService - validateOwner throws on missing owner', () => {
  assert.throws(
    () => ValidationService.validateOwner(null),
    /non-empty string/
  );
});
