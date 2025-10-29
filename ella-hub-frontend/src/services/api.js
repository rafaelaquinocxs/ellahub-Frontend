const API_BASE_URL = 'https://ellahub-9f6f69713e4d.herokuapp.com/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }
      
      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Autenticação
  async login(token) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { token },
    });
  }

  async criarUsuarioTeste(dados) {
    return this.request('/auth/criar-usuario-teste', {
      method: 'POST',
      body: dados,
    });
  }

  // Diagnóstico
  async buscarDiagnostico(token) {
    return this.request(`/diagnostico/${token}`);
  }

  async salvarDiagnostico(token, respostas) {
    return this.request('/diagnostico/salvar', {
      method: 'POST',
      body: { token, respostas },
    });
  }

  async gerarDiagnostico(token) {
    return this.request('/diagnostico/gerar', {
      method: 'POST',
      body: { token },
    });
  }

  // Chat
  async enviarPergunta(token, pergunta) {
    return this.request('/chat/pergunta', {
      method: 'POST',
      body: { token, pergunta },
    });
  }

  async buscarHistoricoChat(token) {
    return this.request(`/chat/historico/${token}`);
  }

  // Admin
  async buscarDashboardAdmin() {
    return this.request('/admin/dashboard', {
      headers: {
        'senha': 'admin123',
      },
    });
  }

  async listarUsuarios() {
    return this.request('/admin/usuarios', {
      headers: {
        'senha': 'admin123',
      },
    });
  }
}

export default new ApiService();
