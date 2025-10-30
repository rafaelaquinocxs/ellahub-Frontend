import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

// URL do WhatsApp para redirecionamento
const WHATSAPP_URL = 'https://wa.me/5554991191879';
const API_BASE_URL = "https://ellahub-9f6f69713e4d.herokuapp.com/api"; // Hardcoded API URL from context

export default function LeadCapture() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const { nome, email, whatsapp } = formData;
    if (!nome || !email || !whatsapp) {
      setError('Todos os campos são obrigatórios.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um email válido.');
      return false;
    }
    // Simple WhatsApp validation: only numbers, min 8 digits
    if (!/^\d{8,15}$/.test(whatsapp.replace(/\D/g, ''))) {
      setError('Por favor, insira um número de WhatsApp válido (apenas números).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/lead/capturar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Dados enviados com sucesso! Redirecionando...');
        // Redirecionamento para o WhatsApp
        setTimeout(() => {
          window.location.href = WHATSAPP_URL;
        }, 1500);

      } else {
        setError(data.message || 'Ocorreu um erro ao salvar o lead.');
      }
    } catch (err) {
      console.error('Erro de rede/API:', err);
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar o WhatsApp (simplificada)
  const handleWhatsappFormat = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    setFormData({ ...formData, whatsapp: value });
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 py-12">
        
        {/* Coluna da Imagem e Texto */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4">
            Comece seu Diagnóstico Agora!
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Preencha o formulário para dar o primeiro passo na sua jornada empreendedora. Após o envio, você será redirecionada para o nosso time no WhatsApp para continuar o diagnóstico.
          </p>
          {/* Imagem da Ella (assumindo que o arquivo está acessível) */}
          <img 
            src="/ella-hero.png" // Usando o mesmo placeholder da LandingPage.jsx
            alt="Ella, sua mentora virtual" 
            className="w-full max-w-sm rounded-lg shadow-2xl mt-4"
          />
        </div>

        {/* Coluna do Formulário */}
        <div className="md:w-1/2 w-full">
          <Card className="shadow-2xl border-t-4 border-purple-600">
            <CardHeader className="bg-purple-50/50">
              <CardTitle className="text-2xl text-purple-700">Dados de Contato</CardTitle>
              <CardDescription>
                Precisamos de suas informações para iniciar o diagnóstico e te enviar o resultado.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (somente números)</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="5554991191879"
                    value={formData.whatsapp}
                    onChange={handleWhatsappFormat}
                    required
                  />
                </div>
                {error && <p className="text-sm font-medium text-red-500">{error}</p>}
                {success && <p className="text-sm font-medium text-green-500">{success}</p>}
              </CardContent>
              <CardFooter className="flex-col">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold transition duration-300" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Iniciar Diagnóstico no WhatsApp <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <Button variant="link" onClick={() => navigate('/login')} className="mt-2 text-purple-600 hover:text-purple-700">
                    Já tenho um token de acesso
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
