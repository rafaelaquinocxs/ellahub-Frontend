import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, Bot, User } from 'lucide-react';
import ApiService from '../services/api';

const ChatComponent = () => {
  const { token, usuario } = useAuth();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    carregarHistorico();
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const carregarHistorico = async () => {
    try {
      const response = await ApiService.buscarHistoricoChat(token);
      if (response.success) {
        const mensagensFormatadas = response.conversas.map(conversa => [
          {
            id: `user-${conversa.timestamp}`,
            tipo: 'usuario',
            conteudo: conversa.pergunta,
            timestamp: new Date(conversa.timestamp)
          },
          {
            id: `bot-${conversa.timestamp}`,
            tipo: 'bot',
            conteudo: conversa.resposta,
            timestamp: new Date(conversa.timestamp)
          }
        ]).flat();
        
        setMensagens(mensagensFormatadas);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setCarregando(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    
    if (!novaMensagem.trim() || enviando) return;

    const mensagemUsuario = {
      id: `user-${Date.now()}`,
      tipo: 'usuario',
      conteudo: novaMensagem.trim(),
      timestamp: new Date()
    };

    setMensagens(prev => [...prev, mensagemUsuario]);
    setNovaMensagem('');
    setEnviando(true);

    try {
      const response = await ApiService.enviarPergunta(token, mensagemUsuario.conteudo);
      
      if (response.success) {
        const mensagemBot = {
          id: `bot-${Date.now()}`,
          tipo: 'bot',
          conteudo: response.resposta,
          timestamp: new Date(response.timestamp)
        };
        
        setMensagens(prev => [...prev, mensagemBot]);
      } else {
        throw new Error(response.message || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const mensagemErro = {
        id: `error-${Date.now()}`,
        tipo: 'bot',
        conteudo: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date()
      };
      
      setMensagens(prev => [...prev, mensagemErro]);
    } finally {
      setEnviando(false);
    }
  };

  const formatarHora = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
          <p className="text-gray-600">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96">
      {/* Área de mensagens */}
      <ScrollArea className="flex-1 p-4 border rounded-lg mb-4" ref={scrollRef}>
        {mensagens.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-purple-300" />
            <p className="text-lg font-medium mb-2">Olá, {usuario?.nome}! 👋</p>
            <p className="text-sm">
              Sou a Ella, sua mentora virtual. Como posso ajudar você hoje?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex ${mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md ${
                    mensagem.tipo === 'usuario' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {mensagem.tipo === 'usuario' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      mensagem.tipo === 'usuario'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{mensagem.conteudo}</p>
                    <p
                      className={`text-xs mt-1 ${
                        mensagem.tipo === 'usuario' ? 'text-purple-200' : 'text-gray-500'
                      }`}
                    >
                      {formatarHora(mensagem.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {enviando && (
              <div className="flex justify-start">
                <div className="flex">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="mx-2 p-3 rounded-lg bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Ella está digitando...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Área de input */}
      <form onSubmit={enviarMensagem} className="flex space-x-2">
        <Input
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite sua pergunta..."
          disabled={enviando}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={enviando || !novaMensagem.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {enviando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;

