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
import { IItemPedido, IItensProdutos, itensProdutos } from "../../mock";
import { useState } from "react";

export function Container() {
  const [isModal, setIsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({} as IItensProdutos);
  const [orderItem, setOrderItem] = useState({} as IItemPedido);
  const [listOrderItem, setListOrderItem] = useState([] as IItemPedido[]);

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
    setListOrderItem((prev) => {
      const hasObjectInList = prev.find((obj) => obj.name === orderItem.name);

      if (hasObjectInList) {
        return prev.map((obj) =>
          obj.name === orderItem.name
            ? {
                ...obj,
                amount: String(Number(obj.amount) + Number(orderItem.amount)),
                price: String(
                  (Number(obj.amount) + Number(orderItem.amount)) *
                    Number(orderItem.price)
                ),
              }
            : obj
        );
      } else {
        return [...prev, orderItem];
      }
    });
    setSelectedItem({} as IItensProdutos);
    setOrderItem({} as IItemPedido);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "60px" }}>Pedido</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
        <div style={{ width: "60%", height: "100%" }}>
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
                  sx={{ width: "100px" }}
                />
              </Box>
              <Box display={"flex"} justifyContent={"center"}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItemInListOrder();
                    handleIsModal();
                  }}
                >
                  Incluir no pedido
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>

        <div style={{ width: "40%" }}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"start"}
            border={"1px solid #292929"}
            padding={"20px"}
            gap={"10px"}
          >
            <Typography variant="h6" component="h2">
              Pedido: 321434
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

              <Button
                variant="contained"
                sx={{ width: "90%", marginTop: "40px" }}
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
