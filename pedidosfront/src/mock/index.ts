export interface IItensProdutos {
  ID: string;
  DESCRICAO: string;
  QTDESTOQUE: string;
  PRECO: string;
}
export interface IItemPedido {
  name: string;
  amount: string;
  price: string;
}

export const itensProdutos = [
  {
    ID: "1",
    DESCRICAO: "BOLA",
    QTDESTOQUE: "2",
    PRECO: "15.99",
  },
  {
    ID: "2",
    DESCRICAO: "LAPIS",
    QTDESTOQUE: "23",
    PRECO: "2.99",
  },
  {
    ID: "3",
    DESCRICAO: "Guilherme",
    QTDESTOQUE: "-1",
    PRECO: "2.55",
  },
];