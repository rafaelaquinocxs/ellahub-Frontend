import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Por favor, insira seu token');
      return;
    }

    setLoading(true);
    setError('');

    // Adicionado um pequeno delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const result = await login(token.trim());
    
    if (result.success) {
      navigate('/painel');
    } else {
      // O erro 'Token inválido' virá daqui
      setError(result.message || 'Token inválido');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">EllaHub</h1>
          <p className="text-gray-600">Empoderamento Feminino no Empreendedorismo</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Acesse sua conta</CardTitle>
            <CardDescription>
              Digite o token que você recebeu via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                  Token de Acesso
                </label>
                <Input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Digite seu token aqui"
                  className="w-full"
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
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Link para criar usuário de teste */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">
                Para desenvolvimento e testes:
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/criar-teste')}
              >
                Criar Usuário de Teste
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Ella Hub. Transformando empreendedoras.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
