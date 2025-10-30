import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

  // Função para formatar o WhatsApp (opcional, mas melhora a UX)
  const handleWhatsappFormat = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    // Aplica a formatação (ex: (XX) XXXXX-XXXX) - Simplificado para apenas números
    setFormData({ ...formData, whatsapp: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Diagnóstico Ella Hub</CardTitle>
          <CardDescription>
            Preencha o formulário para iniciar seu diagnóstico e ser redirecionado(a) para nosso time no WhatsApp.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Iniciar Diagnóstico no WhatsApp'
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="text-center pb-4">
            <Button variant="link" onClick={() => navigate('/login')}>
                Já tenho um token de acesso
            </Button>
        </div>
      </Card>
    </div>
  );
}
