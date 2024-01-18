import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getViewInovice } from "../../../core/api/correports";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";

import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { Mail } from "@mui/icons-material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

// common
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import MUIButton from "../../Components/Button/MUIButton";
import DataTable from "../../Components/DataTable/DataTable";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu as DropDown } from "@mui/base/Menu";
import PrintIcon from "@mui/icons-material/Print";

import {
  bulkDeletePurchaseOrdersApi,
  exportPurchaseOrdersApi,
  getAllPurchaseordersApi,
  singleDeletePurchaseOrdersApi,
} from "../../../core/api/purchase";
import { getAllInvoiceDateCorApi } from "../../../core/api/correports";
import lazy from "components/LazyLoadWithRetry/LazyLoadWithRetry.jsx";
import {
  StatusColor,
  extractNumberFromHash,
  formatDate,
  formatDateToDDMMYYYY,
  generateEncryptedID,
  snakeCaseToPrettyText,
} from "../../../core/utils/helpers";
import ImportFileModal from "../../Components/ImportFileModal/ImportFileModal";
import ExportFileModal from "../../Components/ExportFileModal/ExportFileModal";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import DetailViewContainer from "../../Components/Containers/DetailViewContainer";
import notyf from "../../Components/NotificationMessage/notyfInstance";
import TableGrid from "../../Components/Containers/TableGrid";
import { Add } from "@mui/icons-material";
import { Close } from "@mui/icons-material";
import {
  StyledMenuItem,
  TriggerButton,
  headerMenuBox,
} from "./purchaseOrderStyles";
import { Delete, MailOutline } from "@mui/icons-material";
import DataTableContainer from "../../Components/Containers/DataTableContainer";
import { DownloadOutlined } from "@mui/icons-material";
import { Paper } from "@material-ui/core";
import DateRangeHeader from "../../Components/DateRangeHeader/DateRangeHeader";
const ViewPurchase = lazy(() => import("./ViewPurchase"));

