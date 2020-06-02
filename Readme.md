## Dependencias

  - uuidv4 -> Geração de id único;
  - date-fns -> Manipulação e validação de datas;
  - typeorm -> Controle do bd;
  - reflect-metadata;
  - pg (postgres) -> DB;
  - bcryptjs -> Criptografia de senha;
  - jsonwebtoken -> Geração de token;
  - multer -> Upload de arquivos;
  - express-async-erros -> Pacote p/tratamento de erros no express em funções assincronas;
  - tsconfig-paths (desenvolvimento) -> Para entendimento dos '@' nos imports;
  - tsyring -> Injeção de dependências;
  - mongodb
  - celebrate -> Validação de campos/dados -> Adicionar a tipagem '@types/hapi__joi'
  - dotenv -> Configuração de variáveis ambientes
  - class-transformer -> Tranforma alguns dados da classe antes de serem exibidos no json
  - aws-sdk -> Envio de e-mail (SES)
  - ioredis -> Redis bd
  - rate-limiter-flexible -> Limita o número de requisições por um único ip (camada de segurança)
  - redis -> armazenamento de ips que tentam acessar nossa API
  - mime -> Usado para pegar o tipo da imagem (jpg, png, gif)


## Testes

  - jest -D -> Inicia-se como o eslint (yarn jest --init);
  - @types/jest -D;
  - ts-jest -D -> P/ escrever os testes em typescript;

## Envio de emails p/ ambiente de desenvolvimento

  - nodemailer -> SMTP p/ ambientes de desenvolvimento
  - handlebars -> Template Engines (template de email)



# Validar

[x] - dar um yarn typeorm migration:run
[x] - dar um yarn test
[x] - Envio de email
[x] - tentar alterar nome
[x] - tentar alterar nome e email
[x] - tentar alterar senha (passando o old_passord e não passando)
[x] - Listagem de provider (não deve trazer o provider logado)
[x] - agendamento
[x] - Criar mongo no docker -> docker run --name mongodb -p 27017:27017 -d -t mongo
[x] - Conectando mongo no compass -> mongodb://localhost:27017 ou mongodb://192.168.99.102:27017
[ ] - Envio de e-mail
[ ] - Alterar a variavel ambiente do envio de email
[ ] - Criar redis no docker -> docker run --name redis -p 6379:6379 -d -t redis:alpine
[ ] - Testar números de requisições -> alterar o duration do middleware rateLimiter
[ ] -
[ ] -
[ ] -
