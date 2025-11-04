import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Download,
  Search,
  ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [metricas, setMetricas] = useState(null);
  const [leads, setLeads] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [paginaLeads, setPaginaLeads] = useState(1);
  const [paginaDiagnosticos, setPaginaDiagnosticos] = useState(1);

  const API_BASE_URL = 'https://ellahub-9f6f69713e4d.herokuapp.com/api';

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
      return;
    }
    carregarDados();
  }, [token]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar métricas
      const metricasRes = await fetch(`${API_BASE_URL}/admin-metricas/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (metricasRes.ok) {
        const data = await metricasRes.json();
        setMetricas(data.metricas);
      }

      // Carregar leads
      const leadsRes = await fetch(`${API_BASE_URL}/admin-metricas/leads?pagina=${paginaLeads}&limite=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads);
      }

      // Carregar diagnósticos
      const diagRes = await fetch(`${API_BASE_URL}/admin-metricas/diagnosticos?pagina=${paginaDiagnosticos}&limite=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (diagRes.ok) {
        const data = await diagRes.json();
        setDiagnosticos(data.diagnosticos);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const exportarCSV = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin-metricas/exportar/csv`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ellahub-dados.csv';
        a.click();
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
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
          <p className="text-gray-600">Carregando dados...</p>
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
              <h1 className="text-2xl font-bold text-purple-600">EllaHub Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportarCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumo de Métricas */}
        {metricas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Leads</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metricas.resumo.totalLeads}</div>
                <p className="text-xs text-gray-500 mt-1">
                  +{metricas.resumo.leadsUltimos7dias} últimos 7 dias
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Diagnósticos</CardTitle>
                <BarChart3 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metricas.resumo.totalDiagnosticos}</div>
                <p className="text-xs text-gray-500 mt-1">
                  +{metricas.resumo.diagnosticosUltimos7dias} últimos 7 dias
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metricas.resumo.taxaConversao}</div>
                <p className="text-xs text-gray-500 mt-1">Leads → Diagnósticos</p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Score Médio</CardTitle>
                <BarChart3 className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metricas.scores.scoreMedia?.toFixed(1) || 0}</div>
                <p className="text-xs text-gray-500 mt-1">de 0 a 100</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="metricas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metricas">Análise de Dados</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="diagnosticos">Diagnósticos</TabsTrigger>
          </TabsList>

          {/* Tab: Análise de Dados */}
          <TabsContent value="metricas" className="space-y-6">
            {metricas && (
              <>
                {/* Distribuição por Nível */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Nível de Negócio</CardTitle>
                    <CardDescription>Quantidade de diagnósticos por fase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metricas.distribuicaoNivel.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge className={getNivelCor(item.nivel)}>
                              {getNivelTexto(item.nivel)}
                            </Badge>
                            <span className="text-sm text-gray-600">{item.quantidade} diagnósticos</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{item.percentual}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Dificuldades */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 Dificuldades Mais Citadas</CardTitle>
                    <CardDescription>Principais desafios identificados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metricas.dificuldadesMaisCitadas.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{index + 1}. {item.dificuldade}</p>
                            <p className="text-xs text-gray-600">{item.frequencia} menções</p>
                          </div>
                          <Badge variant="outline">{item.percentual}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Pontos Fortes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 Pontos Fortes Mais Citados</CardTitle>
                    <CardDescription>Principais forças identificadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metricas.pontosForteMaisCitados.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{index + 1}. {item.ponto}</p>
                            <p className="text-xs text-gray-600">{item.frequencia} menções</p>
                          </div>
                          <Badge variant="outline">{item.percentual}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Tab: Leads */}
          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads Capturados</CardTitle>
                <CardDescription>Todas as pessoas que preencheram o formulário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nome, email ou WhatsApp..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">WhatsApp</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900">{lead.nome}</td>
                            <td className="py-3 px-4 text-gray-600">{lead.email}</td>
                            <td className="py-3 px-4 text-gray-600">{lead.whatsapp}</td>
                            <td className="py-3 px-4 text-gray-500 text-xs">
                              {new Date(lead.dataCaptura).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Diagnósticos */}
          <TabsContent value="diagnosticos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagnósticos Completos</CardTitle>
                <CardDescription>Todas as análises realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">WhatsApp</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Nível</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Score</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Data</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosticos.map((diag, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900 font-mono text-xs">{diag.whatsapp}</td>
                            <td className="py-3 px-4">
                              <Badge className={getNivelCor(diag.resultado?.nivelNegocio)}>
                                {getNivelTexto(diag.resultado?.nivelNegocio)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-900 font-semibold">
                              {diag.resultado?.score || 0}/100
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-xs">
                              {new Date(diag.criadoEm).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/admin/diagnostico/${diag._id}`)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
