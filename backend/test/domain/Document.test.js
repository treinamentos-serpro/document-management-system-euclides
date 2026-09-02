const { test } = require('node:test');
const assert = require('node:assert');
const Document = require('../../src/domain/Document');

test('Domain: Document - constructor with valid data', () => {
  const doc = new Document(
    '123e4567-e89b-12d3-a456-426614174000',
    'test.pdf',
    1024,
    new Date().toISOString(),
    'user123'
  );

  assert.strictEqual(doc.id, '123e4567-e89b-12d3-a456-426614174000');
  assert.strictEqual(doc.originalName, 'test.pdf');
  assert.strictEqual(doc.size, 1024);
  assert.strictEqual(doc.owner, 'user123');
});

test('Domain: Document - validate throws on invalid id', () => {
  assert.throws(
    () => new Document(null, 'test.pdf', 1024, new Date().toISOString(), 'user123'),
    /Document ID must be a non-empty string/
  );
});

test('Domain: Document - validate throws on invalid size', () => {
  assert.throws(
    () => new Document('123', 'test.pdf', -1, new Date().toISOString(), 'user123'),
    /Document size must be a non-negative number/
  );
});

test('Domain: Document - toJSON returns plain object', () => {
  const doc = new Document(
    '123e4567-e89b-12d3-a456-426614174000',
    'test.pdf',
    1024,
    new Date().toISOString(),
    'user123'
  );

  const json = doc.toJSON();
  assert.strictEqual(json.id, '123e4567-e89b-12d3-a456-426614174000');
  assert.strictEqual(json.originalName, 'test.pdf');
  assert.strictEqual(json.size, 1024);
  assert.strictEqual(json.owner, 'user123');
});

test('Domain: Document - fromUpload creates new document', () => {
  const multerFile = {
    originalname: 'upload.txt',
    size: 2048,
    path: '/tmp/upload.txt',
  };

  const doc = Document.fromUpload(multerFile, 'user456');

  assert.strictEqual(doc.originalName, 'upload.txt');
  assert.strictEqual(doc.size, 2048);
  assert.strictEqual(doc.owner, 'user456');
  assert.ok(doc.id, 'ID should be generated');
  assert.ok(doc.uploadedAt, 'uploadedAt should be set');
});

test('Domain: Document - fromUpload throws on invalid file', () => {
  assert.throws(
    () => Document.fromUpload(null, 'user123'),
    /Invalid file object/
  );

  assert.throws(
    () => Document.fromUpload({ originalname: 'test.pdf' }, 'user123'),
    /Invalid file object/
  );
});

test('Domain: Document - fromUpload throws on missing owner', () => {
  const multerFile = {
    originalname: 'upload.txt',
    size: 2048,
    path: '/tmp/upload.txt',
  };

  assert.throws(
    () => Document.fromUpload(multerFile, null),
    /Owner is required/
  );
});
