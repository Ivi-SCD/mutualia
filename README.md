# ReciLoop - Plataforma B2B para Economia Circular

## 📋 Visão Geral

ReciLoop é uma plataforma inovadora que conecta empresas do Complexo Portuário de Suape para promover economia circular através do matching inteligente de resíduos industriais. O que é descarte para uma empresa pode ser matéria-prima valiosa para outra.

### 🏭 Empresas Participantes

O Complexo de Suape conta com 86 empresas instaladas. Nosso mockup inclui algumas das principais:

- **Refinaria Abreu e Lima**: Joint venture Petrobras-PDVSA, processa 230 mil barris/dia
- **Cimpor Suape**: Fábrica de cimento com capacidade de 1,6 milhão ton/ano
- **PetroquímicaSuape**: Produz PTA (ácido tereftálico purificado) e PET
- **Bunge Alimentos**: Processamento de grãos e produção de óleos
- **Estaleiro Atlântico Sul**: Um dos maiores estaleiros do Hemisfério Sul
- **Termopernambuco**: Usina termelétrica de 520 MW
- **White Martins**: Produção de gases industriais
- **Mossi & Ghisolfi**: Produção de resinas PET

### 🎯 Principais Funcionalidades

- **Matching com IA**: Algoritmo inteligente que conecta geradores e consumidores de resíduos
- **Dashboard Analytics**: Visualização de economia, CO₂ evitado e métricas ESG
- **Calculadora de ROI**: Análise financeira detalhada das oportunidades
- **Inventário em Tempo Real**: Monitoramento de resíduos disponíveis
- **Ranking ESG**: Score de circularização das empresas participantes

## 🚀 Setup Rápido

### Opção 1: Setup Manual

#### Pré-requisitos

- Python 3.8+
- Node.js 16+
- npm ou yarn

#### Backend (FastAPI)

1. **Clone o repositório e navegue até a pasta do backend:**
```bash
cd reciloop
cd backend
```

2. **Crie e ative um ambiente virtual:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

4. **Crie o arquivo `main.py` com o código do backend fornecido**

5. **Execute o servidor:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em: `http://localhost:8000`

#### Frontend (React/Next.js)

1. **Em outro terminal, crie a aplicação Next.js:**
```bash
cd .. # Volte para a pasta reciloop
cd frontend
```

2. **Instale as dependências adicionais:**
```bash
npm i
```

3. **Execute o frontend:**
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 🔐 Credenciais de Teste

Use as seguintes credenciais para testar a aplicação:

- **Refinaria Abreu e Lima (Geradora)**
  - Email: refinaria@example.com
  - Senha: senha

- **Cimpor Suape (Consumidora)**
  - Email: cimpor@example.com
  - Senha: senha

- **PetroquímicaSuape (Ambas)**
  - Email: petroquimica@example.com
  - Senha: senha

- **Bunge Alimentos (Ambas)**
  - Email: bunge@example.com
  - Senha: senha

## 📊 Algoritmo de Matching

O score de compatibilidade é calculado com base em:

- **40%** - Compatibilidade Química
- **30%** - Proximidade Geográfica
- **30%** - Viabilidade Econômica

## 🐳 Deploy com Docker

### Arquivos Docker Necessários

#### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

#### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Para Produção

Para deploy em produção, use imagens otimizadas:

1. **Multi-stage builds** para reduzir tamanho
2. **Usuário não-root** para segurança
3. **Sem hot-reload** em produção
4. **Nginx** como reverse proxy
5. **PostgreSQL** para persistência
6. **Redis** para cache e sessões

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Porta já em uso
```bash
# Linux/Mac
sudo lsof -i :8000  # Verifica qual processo está usando a porta
sudo kill -9 PID    # Mata o processo

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

#### 2. Erro de CORS
Certifique-se de que o `NEXT_PUBLIC_API_URL` está correto no frontend:
- Desenvolvimento: `http://localhost:8000`
- Produção: URL do seu backend


### Empresas Reais de Suape:

A plataforma agora inclui empresas reais do complexo industrial, com resíduos específicos de cada setor:
- Borra oleosa da refinaria
- Catalisadores de FCC
- Resíduos de PET da petroquímica
- Óleo vegetal usado da Bunge
- Sucata metálica do estaleiro
- Cinzas da termelétrica
- CO₂ capturado da White Martins

### Dockerfiles Otimizados:

Os Dockerfiles foram ajustados para:
- **Desenvolvimento**: Com hot-reload habilitado (`--reload`)
- **Produção**: Sem reload, com múltiplos workers e usuário não-root
- **Cache otimizado**: Copia requirements primeiro para melhor cache de camadas
- **Python 3.11**: Versão mais recente e performática
- **Slim images**: Reduz tamanho final das imagens

## 🛠️ Estrutura do Projeto

```
reciloop/
├── backend/
│   ├── api/
│   │   ├── auth.py           # Rota Autenticação
│   │   ├── companies.py      # Rota verificar empresas
│   │   ├── dashboard.py      # Rota de dashboard
│   │   ├── esg.py            # Rota de ranking ESG
│   │   ├── inventory.py      # Rota de inventário em tempo real
│   │   ├── matches.py        # Rota dos "matches"
│   │   ├── roi.py            # Rota de cálculo de ROI
│   │   ├── wastes.py         # Rota de economias CO²
│   ├── core/                 # Configuração JWT
│   │   ├── password.py       
│   │   ├── security.py
│   ├── data/                 # Dados Mockados
│   │   ├── companies.py
│   │   ├── matches.py
│   │   ├── users.py
│   │   ├── wastes.py         
│   ├── models/
│   │   ├── schema.py         # Schemas das bases
│   ├── services/              
│   │   ├── matching.py       # Algoritmo de Matching
│   │   ├── roi.py            # Cálculo ROI
│   ├── main.py               # API FastAPI
│   ├── requirements.txt      # Dependências Python
│   ├── Dockerfile            # Imagem Docker dev
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Aplicação React
│   │   └── globals.css       # Estilos Tailwind
│   ├── package.json
│   ├── Dockerfile            # Imagem Docker dev
└── README.md
```

## 📈 Próximos Passos

1. **Banco de Dados**: Migrar de dados mockados para PostgreSQL
2. **Autenticação**: Implementar OAuth2 com refresh tokens
3. **WebSockets**: Atualizações em tempo real para o inventário
4. **Machine Learning**: Aprimorar algoritmo de matching com histórico
5. **Integração**: APIs com sistemas ERP das empresas
6. **Blockchain**: Certificados de economia circular

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request


## 📞 Contato

ReciLoop - Transformando resíduos em recursos no Complexo de Suape

Website: [www.reciloop.com.br](https://www.reciloop.com.br)
Email: contato@reciloop.com.br

## ✅ Verificação da Instalação

Para verificar se tudo está funcionando corretamente:

1. **Backend Health Check**:
```bash
curl http://localhost:8000/
# Deve retornar: {"message":"ReciLoop API - Economia Circular em Suape"}
```
2. **Frontend**:
   - Acesse http://localhost:3000
   - Você deve ver a tela de login do ReciLoop
