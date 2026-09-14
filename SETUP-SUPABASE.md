# 🗄️ Como Configurar o Supabase

## PASSO 1: Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub ou e-mail

---

## PASSO 2: Criar um Novo Projeto

1. Clique em **"New Project"**
2. Preencha:
   - **Name**: controle-oficina
   - **Database Password**: escolha uma senha forte (guarde ela!)
   - **Region**: South America (São Paulo)
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos (o projeto está sendo criado)

---

## PASSO 3: Criar a Tabela

1. No menu lateral, clique em **"Table Editor"**
2. Clique em **"Create a new table"**
3. Preencha:
   - **Name**: `vehicles`
   - Marque: ✅ **Enable Row Level Security (RLS)**

4. Adicione as colunas:

| Nome | Tipo | Default Value | Opcional |
|------|------|---------------|----------|
| id | int8 | (auto) | NÃO |
| created_at | timestamptz | now() | NÃO |
| modelo | text | - | NÃO |
| placa | text | - | NÃO |
| oficina | text | - | NÃO |
| numeroOS | text | - | SIM |
| problema | text | - | NÃO |
| valorOrcamento | text | - | SIM |
| previsaoSaida | date | - | SIM |
| status | text | - | NÃO |

5. Clique em **"Save"**

---

## PASSO 4: Configurar Permissões (RLS)

1. No menu lateral, clique em **"Authentication"** → **"Policies"**
2. Selecione a tabela **"vehicles"**
3. Clique em **"New Policy"**
4. Escolha **"Create a policy from scratch"**
5. Preencha:
   - **Policy name**: Acesso público
   - **Allowed operation**: ALL
   - **Target roles**: anon
   - **USING expression**: `true`
   - **WITH CHECK expression**: `true`
6. Clique em **"Review"** → **"Save policy"**

---

## PASSO 5: Pegar as Credenciais

1. No menu lateral, clique em **"Settings"** → **"API"**
2. Copie:
   - **Project URL** (ex: https://abc123.supabase.co)
   - **anon public key** (começa com eyJ...)

---

## PASSO 6: Atualizar o Código

✅ **JÁ CONFIGURADO!**

As credenciais já foram atualizadas no arquivo **script.js**:

```javascript
const SUPABASE_URL = 'https://zxutjfknblwozwuzzoxj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Id6DFwyts6XvdS07L5Sbxw_l160HMJ8';
```

---

## PASSO 7: Enviar para o GitHub

```bash
git add .
git commit -m "Integrado Supabase para dados compartilhados"
git push
```

---

## ✅ Pronto!

Agora todos que acessarem o link verão os mesmos veículos! 🎉

---

## 🆘 Problemas?

Se aparecer erro "Failed to fetch":
1. Verifique se copiou corretamente a URL e a KEY
2. Verifique se criou a política de RLS corretamente
3. Me chame novamente! 🚀
