import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Download,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import ApiService from '../services/api';

const Admin = () => {
  const [dados, setDados] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      const response = await ApiService.buscarDashboardAdmin();
      if (response.success) {
        setDados(response.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await ApiService.listarUsuarios();
      if (response.success) {
        setUsuarios(response.usuarios);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const exportarCSV = () => {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exportar-csv`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usuarios-ella-hub.csv';
    link.click();
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getNivelTexto = (nivel) => {
    const niveis = {
      'ideacao': 'Ideação',
      'inicio': 'Início',
      'operacao': 'Operação',
      'crescimento': 'Crescimento'
    };
    return niveis[nivel] || nivel;
  };

  const getNivelCor = (nivel) => {
    const cores = {
      'ideacao': 'bg-yellow-100 text-yellow-800',
      'inicio': 'bg-blue-100 text-blue-800',
      'operacao': 'bg-green-100 text-green-800',
      'crescimento': 'bg-purple-100 text-purple-800'
    };
    return cores[nivel] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados administrativos...</p>
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
              <Button onClick={exportarCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Usuárias</p>
                  <p className="text-2xl font-bold text-gray-900">{dados?.totalUsuarias || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Diagnósticos Completos</p>
                  <p className="text-2xl font-bold text-gray-900">{dados?.diagnosticosCompletos || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuárias Recentes (30d)</p>
                  <p className="text-2xl font-bold text-gray-900">{dados?.usuariasRecentes || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversas Recentes (30d)</p>
                  <p className="text-2xl font-bold text-gray-900">{dados?.conversasRecentes || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="usuarios" onClick={carregarUsuarios}>Usuárias</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usuárias por Nível */}
              <Card>
                <CardHeader>
                  <CardTitle>Usuárias por Nível de Negócio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dados?.usuariasPorNivel && Object.entries(dados.usuariasPorNivel).map(([nivel, count]) => (
                      <div key={nivel} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className={getNivelCor(nivel)}>
                            {getNivelTexto(nivel)}
                          </Badge>
                        </div>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dores Mais Citadas */}
              <Card>
                <CardHeader>
                  <CardTitle>Principais Dificuldades Citadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dados?.doresMaisCitadas?.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.dor}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usuárias Tab */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuárias</CardTitle>
                <CardDescription>
                  Todas as usuárias cadastradas na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsuarios ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando usuárias...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Nome</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Nível</th>
                          <th className="text-left p-2">Diagnóstico</th>
                          <th className="text-left p-2">Data Criação</th>
                          <th className="text-left p-2">Último Acesso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((usuario) => (
                          <tr key={usuario._id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{usuario.nome}</td>
                            <td className="p-2 text-gray-600">{usuario.email}</td>
                            <td className="p-2">
                              <Badge className={getNivelCor(usuario.nivelNegocio)}>
                                {getNivelTexto(usuario.nivelNegocio)}
                              </Badge>
                            </td>
                            <td className="p-2">
                              {usuario.diagnosticoCompleto ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-orange-600" />
                              )}
                            </td>
                            <td className="p-2 text-gray-600">
                              {formatarData(usuario.criadoEm)}
                            </td>
                            <td className="p-2 text-gray-600">
                              {formatarData(usuario.ultimoAcesso)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Engajamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taxa de Conclusão de Diagnóstico</span>
                      <span className="font-semibold">
                        {dados?.totalUsuarias > 0 
                          ? Math.round((dados.diagnosticosCompletos / dados.totalUsuarias) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Usuárias Ativas (30d)</span>
                      <span className="font-semibold">{dados?.usuariasRecentes || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conversas por Usuária</span>
                      <span className="font-semibold">
                        {dados?.totalUsuarias > 0 
                          ? Math.round(dados.conversasRecentes / dados.totalUsuarias)
                          : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-1 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Crescimento Positivo</p>
                        <p className="text-xs text-gray-600">
                          {dados?.usuariasRecentes || 0} novas usuárias nos últimos 30 dias
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-blue-600 mt-1 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Engajamento Alto</p>
                        <p className="text-xs text-gray-600">
                          {dados?.conversasRecentes || 0} conversas com IA nos últimos 30 dias
                        </p>
                      </div>
                    </div>
                    {dados?.doresMaisCitadas?.length > 0 && (
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-1 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Principal Dificuldade</p>
                          <p className="text-xs text-gray-600">
                            {dados.doresMaisCitadas[0]?.dor} é a dificuldade mais citada
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

