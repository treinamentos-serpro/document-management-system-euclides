const { test } = require('node:test');
const assert = require('node:assert');
const AuthorizationService = require('../../src/services/AuthorizationService');

test('AuthorizationService - canDownload returns true when user is owner', () => {
  const result = AuthorizationService.canDownload('user123', 'user123');
  assert.strictEqual(result, true);
});

test('AuthorizationService - canDownload returns false when user is not owner', () => {
  const result = AuthorizationService.canDownload('user123', 'user456');
  assert.strictEqual(result, false);
});

test('AuthorizationService - canDownload throws on missing userId', () => {
  assert.throws(
    () => AuthorizationService.canDownload(null, 'user456'),
    /User ID must be a non-empty string/
  );
});

test('AuthorizationService - canDownload throws on missing documentOwnerId', () => {
  assert.throws(
    () => AuthorizationService.canDownload('user123', null),
    /Document owner ID must be a non-empty string/
  );
});

test('AuthorizationService - canList returns true when user is owner', () => {
  const result = AuthorizationService.canList('user123', 'user123');
  assert.strictEqual(result, true);
});

test('AuthorizationService - canList returns false when user is not owner', () => {
  const result = AuthorizationService.canList('user123', 'user456');
  assert.strictEqual(result, false);
});

test('AuthorizationService - canList throws on missing userId', () => {
  assert.throws(
    () => AuthorizationService.canList(null, 'user456'),
    /User ID must be a non-empty string/
  );
});

test('AuthorizationService - canList throws on missing documentOwnerId', () => {
  assert.throws(
    () => AuthorizationService.canList('user123', null),
    /Document owner ID must be a non-empty string/
  );
});
