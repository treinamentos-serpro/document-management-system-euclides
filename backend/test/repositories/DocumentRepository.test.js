const { test } = require('node:test');
const assert = require('node:assert');
const DocumentRepository = require('../../src/repositories/DocumentRepository');
const Document = require('../../src/domain/Document');

test('Repository: DocumentRepository - create adds document', () => {
  const repo = new DocumentRepository();
  const doc = new Document(
    'test-123',
    'file.pdf',
    1024,
    new Date().toISOString(),
    'user1'
  );

  const created = repo.create(doc);
  assert.strictEqual(created.id, 'test-123');
  assert.strictEqual(repo.exists('test-123'), true);
});

test('Repository: DocumentRepository - create throws on duplicate id', () => {
  const repo = new DocumentRepository();
  const doc = new Document(
    'test-123',
    'file.pdf',
    1024,
    new Date().toISOString(),
    'user1'
  );

  repo.create(doc);

  assert.throws(
    () => repo.create(doc),
    /already exists/
  );
});

test('Repository: DocumentRepository - findById returns document', () => {
  const repo = new DocumentRepository();
  const doc = new Document(
    'test-456',
    'another.pdf',
    2048,
    new Date().toISOString(),
    'user2'
  );

  repo.create(doc);
  const found = repo.findById('test-456');

  assert.strictEqual(found.id, 'test-456');
  assert.strictEqual(found.originalName, 'another.pdf');
});

test('Repository: DocumentRepository - findById returns null if not found', () => {
  const repo = new DocumentRepository();
  const found = repo.findById('nonexistent');

  assert.strictEqual(found, null);
});

test('Repository: DocumentRepository - findByOwner returns all user documents', () => {
  const repo = new DocumentRepository();
  const doc1 = new Document('id1', 'file1.pdf', 100, new Date().toISOString(), 'user1');
  const doc2 = new Document('id2', 'file2.pdf', 200, new Date().toISOString(), 'user1');
  const doc3 = new Document('id3', 'file3.pdf', 300, new Date().toISOString(), 'user2');

  repo.create(doc1);
  repo.create(doc2);
  repo.create(doc3);

  const user1Docs = repo.findByOwner('user1');
  assert.strictEqual(user1Docs.length, 2);
  assert.ok(user1Docs.some(d => d.id === 'id1'));
  assert.ok(user1Docs.some(d => d.id === 'id2'));

  const user2Docs = repo.findByOwner('user2');
  assert.strictEqual(user2Docs.length, 1);
  assert.strictEqual(user2Docs[0].id, 'id3');
});

test('Repository: DocumentRepository - findByOwner returns empty array if no documents', () => {
  const repo = new DocumentRepository();
  const docs = repo.findByOwner('nonexistent');

  assert.strictEqual(Array.isArray(docs), true);
  assert.strictEqual(docs.length, 0);
});

test('Repository: DocumentRepository - delete removes document', () => {
  const repo = new DocumentRepository();
  const doc = new Document('id1', 'file.pdf', 100, new Date().toISOString(), 'user1');

  repo.create(doc);
  assert.strictEqual(repo.exists('id1'), true);

  repo.delete('id1');
  assert.strictEqual(repo.exists('id1'), false);
});

test('Repository: DocumentRepository - getAll returns all documents', () => {
  const repo = new DocumentRepository();
  const doc1 = new Document('id1', 'file1.pdf', 100, new Date().toISOString(), 'user1');
  const doc2 = new Document('id2', 'file2.pdf', 200, new Date().toISOString(), 'user1');

  repo.create(doc1);
  repo.create(doc2);

  const all = repo.getAll();
  assert.strictEqual(all.length, 2);
});

test('Repository: DocumentRepository - clear removes all documents', () => {
  const repo = new DocumentRepository();
  const doc1 = new Document('id1', 'file1.pdf', 100, new Date().toISOString(), 'user1');
  const doc2 = new Document('id2', 'file2.pdf', 200, new Date().toISOString(), 'user1');

  repo.create(doc1);
  repo.create(doc2);
  repo.clear();

  const all = repo.getAll();
  assert.strictEqual(all.length, 0);
});
