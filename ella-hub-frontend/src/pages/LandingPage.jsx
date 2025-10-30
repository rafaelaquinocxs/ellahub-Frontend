import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MessageCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Conteúdo da LP baseado no documento fornecido
const lpContent = {
  title: "Descubra seu Momento na Jornada Empreendedora",
  greeting: "Seja bem-vinda, eu sou a Ella.",
  intro: [
    "Oi, empreendedora! 💜 Eu sei como é estar dando tudo de si — e ainda assim sentir que algo está fora do lugar. Às vezes parece que o negócio não anda, que o esforço não vira resultado... ou que falta clareza sobre o próximo passo.",
    "Mas deixa eu te contar um segredo: 👉 Você não está travada. 👉 Você só precisa entender onde está na sua jornada empreendedora pra saber como avançar com propósito.",
    "É pra isso que eu existo. Sou a Ella, sua mentora virtual no B2Ella Hub. E quero te convidar pra fazer o Diagnóstico da Jornada Empreendedora, um processo simples, rápido e transformador."
  ],
  howItWorks: [
    { icon: <Zap className="w-6 h-6 text-purple-600" />, title: "Você preenche o formulário abaixo", description: "Pra eu te conhecer um pouquinho melhor." },
    { icon: <MessageCircle className="w-6 h-6 text-purple-600" />, title: "Você vai receber um link direto pro meu WhatsApp", description: "Lá, eu mesma vou te fazer algumas perguntas sobre o seu negócio." },
    { icon: <ArrowRight className="w-6 h-6 text-purple-600" />, title: "Depois, te libero o acesso à plataforma do B2Ella Hub", description: "É lá que você vai visualizar o seu diagnóstico completo — com clareza sobre seu estágio atual e dicas práticas pra evoluir." }
  ],
  whyDiagnose: [
    "Em qual etapa da jornada seu negócio está (da ideia à liderança).",
    "Quais os pontos fortes que te sustentam hoje.",
    "E quais os passos estratégicos pra destravar seus próximos resultados."
  ],
  cta: "Comece agora o seu diagnóstico",
  footer: "Clareza é poder. E toda mulher que entende o seu momento, transforma o seu futuro."
};

const LandingPage = () => {
  const navigate = useNavigate();

  // Função de rolagem para o formulário (simulado) - FORÇANDO REDEPLOY PARA CORRIGIR FLUXO DE LEAD
  const scrollToForm = () => {
    // Redireciona para a página de captura de leads
    navigate('/lead-capture');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header/Hero Section */}
      <header className="bg-purple-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between max-w-6xl">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              {lpContent.title}
            </h1>
            <p className="text-xl mb-6">{lpContent.greeting}</p>
            <p className="text-lg mb-8">
              {lpContent.intro[0]}
            </p>
            <Button 
              size="lg" 
              className="bg-pink-400 hover:bg-pink-500 text-white text-lg font-bold transition duration-300"
              onClick={() => navigate('/lead-capture')}
            >
              Quero fazer meu diagnóstico <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Imagem Placeholder - Usando a imagem fornecida */}
            <img 
              src="/ella-hero.png" // Será necessário mover/copiar a imagem para /src/assets
              alt="Ella, sua mentora virtual" 
              className="w-full max-w-sm rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </header>

      {/* Como Funciona Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-700">✨ Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lpContent.howItWorks.map((item, index) => (
              <Card key={index} className="text-center p-6 shadow-xl transition duration-300 hover:shadow-2xl border-t-4 border-purple-500">
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 mb-4 bg-purple-100 rounded-full">
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold mb-2">
                    {index + 1}. {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Por que fazer o diagnóstico Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-700">🌱 Por que fazer o diagnóstico</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <p className="text-lg mb-6">Porque ninguém cresce no escuro.</p>
              <ul className="space-y-4 text-lg text-gray-700">
                {lpContent.whyDiagnose.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-3 text-2xl">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Imagem Placeholder */}
              <img 
                src="/ella-chart.png" // Será necessário mover/copiar a imagem para /src/assets
                alt="Gráfico de crescimento" 
                className="w-full max-w-sm rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final (Simulando Formulário) */}
      <section className="py-16 bg-purple-50 text-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold mb-4 text-purple-700">🚀 {lpContent.cta}</h2>
          <p className="text-xl mb-8 text-gray-600">
            Preencha o formulário e dê o primeiro passo pra transformar seu negócio (e sua confiança).
          </p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-3 px-8 transition duration-300"
            onClick={scrollToForm}
          >
            ✨ Quero fazer meu diagnóstico <Zap className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-purple-800 text-white text-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-lg mb-2">💜 E lembra...</p>
          <p className="text-xl font-semibold mb-4">
            {lpContent.footer}
          </p>
          <p className="text-sm">
            © 2024 Ella Hub. Transformando empreendedoras.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