const CorReport = () => {
  const theme = useTheme();

  const intialColumns = [
    {
      accessorKey: "invoiceId",
      header: "Invoice",
      Cell: ({ renderedCellValue, row }) => (
        <Typography variant="body2" color="primary">
          {renderedCellValue}
        </Typography>
      ),
    },

    {
      accessorKey: "actions",
      header: "Actions",
      enableColumnActions: false,
      enableColumnFilter: false,
      enableColumnOrdering: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <Button>
          {" "}
          <PrintIcon />
        </Button>
      ),
    },
  ];
  // console.log(wholedata?.invoiceNumber)
  const collapsedColumns = [
    {
      accessorKey: "actions",
      header: "",
      Cell: ({ row }) => {
        const wholedata = row?.original;
        // const customer = wholedata?.customer;
        const estStatusColor = StatusColor(wholedata.status, theme);

        return (
          <Box>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid item x={6}>
                {/* <Typography
                  component='span'
                  sx={{ fontSize: "12px", color: window.themeColors.primary }}>
                  {wholedata?.purchase_order_number}
                </Typography> */}
                <Grid container>
                  <Typography variant="subtitle2">
                    {wholedata?.invoiceId || "--"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      },
    },
  ];
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseDropdown, setPurchaseDropDown] =
    useState("All Purchase Order");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterMenu, setFilterMenu] = useState(null);

  const [columns, setColumns] = useState(intialColumns);
  const [viewPurchase, setPurchaseVw] = useState(false);
  const [id, setId] = useState(null);
  const hash = window.location.hash;
  const [dateBtn, setDateBtn] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const navigate = useNavigate();

  const [searchPram, setSearchPram] = useState({
    fromDate: formatDateToDDMMYYYY("2023-01-07"), // Set default value for fromDate
    toDate: formatDateToDDMMYYYY("2023-04-07"), // Set default value for toDate
  });

  //   view purchase
  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setColumns(collapsedColumns);
      setPurchaseVw(true);
    } else {
      setColumns(intialColumns);
      setPurchaseVw(false);
    }
  }, [hash]);

  const hidingMenu = () => {
    setFilterMenu(null);
  };

  const handleRowClick = (row) => {
    console.log('row', row)
    const getCurrentInvoiceNumber = row?.original?.internalId;

    if (getCurrentInvoiceNumber) {
      setInvoiceNumber(getCurrentInvoiceNumber.replace(/-/g, ""));
    }

    location.hash = "#/" + generateEncryptedID(row.id);
  };
  //   view menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuAnchorE2, setMenuAnchorE2] = useState(null);
  const [bulkActionOpen, setbulkActionOpen] = useState(null);

  const handleClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuAnchorE2(event.currentTarget);
  };
  const openBulk = (event) => {
    setbulkActionOpen(event.currentTarget);
  };
  const clickPurchase = (event) => {
    setMenuAnchorE2(event.currentTarget);
  };

  //   purchase filter
  const openPurchaseFilter = (e) => {
    if (selectedRows.length === 0) {
      setMenuAnchorEl(e.currentTarget);
    }
  };

  // bulk delete
  const handleBulkDelete = async () => {
    try {
      await bulkDeletePurchaseOrdersApi({ ids: selectedRows });
      notyf.success("Purchase Orders deleted Successfully");
      setRefresh((prev) => prev + 1);
    } catch (error) {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await getAllInvoiceDateCorApi(id);
      setRefresh((prev) => prev + 1);
      notyf.success("Purchase orders deleted successfully");
    } catch (error) {
      // notyf.error('Something went wrong');
    }
  };

  //   styles

  const headerIconButton = {
    backgroundColor: "#EEEEEE",
    border: "1px solid #d1d1d1",
    borderRadius: "8px",
    textTransform: "none",
    padding: "6px 16px",
  };

  const StyledListbox = styled("ul")(
    ({ theme }) => `
    font-family: roboto;
    font-size:18px,
    min-width: 100px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: white;
    box-shadow: 0px 4px 30px #d0d7de;
    z-index:1
    `
  );
  const handleSendEstimateMain = (e, id) => {
    e.stopPropagation();
    //navigate(`/send-email/price-quote/${id}`);
    navigate(`/send-email/price-quote/${generateEncryptedID(id)}`);

    //		closeMenu();
  };
  const isRowSelectable = (row) => {
    return row?.original?.status === "870319";
  };
  const Actions = ({ id, status }) => {
    return (
      <>
        {status === "draft" ? (
          <Box className="show-on-hover" sx={{ display: "none" }}>
            <Dropdown>
              <TriggerButton onClick={(e) => e.stopPropagation()}>
                <KeyboardArrowDown />
              </TriggerButton>
              <DropDown slots={{ listbox: StyledListbox }}>
                <StyledMenuItem
                  onClick={(e) => {
                    setOpenConfirmDialog(true); // Open the confirmation dialog
                    setDialogProps({
                      onConfirm: handleDelete(e, id),
                    });
                  }}
                >
                  <DeleteIcon /> Void
                </StyledMenuItem>
                <StyledMenuItem onClick={(e) => handleSendEstimateMain(e, id)}>
                  <MailOutline /> Send An Email
                </StyledMenuItem>
              </DropDown>
            </Dropdown>
          </Box>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Grid container>
        <TableGrid scrollable item sm={viewPurchase ? 3.5 : 12}>
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: "flex", alignItems: "center", paddingY: "1px" }}
            >
              <Grid item xs={8}>
                {selectedRows.length > 0 ? (
                  <Box sx={headerMenuBox}>
                    <Button
                      sx={headerIconButton}
                      onClick={() => {
                        setOpenConfirmDialog(true);
                        setDialogProps({
                          onConfirm: handleBulkDelete,
                        });
                      }}
                    >
                      <Delete /> {""}Void
                    </Button>
                  </Box>
                ) : (
                  <Dropdown>
                    <MenuButton
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                    >
                      <Typography
                        noWrap
                        variant="h6"
                        className="TextCapitalize"
                      >
                        Certifications of Recycling
                      </Typography>
                    </MenuButton>
                  </Dropdown>
                )}
              </Grid>
            </Grid>
          </HeaderPaper>
          <Paper>
            <DateRangeHeader
              dateBtn={dateBtn}
              setDateBtn={setDateBtn}
              setSearchPram={setSearchPram}
              searchPram={searchPram}
            />
          </Paper>
          <DataTableContainer>
            <DataTable
              columns={columns}
              api={getAllInvoiceDateCorApi}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              refresh={refresh}
              enableRowSelection={isRowSelectable}
              extraParams={searchPram}
              collapsed={viewPurchase}
            />
          </DataTableContainer>
        </TableGrid>

        {viewPurchase && (
          <Grid sm={8.5}>
            <DetailViewContainer>
              <ViewPurchase
                id={invoiceNumber}
                refreshList={() => setRefresh((prev) => prev + 1)}
                setPurchaseVw={setPurchaseVw}
              />
            </DetailViewContainer>
          </Grid>
        )}
      </Grid>

      <ConfirmDialog
        title="Are you sure you want to delete"
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />

      <ImportFileModal
        isOpen={openImport}
        onClose={() => setOpenImport(false)}
        // ImportTypeEnum={ImportTypeEnum}
        // importApi={importEstimate}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportPurchaseOrdersApi}
      />
    </>
  );
};

export default CorReport;
