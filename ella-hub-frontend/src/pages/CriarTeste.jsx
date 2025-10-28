import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Copy, Check } from 'lucide-react';
import ApiService from '../services/api';

const CriarTeste = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usuarioCriado, setUsuarioCriado] = useState(null);
  const [tokenCopiado, setTokenCopiado] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ApiService.criarUsuarioTeste(formData);
      
      if (response.success) {
        setUsuarioCriado(response.usuario);
      } else {
        setError(response.message || 'Erro ao criar usuário');
      }
    } catch (error) {
      setError(error.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  const copiarToken = async () => {
    try {
      await navigator.clipboard.writeText(usuarioCriado.token);
      setTokenCopiado(true);
      setTimeout(() => setTokenCopiado(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar token:', error);
    }
  };

  const irParaLogin = () => {
    navigate('/', { state: { token: usuarioCriado.token } });
  };

  if (usuarioCriado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">Usuário Criado!</CardTitle>
              <CardDescription>
                Seu usuário de teste foi criado com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <p className="text-gray-900">{usuarioCriado.nome}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900">{usuarioCriado.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token de Acesso
                </label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={usuarioCriado.token} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copiarToken}
                    className="flex-shrink-0"
                  >
                    {tokenCopiado ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Guarde este token! Você precisará dele para fazer login na plataforma.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button 
                  onClick={irParaLogin}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Fazer Login
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Criar Usuário de Teste</h1>
            <p className="text-gray-600 text-sm">Para desenvolvimento e demonstração</p>
          </div>
        </div>

        {/* Card de Criação */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Dados do Usuário</CardTitle>
            <CardDescription>
              Preencha os dados para criar um usuário de teste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite o email (opcional)"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="Digite o telefone (opcional)"
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Usuário'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CriarTeste;

