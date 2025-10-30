import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  MessageCircle, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock,
  LogOut,
  BarChart3
} from 'lucide-react';
import ApiService from '../services/api';
import ChatComponent from '../components/ChatComponent';

const Dashboard = () => {
  const { usuario, logout, token } = useAuth();
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gerandoDiagnostico, setGerandoDiagnostico] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [token]);

  const carregarDados = async () => {
    try {
      const response = await ApiService.buscarDiagnostico(token);
      if (response.success && response.diagnostico) {
        setDiagnostico(response.diagnostico);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarDiagnostico = async () => {
    setGerandoDiagnostico(true);
    try {
      const response = await ApiService.gerarDiagnostico(token);
      if (response.success) {
        // Recarregar dados para pegar o diagnóstico gerado
        await carregarDados();
        alert('Diagnóstico gerado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao gerar diagnóstico:', error);
      alert('Erro ao gerar diagnóstico. Verifique se você completou o questionário via WhatsApp.');
    } finally {
      setGerandoDiagnostico(false);
    }
  };

  const getNivelTexto = (nivel) => {
    const niveis = {
      'ideacao': 'Ideação',
      'inicio': 'Início',
      'operacao': 'Operação',
      'crescimento': 'Crescimento',
      'crescimento_escala': 'Crescimento e Escala'
    };
    return niveis[nivel] || nivel;
  };

  const getNivelCor = (nivel) => {
    const cores = {
      'ideacao': 'bg-yellow-100 text-yellow-800',
      'inicio': 'bg-blue-100 text-blue-800',
      'operacao': 'bg-green-100 text-green-800',
      'crescimento': 'bg-purple-100 text-purple-800',
      'crescimento_escala': 'bg-indigo-100 text-indigo-800'
    };
    return cores[nivel] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">EllaHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{usuario?.nome}</span>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vinda, {usuario?.nome}! 👋
          </h2>
          <p className="text-gray-600">
            Aqui está o resumo do seu negócio e próximos passos para crescer.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card: Nível do Negócio */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Nível do Negócio</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {getNivelTexto(diagnostico?.resultado?.nivelNegocio)}
              </div>
              <p className="text-xs text-gray-500">
                Fase atual do seu empreendimento
              </p>
            </CardContent>
          </Card>

          {/* Card: Diagnóstico */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-1">
                Completo
              </div>
              <p className="text-xs text-gray-500">
                Análise de 360º realizada
              </p>
            </CardContent>
          </Card>

          {/* Card: Score */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Score</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {diagnostico?.resultado?.score || 0}/100
              </div>
              <Progress value={diagnostico?.resultado?.score || 0} className="mt-2 h-2" />
              <p className="text-xs text-gray-500 mt-1">
                Sua pontuação de maturidade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="diagnostico" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
            <TabsTrigger value="plano">Plano de Ação</TabsTrigger>
            <TabsTrigger value="chat">Chat com IA</TabsTrigger>
          </TabsList>

          {/* Diagnóstico Tab */}
          <TabsContent value="diagnostico" className="space-y-6">
            {diagnostico?.resultado?.pontosFortesIdentificados?.length > 0 || diagnostico?.resultado?.recomendacoes?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {diagnostico.resultado.pontosFortesIdentificados?.map((ponto, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-orange-600" />
                      Principais Dificuldades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {diagnostico.resultado.principaisDificuldades?.map((dificuldade, index) => (
                        <li key={index} className="flex items-start">
                          <Clock className="h-4 w-4 text-orange-600 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{dificuldade}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recomendações Personalizadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {diagnostico.resultado.recomendacoes?.map((recomendacao, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                          </div>
                          <span className="text-gray-700">{recomendacao}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Diagnóstico não realizado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete seu diagnóstico para receber recomendações personalizadas.
                  </p>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleGerarDiagnostico}
                    disabled={gerandoDiagnostico}
                  >
                    {gerandoDiagnostico ? 'Gerando diagnóstico...' : 'Fazer Diagnóstico'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Plano de Ação Tab */}
          <TabsContent value="plano" className="space-y-6">
            {diagnostico?.resultado?.planoAcao && (
              diagnostico.resultado.planoAcao.curto_prazo?.length > 0 ||
              diagnostico.resultado.planoAcao.medio_prazo?.length > 0 ||
              diagnostico.resultado.planoAcao.longo_prazo?.length > 0
            ) ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                                  {/* Curto Prazo */}
                <Card className="shadow-lg border-t-4 border-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Curto Prazo
                    </CardTitle>
                    <CardDescription>Próximas 4 semanas - Foco na Ação Imediata</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {diagnostico.resultado.planoAcao.curto_prazo?.map((acao, index) => (
                        <li key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800">{acao}</span>
                        </li>
                      ))}
                    </ul>
                    {diagnostico.resultado.planoAcao.curto_prazo?.length === 0 && (
                      <p className="text-sm text-gray-500 italic">Nenhuma ação de curto prazo definida.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Médio Prazo */}
                <Card className="shadow-lg border-t-4 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Médio Prazo
                    </CardTitle>
                    <CardDescription>Próximos 3 meses - Foco no Crescimento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {diagnostico.resultado.planoAcao.medio_prazo?.map((acao, index) => (
                        <li key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800">{acao}</span>
                        </li>
                      ))}
                    </ul>
                    {diagnostico.resultado.planoAcao.medio_prazo?.length === 0 && (
                      <p className="text-sm text-gray-500 italic">Nenhuma ação de médio prazo definida.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Longo Prazo */}
                <Card className="shadow-lg border-t-4 border-purple-500">
                  <CardHeader>
                    <CardTitle className="text-purple-600 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Longo Prazo
                    </CardTitle>
                    <CardDescription>Próximos 6-12 meses - Foco na Escala</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {diagnostico.resultado.planoAcao.longo_prazo?.map((acao, index) => (
                        <li key={index} className="flex items-start p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800">{acao}</span>
                        </li>
                      ))}
                    </ul>
                    {diagnostico.resultado.planoAcao.longo_prazo?.length === 0 && (
                      <p className="text-sm text-gray-500 italic">Nenhuma ação de longo prazo definida.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Plano de Ação Não Gerado
                  </h3>
                  <p className="text-gray-600">
                    Seu diagnóstico está completo, mas o plano de ação não foi gerado automaticamente.
                    Clique no botão abaixo para gerar um plano de ação personalizado.
                  </p>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 mt-4"
                    onClick={handleGerarDiagnostico} // Reutilizando a função de gerar diagnóstico
                    disabled={gerandoDiagnostico}
                  >
                    {gerandoDiagnostico ? 'Gerando Plano...' : 'Gerar Plano de Ação'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                  Chat com Ella - Sua Mentora Virtual
                </CardTitle>
                <CardDescription>
                  Tire suas dúvidas e receba orientações personalizadas sobre seu negócio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatComponent />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
