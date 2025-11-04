import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, TrendingUp, Target, CheckCircle, Clock, BarChart3 } from 'lucide-react';

const AdminDiagnosticoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('adminToken');

  const API_BASE_URL = 'https://ellahub-9f6f69713e4d.herokuapp.com/api';

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
      return;
    }
    carregarDiagnostico();
  }, [id, token]);

  const carregarDiagnostico = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin-metricas/diagnosticos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnostico(data.diagnostico);
      } else {
        setError('Diagnóstico não encontrado ou erro de acesso.');
      }
    } catch (error) {
      console.error('Erro ao carregar diagnóstico:', error);
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do diagnóstico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!diagnostico) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Nenhum diagnóstico encontrado.</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const resultado = diagnostico.resultado || {};
  const planoAcao = resultado.planoAcao || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-purple-600 ml-4">Detalhes do Diagnóstico</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Resumo e Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 shadow-lg border-t-4 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  Resumo do Diagnóstico
                </CardTitle>
                <CardDescription>Análise completa gerada pela Ella.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{resultado.resumoDiagnostico || 'N/A'}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-700">Score de Maturidade</CardTitle>
                <CardDescription>Pontuação geral do negócio.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-extrabold text-blue-600 mb-2">
                  {resultado.score || 0}
                </div>
                <p className="text-xl text-gray-600">/ 100</p>
                <Badge className={`mt-4 text-sm ${getNivelCor(resultado.nivelNegocio)}`}>
                  Nível: {getNivelTexto(resultado.nivelNegocio)}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Pontos Fortes e Dificuldades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-t-4 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Pontos Fortes
                </CardTitle>
                <CardDescription>O que o negócio faz de melhor.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(resultado.pontosFortesIdentificados || []).map((ponto, index) => (
                    <li key={index} className="flex items-start p-2 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-t-4 border-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Target className="h-6 w-6 mr-2" />
                  Principais Dificuldades
                </CardTitle>
                <CardDescription>Áreas de risco ou lacunas.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(resultado.principaisDificuldades || []).map((dificuldade, index) => (
                    <li key={index} className="flex items-start p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{dificuldade}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Plano de Ação */}
          <Card className="shadow-lg border-t-4 border-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-700">
                <BarChart3 className="h-6 w-6 mr-2" />
                Plano de Ação
              </CardTitle>
              <CardDescription>Ações sugeridas divididas por prazo.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Curto Prazo */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-600">Curto Prazo (4 Semanas)</h3>
                <ul className="space-y-2">
                  {(planoAcao.curto_prazo || []).map((acao, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      {acao}
                    </li>
                  ))}
                </ul>
                {(planoAcao.curto_prazo?.length === 0 || !planoAcao.curto_prazo) && (
                  <p className="text-sm text-gray-500 italic">Nenhuma ação de curto prazo definida.</p>
                )}
              </div>

              {/* Médio Prazo */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-yellow-600">Médio Prazo (3 Meses)</h3>
                <ul className="space-y-2">
                  {(planoAcao.medio_prazo || []).map((acao, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                      {acao}
                    </li>
                  ))}
                </ul>
                {(planoAcao.medio_prazo?.length === 0 || !planoAcao.medio_prazo) && (
                  <p className="text-sm text-gray-500 italic">Nenhuma ação de médio prazo definida.</p>
                )}
              </div>

              {/* Longo Prazo */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-600">Longo Prazo (6 Meses+)</h3>
                <ul className="space-y-2">
                  {(planoAcao.longo_prazo || []).map((acao, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                      {acao}
                    </li>
                  ))}
                </ul>
                {(planoAcao.longo_prazo?.length === 0 || !planoAcao.longo_prazo) && (
                  <p className="text-sm text-gray-500 italic">Nenhuma ação de longo prazo definida.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDiagnosticoDetalhe;
