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
  itensProdutos,
} from "../../mock";
import { useEffect, useState } from "react";
import styles from "./container.module.css";

export function Container() {
  const [isModal, setIsModal] = useState(false);
  const [idClient, setIdClient] = useState(1);
  const [selectedItem, setSelectedItem] = useState({} as IItensProdutos);
  const [orderItem, setOrderItem] = useState({} as IItemPedido);
  const [itemPedidoFinal, setItemPedidoFinal] = useState({
    id_cli: String(idClient),
    preco_pedido: 0,
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

    setIdClient((prev) => prev + 1);

    setItemPedidoFinal({
      id_cli: String(idClient + 1),
      preco_pedido: 0,
      itens: [] as IItemPedidoFinal[],
    } as IPedidoFinal);

    setListOrderItem([] as IItemPedido[]);
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
          preco_pedido: listOrderItem.reduce((total, item) => {
            const price = Number(item.price);

            return total + price;
          }, 0),
          itens: listOrderItem.map((itemProd, index) => {
            return {
              ID_PRODUTO: idClient + index,
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
        console.log(data);
      });
  }, []);

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
              Pedido: {idClient + 200}
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
                  Total: {itemPedidoFinal.preco_pedido.toFixed(3)}
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
