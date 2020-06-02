// modificando o funcionamento do express para ter o envio do user
// basicamente adicionando o objeto user no express, visto que por padrão, ele não existe
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
