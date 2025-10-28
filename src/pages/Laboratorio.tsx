import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Zap, TrendingUp, BarChart3, Settings, FileText, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Laboratorio() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState('gerador');
  const [recordCount, setRecordCount] = useState([100000]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['SP', 'RJ', 'MG']);
  const [seasonality, setSeasonality] = useState<string[]>(['black_friday']);
  const [calibrationEnabled, setCalibrationEnabled] = useState(false);
  const [realDatasetSize, setRealDatasetSize] = useState('10000');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const regions = ['SP', 'RJ', 'MG', 'BA', 'RS', 'SC', 'PE', 'CE'];
  const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56+'];
  const seasonalityOptions = [
    { id: 'black_friday', label: 'Black Friday' },
    { id: 'natal', label: 'Natal' },
    { id: 'ano_novo', label: 'Ano Novo' },
    { id: 'carnaval', label: 'Carnaval' },
    { id: 'verao', label: 'Verão' },
  ];

  const tools = [
    {
      id: 'gerador',
      title: '🧬 Gerador de Dados Sintéticos',
      description: 'Crie datasets sintéticos realistas com parâmetros avançados',
      icon: Zap,
      color: 'bg-blue-50 border-blue-200',
      content: 'Configure quantidade de registros, regiões, faixa etária e sazonalidade para gerar dados realistas.'
    },
    {
      id: 'simulador',
      title: '🎯 Simulador de Campanhas',
      description: 'Teste campanhas em dados sintéticos antes de executar',
      icon: TrendingUp,
      color: 'bg-purple-50 border-purple-200',
      content: 'Simule o desempenho de campanhas em diferentes cenários com dados sintéticos.'
    },
    {
      id: 'testador',
      title: '🔬 Testador de Insights',
      description: 'Valide insights em múltiplos cenários sintéticos',
      icon: BarChart3,
      color: 'bg-green-50 border-green-200',
      content: 'Valide a precisão de seus insights testando em múltiplos cenários.'
    },
    {
      id: 'validador',
      title: '✅ Validador de Pesquisas',
      description: 'Preveja taxa de resposta e qualidade de dados',
      icon: FileText,
      color: 'bg-orange-50 border-orange-200',
      content: 'Preveja taxa de resposta e qualidade de dados antes de lançar pesquisas.'
    },
    {
      id: 'previsor',
      title: '📊 Previsor de Resultados',
      description: 'Simule ROI e impacto de ações antes de executar',
      icon: TrendingUp,
      color: 'bg-pink-50 border-pink-200',
      content: 'Simule ROI e impacto financeiro de ações antes de executá-las.'
    },
    {
      id: 'historico',
      title: '📈 Histórico de Simulações',
      description: 'Acompanhe acurácia das previsões vs resultados reais',
      icon: BarChart3,
      color: 'bg-indigo-50 border-indigo-200',
      content: 'Visualize histórico de simulações e compare previsões com resultados reais.'
    },
  ];

  // Detectar rota e mudar aba automaticamente
  useEffect(() => {
    if (location === '/laboratorio/gerador') {
      setActiveTab('gerador');
      setSelectedTool(null);
    } else if (location === '/laboratorio/simulador') {
      setSelectedTool('simulador');
      setActiveTab('ferramentas');
    } else if (location === '/laboratorio/testador') {
      setSelectedTool('testador');
      setActiveTab('ferramentas');
    }
  }, [location]);

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">🧪 Laboratório</h1>
        <p className="text-gray-600">
          Teste ideias, simule campanhas e valide insights com dados sintéticos realistas
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24</div>
              <p className="text-sm text-gray-600 mt-2">Simulações Executadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">94%</div>
              <p className="text-sm text-gray-600 mt-2">Acurácia Média</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">12.5M</div>
              <p className="text-sm text-gray-600 mt-2">Registros Gerados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">R$ 2.3M</div>
              <p className="text-sm text-gray-600 mt-2">ROI Previsto</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gerador">Gerador Avançado</TabsTrigger>
          <TabsTrigger value="ferramentas">Todas as Ferramentas</TabsTrigger>
        </TabsList>

        {/* Gerador Avançado */}
        <TabsContent value="gerador" className="space-y-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Gerador de Dados Sintéticos
              </CardTitle>
              <CardDescription>
                Configure parâmetros avançados para gerar datasets realistas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quantidade de Registros */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">
                  Quantidade de Registros: {recordCount[0].toLocaleString()}
                </label>
                <Slider
                  value={recordCount}
                  onValueChange={setRecordCount}
                  min={1000}
                  max={10000000}
                  step={10000}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Mínimo: 1k | Máximo: 10M</p>
              </div>

              {/* Segmentação por Região */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Segmentação por Região</label>
                <div className="grid grid-cols-4 gap-3">
                  {regions.map((region) => (
                    <label key={region} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedRegions.includes(region)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRegions([...selectedRegions, region]);
                          } else {
                            setSelectedRegions(selectedRegions.filter((r) => r !== region));
                          }
                        }}
                      />
                      <span className="text-sm">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Faixa Etária */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Faixa Etária</label>
                <div className="grid grid-cols-5 gap-2">
                  {ageRanges.map((range) => (
                    <Button key={range} variant="outline" className="text-xs">
                      {range}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sazonalidade */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Incluir Sazonalidade</label>
                <div className="space-y-2">
                  {seasonalityOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={seasonality.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSeasonality([...seasonality, option.id]);
                          } else {
                            setSeasonality(seasonality.filter((s) => s !== option.id));
                          }
                        }}
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Calibragem */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={calibrationEnabled}
                    onCheckedChange={(checked) => setCalibrationEnabled(!!checked)}
                  />
                  <span className="text-sm font-semibold">Calibrar com dados reais</span>
                </label>
                {calibrationEnabled && (
                  <div className="space-y-3 mt-4">
                    <p className="text-xs text-gray-600">
                      A IA vai analisar seu dataset real e extrair padrões para gerar dados sintéticos mais realistas
                    </p>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold">Tamanho do dataset real (registros)</label>
                      <Input
                        type="number"
                        value={realDatasetSize}
                        onChange={(e) => setRealDatasetSize(e.target.value)}
                        placeholder="Ex: 10000"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Gerar Dataset
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview dos Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Idade</th>
                      <th className="px-4 py-2 text-left">Região</th>
                      <th className="px-4 py-2 text-left">Última Compra</th>
                      <th className="px-4 py-2 text-left">Ticket Médio</th>
                      <th className="px-4 py-2 text-left">Segmento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{1000 + i}</td>
                        <td className="px-4 py-2">{28 + i}</td>
                        <td className="px-4 py-2">SP</td>
                        <td className="px-4 py-2">15 dias</td>
                        <td className="px-4 py-2">R$ {(500 + i * 100).toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <Badge variant="outline">Premium</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Todas as Ferramentas */}
        <TabsContent value="ferramentas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className={`border-2 cursor-pointer hover:shadow-lg transition-shadow ${tool.color}`}
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <CardDescription className="mt-2">{tool.description}</CardDescription>
                      </div>
                      <IconComponent className="w-6 h-6 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedTool(tool.id)}>
                      Acessar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Ferramenta */}
      <Dialog open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedToolData && selectedToolData.title}
            </DialogTitle>
          </DialogHeader>
          {selectedToolData && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedToolData.description}</p>
              <p className="text-sm text-gray-500">{selectedToolData.content}</p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900">
                  ℹ️ Esta ferramenta está em desenvolvimento. Em breve você poderá usar todos os recursos aqui!
                </p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Acessar {selectedToolData.title.split(' ')[1]}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

