import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function Registro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const registroMutation = trpc.auth.registro.useMutation({
    onSuccess: () => {
      console.log("[Registro] Sucesso! Redirecionando...");
      toast.success("Conta criada com sucesso!");
      setTimeout(() => {
        console.log("[Registro] Executando window.location.href");
        window.location.href = "/dashboard";
      }, 1000);
    },
    onError: (error) => {
      console.log("[Registro] Erro:", error);
      toast.error(error.message || "Erro ao criar conta");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("[Registro] Tentando criar conta para:", email);
    
    if (!nome || !email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (senha.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    registroMutation.mutate({ nome, email, senha });
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">DataPay</h1>
                <p className="text-sm text-gray-500">Enterprise</p>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Crie sua conta
            </h2>
            <p className="mt-2 text-gray-600">
              Comece a transformar seus dados em lucro
            </p>
          </div>

          {/* Card de Registro */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Minha Empresa"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={registroMutation.isPending}
                  autoComplete="organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={registroMutation.isPending}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={registroMutation.isPending}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                disabled={registroMutation.isPending}
              >
                {registroMutation.isPending ? "Criando conta..." : "Criar conta"}
              </Button>

              <div className="text-center text-sm text-gray-500 mt-4">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Fazer login
                </Link>
              </div>
            </form>
          </Card>

          {/* Link para landing page */}
          <div className="text-center">
            <Link href="/landing" className="text-sm text-gray-500 hover:text-gray-700">
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>

      {/* Lado direito - Imagem/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md text-white space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Plataforma de Ações Inteligentes</span>
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            Transforme seus dados em ações que geram lucro
          </h2>

          <p className="text-lg text-purple-100">
            A IA analisa seus dados, identifica oportunidades e sugere campanhas criativas
            que aumentam suas vendas.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Análise Inteligente</h3>
                <p className="text-sm text-purple-100">
                  IA identifica padrões e oportunidades escondidas nos seus dados
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ações Criativas</h3>
                <p className="text-sm text-purple-100">
                  Sugestões de campanhas e parcerias baseadas em dados reais
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Pesquisas Gamificadas</h3>
                <p className="text-sm text-purple-100">
                  Colete dados faltantes com engajamento e recompensas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

