import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  IItemPedido,
  IItemPedidoFinal,
  IItensProdutos,
  IPedidoFinal,
} from "../../mock";
import { useEffect, useState } from "react";
import styles from "./container.module.css";

export function Container() {
  const [isModal, setIsModal] = useState(false);
  const [idClient, setIdClient] = useState(1);
  const [idPedido, setIdPedido] = useState(0);

  const [selectedItem, setSelectedItem] = useState({} as IItensProdutos);
  const [orderItem, setOrderItem] = useState({} as IItemPedido);
  const [itensProdutos, setItensProdutos] = useState([] as IItensProdutos[]);
  const [itemPedidoFinal, setItemPedidoFinal] = useState({
    ID_CLI: idClient,
    PRECO_PEDIDO: 0,
    itens: [] as IItemPedidoFinal[],
  } as IPedidoFinal);
  const [listOrderItem, setListOrderItem] = useState([] as IItemPedido[]);
  const [messageError, setMessageError] = useState({
    error: false,
    helperText: "",
  });

  function handleIsModal() {
    setIsModal((prev) => !prev);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOnChangeOrderItem(e: any) {
    setOrderItem(() => {
      return {
        name: selectedItem.DESCRICAO,
        amount: e.target.value,
        price: selectedItem.PRECO,
      };
    });
  }

  function addItemInListOrder() {
    if (
      Number(orderItem.amount) <= 0 ||
      Number(orderItem.amount) > Number(selectedItem.QTDESTOQUE)
    ) {
      setMessageError({
        error: true,
        helperText:
          Number(orderItem.amount) <= 0
            ? "Precisa ser maior que zero"
            : "Quantidade indisponível no estoque.",
      });
    } else {
      setMessageError({
        error: false,
        helperText: "",
      });

      setListOrderItem((prev) => {
        const hasObjectInList = prev.find((obj) => obj.name === orderItem.name);

        if (hasObjectInList) {
          return prev.map((obj) =>
            obj.name === orderItem.name
              ? {
                  ...obj,
                  amount: String(Number(obj.amount) + Number(orderItem.amount)),
                  price: String(
                    (
                      (Number(obj.amount) + Number(orderItem.amount)) *
                      Number(orderItem.price)
                    ).toFixed(3)
                  ),
                }
              : obj
          );
        } else {
          return [
            ...prev,
            {
              ...orderItem,
              price: String(
                (Number(orderItem.amount) * Number(orderItem.price)).toFixed(3)
              ),
            },
          ];
        }
      });
      setSelectedItem({} as IItensProdutos);
      setOrderItem({} as IItemPedido);

      handleIsModal();
    }
  }

  function handleOnClickFinishOrder() {
    console.log(itemPedidoFinal);

    fetch("http://localhost:9000/pedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemPedidoFinal),
    })
      .then((response) => {
        console.log(response);
        setIdClient((prev) => prev + 1);

        setItemPedidoFinal({
          ID_CLI: idClient + 1,
          PRECO_PEDIDO: 0,
          itens: [] as IItemPedidoFinal[],
        } as IPedidoFinal);

        setListOrderItem([] as IItemPedido[]);
      })
      .catch((error) => console.log(error));
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    if (listOrderItem.length > 0) {
      setItemPedidoFinal((prev) => {
        return {
          ...prev,
          PRECO_PEDIDO: listOrderItem.reduce((total, item) => {
            const price = Number(item.price);

            return total + price;
          }, 0),
          itens: listOrderItem.map((itemProd) => {
            const idProdutoResults = itensProdutos.find(
              (prod) => prod.DESCRICAO === itemProd.name
            );

            return {
              ID_PRODUTO: idProdutoResults ? Number(idProdutoResults.ID) : 0,
              QUANTIDADE: Number(itemProd.amount),
            };
          }),
        };
      });
    }
  }, [listOrderItem, idClient]);

  useEffect(() => {
    fetch("http://localhost:9000/produtos/")
      .then((response) => response.json())
      .then((data) => {
        setItensProdutos(data);
      });
  }, [idClient]);

  useEffect(() => {
    fetch("http://localhost:9000/pedido/")
      .then((response) => response.json())
      .then((data) => {
        setIdPedido(data.length);
      });
  }, [idPedido, idClient]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "60px" }}>Pedido</h1>
      <div className={styles.divContainer}>
        <div className={styles.divTable}>
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">DESCRIÇÃO</TableCell>
                    <TableCell align="right">QTD. ESTOQUE</TableCell>
                    <TableCell align="right">PREÇO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itensProdutos.map((row) => (
                    <TableRow
                      key={row.ID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.ID}
                      </TableCell>
                      <TableCell align="right">{row.DESCRICAO}</TableCell>
                      <TableCell align="right">{row.QTDESTOQUE}</TableCell>
                      <TableCell align="right">{row.PRECO}</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => {
                            handleIsModal();
                            setSelectedItem(row);
                          }}
                        >
                          <AddIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Modal
            open={isModal}
            onClose={handleIsModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography
                sx={{ textAlign: "center", marginBottom: "20px" }}
                variant="h6"
                component="h2"
              >
                Selecione a Quantidade do item
              </Typography>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                gap={"5px"}
                alignItems={"center"}
                marginBottom={"20px"}
              >
                <Typography variant="h6" component="h2">
                  ITEM: {selectedItem.DESCRICAO}
                </Typography>
                <TextField
                  onChange={(e) => handleOnChangeOrderItem(e)}
                  type="number"
                  sx={{ width: "200px" }}
                  error={messageError.error}
                  helperText={messageError.helperText}
                />
              </Box>
              <Box display={"flex"} justifyContent={"center"}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItemInListOrder();
                  }}
                >
                  Incluir no pedido
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>

        <div className={styles.divPedido}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"start"}
            border={"1px solid #292929"}
            padding={"20px"}
            gap={"10px"}
          >
            <Typography variant="h6" component="h2">
              Pedido: {idPedido + 1}
            </Typography>
            <Typography variant="h6" component="h2">
              Cliente: Casas Ferramentas
            </Typography>
            <Typography variant="h6" component="h2">
              Forma de Pagamento: Boleto
            </Typography>

            <Box
              marginTop={"20px"}
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
              alignItems={"center"}
              width={"100%"}
              border={"1px solid #292929"}
              padding={"15px 0px"}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Itens do Pedido
              </Typography>

              {listOrderItem.map((item, index) => {
                return (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    padding={"3px 0px"}
                    key={index}
                    width={"70%"}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ minWidth: "120px" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ minWidth: "30px" }}
                    >
                      {item.amount}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ textAlign: "center", minWidth: "50px" }}
                    >
                      {item.price}
                    </Typography>
                  </Box>
                );
              })}

              <Box width={"70%"} marginTop={"20px"}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ textAlign: "right" }}
                >
                  Total: {itemPedidoFinal.PRECO_PEDIDO.toFixed(3)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{ width: "90%", marginTop: "40px" }}
                onClick={handleOnClickFinishOrder}
              >
                Realizar Pedido
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}
