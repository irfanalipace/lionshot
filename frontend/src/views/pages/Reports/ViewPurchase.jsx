import React, { useEffect, useState } from "react";
import vector from "../../../../src/assets/images/Vector.png";

import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
// mui components  && icon
import { Grid, Stack, Typography } from "@mui/material";
// components
// common components
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
// styles
import PrintIcon from "@mui/icons-material/Print";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useNavigate } from "react-router-dom";
import MUIButton from "../../Components/Button/MUIButton";
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import notyf from "../../Components/NotificationMessage/notyfInstance";
import AttachmentCard from "../../Components/FileUpload/AttachmentCard";
import ViewTemplates from "../../Components/ViewTemplate/ViewTemplates";
import TableAccordian from "../../Components/TableAccordian/TableAccordian";

import {
  addPurchaseOrdersFileApi,
  convertToBillPurcahseOrderApi,
  deletePurchaseOrdersFielsApi,
  purchaseOrdersPdfUrl,
  purchaseOrdersSingleApi,
  singleDeletePurchaseOrdersApi,
} from "../../../core/api/purchase";
import {
  decryptId,
  formatDate,
  snakeCaseToPrettyText,
} from "../../../core/utils/helpers";
import { useTheme } from "@mui/material/styles";
import OverlayLoader from "../../Components/OverlayLoader/OverlayLoader";
import { HighlightOffRounded } from "@mui/icons-material";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import { getViewInovice } from "../../../core/api/correports";

const ViewPurchase = ({ id, refreshList }) => {
  const navigate = useNavigate();
  const purchaseID = id;
  const [purchaseOrderData, setPurchaseOrdersData] = useState();
  const [showMenuItem, setShowMenu] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [files, setFiles] = useState([]);
  const [bills, setBills] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [vWLoader, setVwLoader] = useState(false);
  const [contacts, setContacts] = useState([]);
  const showingMenu = (event) => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  useEffect(() => {
    fetchingSinglePurchase();
  }, [purchaseID]);

  const submitFilesToApi = (newFiles) => {
    return addPurchaseOrdersFileApi({
      attachments: newFiles,
      purchase_order_id: purchaseID,
    });
  };

  const deleteFile = (id) => {
    return deletePurchaseOrdersFielsApi(id);
  };

  const fetchingSinglePurchase = async () => {
    try {
      setVwLoader(true);
      const resp = await getViewInovice(purchaseID);

      setPurchaseOrdersData(resp);
      //console.log("response data", resp?.addr1)
      //  setBills(resp?.bill);
    } catch (error) {
      navigate("/cor");
    } finally {
      setVwLoader(false);
    }
  };

  // main page open
  const handlePurchaseMail = (id) => {
    // navigate(`/send-email/purchase_order/${id}/`);
    navigate(`/send-email/purchase_order/${id}/`, {
      state: {
        contacts,
      },
    });
  };

  const handlePdf = async () => {
    try {
      const resp = await purchaseOrdersPdfUrl({
        id: purchaseID,
      });
      window.open(resp?.data, "_blank");
    } catch (error) {}
  };

  const columns = [
    { id: "", label: "No.", key: "index" },
    { id: "", label: "Items Description", key: "item_name" },
    { id: "", label: "Qty", key: "quantity" },
    { id: "", label: "Rate(USD)", key: "rate" },
    { id: "", label: "Amount(USD)", key: "total" },
  ];

  const info = [
    {
      label: "Purchase Order:",
      value: purchaseOrderData?.purchase_order_number,
    },
    {
      label: "Purchase Order Date:",
      value:
        purchaseOrderData?.purchase_order_date &&
        formatDate(purchaseOrderData?.purchase_order_date),
    },
    {
      label: "Terms:",
      value: purchaseOrderData?.term?.term_name,
    },
    {
      label: "Payment Mode:",
      value: snakeCaseToPrettyText(purchaseOrderData?.mode_of_payment_value),
    },
    {
      label: "Delivery Term:",
      value: "Fedex",
    },
  ];

  if (purchaseOrderData?.invoice_ref_number) {
    info.splice(2, 0, {
      label: "Invoice Ref#:",
      value: purchaseOrderData?.invoice_ref_number,
    });
  }

  const headings = {
    first: "Vendor Address",
    second: "Deliver To",
  };

  //   bill to
  const tbCols = [
    { id: "", label: "No.", key: "index" },

    { id: "", label: "Bill", key: "bill_number" },
    { id: "", label: "Date", key: "bill_date" },
    { id: "", label: "Due Date", key: "due_date" },
    { id: "", label: "Status", key: "status" },
    { id: "", label: "Amount", key: "total" },
    {
      id: "",
      label: "Balance Due",
      key: "due_amount",
      value: `$${purchaseOrderData?.bill?.due_amount}`,
    },
  ];

  const convertToBill = async () => {
    try {
      setBtnLoading(true);
      await convertToBillPurcahseOrderApi(purchaseID);
      notyf.success("Purchase Order converted to bill Successfully");
      navigate("/bills");
      if (typeof refreshList === "function") refreshList();
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  };

  const handleVoid = async () => {
    try {
      if (purchaseID) {
        const res = await singleDeletePurchaseOrdersApi(purchaseID);
        navigate("/cor");
        refreshList();
        notyf.success("Status Successfully changed to Void");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleNavigate = (id, data) => {
    // Navigate to the target component with the ID and data
    navigate(`/cor-pdf/${id}`, { state: { data } });
  };
  return (
    <Box sx={{ padding: "0 1rem", position: "relative" }}>
      <OverlayLoader open={vWLoader} />
      <HeaderPaper>
        <Grid item container>
          {/* view header left  */}
          <Grid sm={6} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6">
              Inovice#: {purchaseOrderData?.invoiceNumber}
              {/* Inovice# A12DE2 */}
            </Typography>
          </Grid>
          {/* view header right  */}
          <Grid
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <MUIButton onClick={() => handleNavigate(id, purchaseOrderData)}>
              {/* <Add fontSize='small' />
                      // {!viewPurchase && 'New'} */}
              <PrintIcon /> Print
            </MUIButton>
            <IconButton
              onClick={() => {
                navigate("/cor");
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>

      <Paper sx={{ height: "100%" }}>
        <Box mb={3} paddingX={2} paddingY={1}>
          <ViewTemplates
            title="Purchase Order"
            itemsColumns={columns}
            headerInfo={info}
            data={purchaseOrderData}
            apiData={purchaseOrderData}
            headings={headings}
            addressData={{
              default_billing_address:
                purchaseOrderData?.vendor?.default_billing_address,
              default_shipping_address: purchaseOrderData?.customer_address,
            }}
            showShippingCharges={false}
            termsAndConditions={purchaseOrderData?.terms_and_condition}
            organizationAddress={
              purchaseOrderData?.deliver_type === "organization"
            }
          />
        </Box>
      </Paper>
      <ConfirmDialog
        title="Are you sure you want to update the status to void"
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </Box>
  );
};

export default ViewPurchase;

const BtnStyles = {
  margin: "0 .2rem",
};
