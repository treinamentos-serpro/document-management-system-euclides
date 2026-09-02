// Serviço de autorização
// Responsabilidade única: verificar permissões de acesso

class AuthorizationService {
  // Verifica se um usuário pode fazer download de um documento
  static canDownload(userId, documentOwnerId) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a non-empty string');
    }

    if (!documentOwnerId || typeof documentOwnerId !== 'string') {
      throw new Error('Document owner ID must be a non-empty string');
    }

    return userId === documentOwnerId;
  }

  // Verifica se um usuário pode listar documentos
  // (sempre pode listar seus próprios documentos)
  static canList(userId, documentOwnerId) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a non-empty string');
    }

    if (!documentOwnerId || typeof documentOwnerId !== 'string') {
      throw new Error('Document owner ID must be a non-empty string');
    }

    return userId === documentOwnerId;
  }
}

module.exports = AuthorizationService;
