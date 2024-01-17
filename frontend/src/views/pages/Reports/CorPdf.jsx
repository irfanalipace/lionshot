import { useRef } from "react";
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import { Typography, Grid, Box, Button } from "@mui/material";
import TemplateTable from "../../Components/ViewTemplate/TemplateTable";
import ViewTemplates from "../../Components/ViewTemplate/ViewTemplates";
import PdfReports from "../../Components/PdfReports/PdfReports";
import pdflogo from "../../../assets/images/pdf-logo.png";
import { Paper } from "@mui/material";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import PrintIcon from "@mui/icons-material/Print";
import MUIButton from "../../Components/Button/MUIButton";
import { useParams, useLocation } from "react-router-dom";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const CorPdf = () => {
  const inputRef = useRef(null);
  const { id } = useParams();
  const location = useLocation();

  // Access the data from the state
  const data = location.state?.data || {};

  //console.log(data,'HHHH')
  const printDocument = () => {
    html2canvas(inputRef.current, { scale: 1.2, quality: 4 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Set custom page size (in this example, 210mm x 297mm for A4)
        const pdf = new jsPDF({
          unit: "mm",
          format: [250, 350],
          orientation: "langscape",
        });

        // Add image to the PDF
        pdf.addImage(imgData, "JPEG", 0, 0);

        // Save the PDF with a custom name
        pdf.save("lionshot_report.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  return (
    <div>
      <HeaderPaper>
        <Grid item container>
          <Grid sm={6} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6">
              Inovice#: {data?.invoiceNumber}
              {/* Inovice# A12DE2 */}
            </Typography>
          </Grid>
          <Grid
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            onClick={printDocument}
          >
            <MUIButton>
              {" "}
              Print
              <PrintIcon />
            </MUIButton>
          </Grid>
        </Grid>
      </HeaderPaper>

      <Paper
        sx={{
          paddingLeft: "260px",
          paddingRight: "260px",
          paddingTop: "33px",
          paddingBottom: "12px",
        }}
      >
        <Box
          id="divToPrint"
          sx={{ width: "100%", height: "100%", boxShadow: 'unset !important' }}
          ref={inputRef}
        >
          <Grid sx={{ boxShadow: "0px 1px 1px 1px gray", padding: "30px" }}>
            <Box sx={{ textAlign: "center" }}>
              <img
                src={pdflogo}
                alt="text"
                style={{
                  height: "100px",
                  width: "270px",
                  marginBottom: "30px",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  textAlign: "center",
                  fontWeight: 500,
                  color: "black",
                  fontSize: "21px",
                }}
              >
                CERTIFICATE OF RECYCLING
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginBottom: "12px",
                  marginTop: "12px",
                  fontWeight: 500,
                  color: "black",
                  fontSize: "11px",
                }}
              >
                Lighting Resources LLC Certificates that the materials listed
                below have been received for recycling at the request of:
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: 500,
                  color: "black",
                  fontSize: "18px",
                }}
                variant="h6"
              >
                CITY OF {data?.addr1}
              </Typography>
              <Grid sx={6}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      marginTop: "14px",
                      /// marginLeft: "-317px",
                      marginBottom: "14px",
                      fontWeight: 500,
                      color: "black",
                      fontSize: "11px",
                    }}
                  >
                    The Materials listed below have been received for Recycling
                    form:
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    CITY OF {data?.addr1}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    CITY OF {`${data?.addr2 || "--"}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    CITY OF {data?.addr1}
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: "14px",
                      marginBottom: "14px",
                      fontSize: "11px",
                      fontWeight: "500",
                    }}
                    variant="body2"
                  >
                    Inovice #:{data?.invoiceNumber}
                  </Typography>
                </Box>
                <PdfReports data={data} />

                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "40px",
                    marginBottom: "40px",
                    fontSize: "11px",
                    fontWeight: "500",
                  }}
                >
                  Title Transfer to Lighting Resources. LLC upon acceptance of
                  the matrial. All matrial are transported by a licensed,
                  registered universal/hazardous waste hauler. Thank you for
                  safeguarding important natural resources while contributing to
                  the preservations of the enviroment.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "11px", fontWeight: "500" }}
                >
                  Processing Facility Name: {data?.location}
                </Typography>
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default CorPdf;
