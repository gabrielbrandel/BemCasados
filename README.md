# 🍰 Bem Casado - Site de Encomendas

Um site interativo para encomenda de bem casados personalizados, desenvolvido com Next.js e Tailwind CSS.

## 🌐 Demo Online

**Acesse a demonstração:** [https://seu-usuario.github.io/bem-casados](https://seu-usuario.github.io/bem-casados)

## 🚀 Funcionalidades

### 👤 **Sistema de Usuários**
- ✅ Cadastro e login de clientes
- ✅ Perfil personalizado com dados de entrega
- ✅ Sistema de autenticação seguro

### 🎨 **Montagem Interativa**
- ✅ Interface visual para personalizar bem casados
- ✅ Seleção de recheios (Doce de Leite, Brigadeiro, Beijinho, etc.)
- ✅ Escolha de embalagens (Papel Crepom, Saquinho, Caixinha, etc.)
- ✅ Preview em tempo real da montagem

### 🛒 **Sistema de Carrinho**
- ✅ Adicione múltiplos itens personalizados
- ✅ Controle de quantidades
- ✅ Cálculo automático de totais
- ✅ **Cache inteligente** - carrinho salvo no navegador
- ✅ Botão "Repetir Pedido" do histórico

### 📱 **Integração WhatsApp**
- ✅ Envio automático de pedidos via WhatsApp
- ✅ Mensagem formatada com todos os detalhes
- ✅ Dados de entrega incluídos automaticamente

### 📊 **Histórico Completo**
- ✅ Histórico de todos os pedidos do cliente
- ✅ Estatísticas pessoais (total gasto, pedidos, etc.)
- ✅ Detalhes expandidos de cada pedido
- ✅ Status de acompanhamento

### 👨‍💼 **Painel Administrativo**
- ✅ Gerenciamento completo de pedidos
- ✅ Controle de status (Pendente, Produção, Entregue)
- ✅ Visualização detalhada de todos os pedidos
- ✅ Dashboard com métricas

### 📱 **Design Responsivo**
- ✅ Interface otimizada para mobile
- ✅ Menu adaptativo
- ✅ Experiência fluida em todos os dispositivos

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes modernos
- **Lucide React** - Ícones SVG otimizados
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 🚀 Como Usar o Site

### 1. **Primeiro Acesso**
\`\`\`
1. Acesse o site
2. Clique em "Entrar" 
3. Cadastre-se com seus dados
4. Inclua endereço de entrega
\`\`\`

### 2. **Montando seu Bem Casado**
\`\`\`
1. Clique em "Montar Bem Casado"
2. Escolha o recheio desejado
3. Selecione a embalagem
4. Veja o preview em tempo real
5. Clique em "Adicionar ao Carrinho"
\`\`\`

### 3. **Finalizando Pedido**
\`\`\`
1. Revise itens no carrinho
2. Ajuste quantidades se necessário
3. Clique em "Finalizar Pedido"
4. Confirme e envie via WhatsApp
\`\`\`

### 4. **Acompanhamento**
\`\`\`
1. Acesse "Meus Pedidos"
2. Veja histórico completo
3. Acompanhe status dos pedidos
4. Use "Repetir Pedido" para recomprar
\`\`\`

## 🌐 Deploy no GitHub Pages

### **Passo a Passo Completo:**

#### 1. **Preparar Repositório**
\`\`\`bash
# Clone ou baixe o código
git clone https://github.com/seu-usuario/bem-casados.git
cd bem-casados

# Instale dependências
npm install
\`\`\`

#### 2. **Configurar GitHub**
\`\`\`bash
# Inicialize git (se necessário)
git init

# Adicione arquivos
git add .
git commit -m "Initial commit - Bem Casado Site"

# Conecte ao GitHub
git remote add origin https://github.com/seu-usuario/bem-casados.git
git push -u origin main
\`\`\`

#### 3. **Ativar GitHub Pages**
\`\`\`
1. Vá para seu repositório no GitHub
2. Clique em "Settings"
3. Role até "Pages" no menu lateral
4. Em "Source", selecione "GitHub Actions"
5. O deploy será automático! 🚀
\`\`\`

#### 4. **Aguardar Deploy**
\`\`\`
- O GitHub Actions executará automaticamente
- Aguarde alguns minutos
- Seu site estará em: https://seu-usuario.github.io/bem-casados
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
bem-casados/
├── 📁 app/
│   ├── 📁 components/
│   │   ├── 🎨 bem-casado-builder.tsx    # Interface de montagem
│   │   ├── 🛒 client-history.tsx        # Histórico do cliente
│   │   ├── 🔐 login-modal.tsx           # Modal de login
│   │   ├── 👤 login-page.tsx            # Página de login
│   │   └── 👨‍💼 admin-panel.tsx           # Painel admin
│   ├── 📁 types/
│   │   ├── 🍰 bem-casado.ts             # Tipos do bem casado
│   │   └── 👤 user.ts                   # Tipos de usuário
│   ├── 🎨 globals.css                   # Estilos globais
│   ├── 📄 layout.tsx                    # Layout principal
│   └── 🏠 page.tsx                      # Página inicial
├── 📁 components/ui/                    # Componentes shadcn/ui
├── 📁 public/                          # Arquivos estáticos
├── 📁 .github/workflows/               # GitHub Actions
│   └── 🚀 deploy.yml                   # Workflow de deploy
├── ⚙️ next.config.mjs                  # Configuração Next.js
├── 📦 package.json                     # Dependências
└── 📖 README.md                        # Esta documentação
\`\`\`

## 🎨 Personalização

### **Cores e Tema**
\`\`\`typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "#8B4513",    // Marrom bem casado
        secondary: "#D2691E",  // Laranja dourado
        accent: "#F4A460",     // Bege claro
      }
    }
  }
}
\`\`\`

### **Recheios e Embalagens**
\`\`\`typescript
// app/types/bem-casado.ts
export const recheios = [
  { id: 'doce-leite', nome: 'Doce de Leite', preco: 2.50 },
  { id: 'brigadeiro', nome: 'Brigadeiro', preco: 2.80 },
  // Adicione mais recheios aqui
]

export const embalagens = [
  { id: 'papel-crepom', nome: 'Papel Crepom', preco: 0.50 },
  { id: 'saquinho', nome: 'Saquinho', preco: 0.30 },
  // Adicione mais embalagens aqui
]
\`\`\`

## 🔧 Desenvolvimento Local

\`\`\`bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
# Acesse: http://localhost:3000

# Build para produção
npm run build

# Testar build localmente
npm start
\`\`\`

## 📊 Funcionalidades Técnicas

### **Cache e Performance**
- ✅ Carrinho salvo no localStorage por usuário
- ✅ Dados persistentes entre sessões
- ✅ Imagens otimizadas para web
- ✅ Componentes lazy loading

### **Responsividade**
- ✅ Design mobile-first
- ✅ Menu adaptativo
- ✅ Grid responsivo
- ✅ Touch-friendly

### **Acessibilidade**
- ✅ Navegação por teclado
- ✅ Screen reader friendly
- ✅ Contraste adequado
- ✅ Semântica HTML correta

## 🐛 Solução de Problemas

### **Deploy não funcionou?**
\`\`\`bash
# Verifique se o workflow executou
# Vá em Actions no GitHub e veja os logs

# Se houver erro, tente:
git add .
git commit -m "Fix deploy"
git push origin main
\`\`\`

### **Site não carrega?**
\`\`\`bash
# Aguarde alguns minutos após o deploy
# Limpe cache do navegador (Ctrl+F5)
# Verifique se o repositório é público
\`\`\`

### **Funcionalidades não funcionam?**
\`\`\`bash
# Verifique se JavaScript está habilitado
# Teste em modo incógnito
# Verifique console do navegador (F12)
\`\`\`

## 📞 Suporte

Para dúvidas, sugestões ou problemas:

1. **Issues do GitHub**: Abra uma issue no repositório
2. **WhatsApp**: Use o próprio sistema do site para contato
3. **Email**: Adicione seu email de contato aqui

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🎉 Resultado Final

Após seguir este guia, você terá:

✅ **Site completo** funcionando no GitHub Pages  
✅ **URL pública** para demonstrações  
✅ **Deploy automático** a cada push  
✅ **Sistema completo** de encomendas  
✅ **Interface profissional** e responsiva  

**URL do seu site:** `https://seu-usuario.github.io/bem-casados`

---

*Desenvolvido com ❤️ para facilitar encomendas de bem casados*
\`\`\`

```file file=".nojekyll"
