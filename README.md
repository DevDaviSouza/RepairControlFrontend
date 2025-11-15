# RepairControl - Frontend

Frontend completo para o sistema RepairControl, desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para requisições à API
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Tailwind CSS** - Framework CSS utility-first
- **date-fns** - Biblioteca para manipulação de datas

## 📦 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3000
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── config/          # Configurações (API, etc)
│   ├── hooks/           # Custom hooks
│   ├── layouts/         # Layouts da aplicação
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços de API
│   ├── types/           # Tipos TypeScript
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── public/              # Arquivos estáticos
├── index.html           # HTML principal
└── package.json         # Dependências do projeto
```

## 📋 Funcionalidades

### Autenticação
- Tela de login (simulada - aguardando implementação no backend)

### Dashboard
- Visão geral com métricas importantes
- Ordens atrasadas
- Pendentes de pintura
- Peças entregues no mês
- Total recebido em pagamentos
- Ordens próximas do prazo

### Clientes
- Listagem com paginação
- Criação de novos clientes
- Edição de clientes existentes
- Exclusão de clientes

### Ordens de Serviço
- Listagem com paginação
- Filtro de ordens atrasadas
- Criação de novas ordens
- Edição de ordens
- Visualização detalhada
- Alteração de status
- Finalização de ordem
- Alteração de data de conclusão
- Exclusão de ordens

### Pagamentos
- Listagem de todos os pagamentos
- Total recebido
- Criação de novos pagamentos
- Exclusão de pagamentos

### Empresas
- Listagem de empresas
- Criação de novas empresas

## 🎨 Componentes Reutilizáveis

- **Button** - Botões com variantes (primary, secondary, danger, success)
- **Input** - Campo de entrada com validação
- **Select** - Campo de seleção
- **Modal** - Modal reutilizável
- **Table** - Tabela com headers e células
- **Loading** - Indicador de carregamento
- **Card** - Card para agrupar conteúdo
- **Pagination** - Componente de paginação

## 🔧 Configuração da API

A instância do Axios está configurada em `src/config/api.ts` com:

- Interceptor de requisição para adicionar token de autenticação
- Interceptor de resposta para tratar erros globais
- Configuração de timeout
- Headers padrão

## 📝 Validação de Formulários

Os formulários utilizam React Hook Form com Zod para validação:

- Validação em tempo real
- Mensagens de erro personalizadas
- Tipagem TypeScript completa

## 🎯 Rotas

- `/login` - Tela de login
- `/dashboard` - Dashboard principal
- `/customers` - Listagem de clientes
- `/customers/new` - Novo cliente
- `/customers/:id/edit` - Editar cliente
- `/orders` - Listagem de ordens
- `/orders/new` - Nova ordem
- `/orders/:id` - Detalhes da ordem
- `/orders/:id/edit` - Editar ordem
- `/payments` - Listagem de pagamentos
- `/payments/:orderId/new` - Novo pagamento
- `/enterprises` - Listagem de empresas

## 🚦 Estados de Carregamento

Todas as páginas implementam estados de carregamento durante requisições à API.

## ✅ Feedback ao Usuário

Sistema de toast notifications para feedback de ações:
- Sucesso (verde)
- Erro (vermelho)
- Aviso (laranja)
- Info (azul)

## 🔒 Autenticação

O sistema está preparado para autenticação via JWT. Quando implementado no backend, o token será automaticamente incluído nas requisições através do interceptor do Axios.

## 📱 Responsividade

O frontend é totalmente responsivo, utilizando Tailwind CSS para adaptação a diferentes tamanhos de tela.

## 🧪 Próximos Passos

- Implementar testes unitários
- Adicionar testes de integração
- Melhorar tratamento de erros
- Adicionar mais validações
- Implementar cache de dados
- Adicionar filtros avançados

