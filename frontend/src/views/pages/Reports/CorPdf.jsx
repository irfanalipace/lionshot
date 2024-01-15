import { useRef } from "react";
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import { Typography, Grid, Box, Button } from "@mui/material";
import TemplateTable from "../../Components/ViewTemplate/TemplateTable";
import ViewTemplates from "../../Components/ViewTemplate/ViewTemplates";
import PdfReports from "../../Components/PdfReports/PdfReports";
import pdflogo from "../../../assets/images/pdf-logo.png"
import { Paper } from "@mui/material";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    
    
  }
});


const CorPdf = () => {
  const inputRef = useRef(null);
 

  // ...
  
  const printDocument = () => {
    html2canvas(inputRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      
      // Set custom page size (in this example, 210mm x 297mm for A4)
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  
      // Add image to the PDF
      pdf.addImage(imgData, "JPEG", 0, 0);
  
      // Save the PDF with a custom name
      pdf.save("download.pdf");
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  };
  
  
  return (
    <div >
      
       
      <HeaderPaper sx={{paddingLeft:'260px',paddingRight: '260px'}} >
      <Button onClick={printDocument}>Download</Button>
      <Paper sx={{paddingRight:'100px'}} >
      <Box id="divToPrint" ref={inputRef}>
          <Grid sx={{ boxShadow: "0px 1px 1px 1px gray", padding: "40px" }}>
          <Box sx={{textAlign:'center'}}>
            <img src={pdflogo} alt="text" style={{height:'100px', width:'308px', marginBottom:'23px'}}/>
        </Box>
            <Box>
              <Typography variant="h5" sx={{textAlign:'center'}}>Certificate Of Recycling</Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "12px", marginTop: "12px" }}
              >
                Lighting Resources LLC Certificate that the matrial listed below
                have been received at the request of:
              </Typography>
              <Typography  sx={{textAlign:'center', fontSize:'18px'}}>CITY OF WASHINGTON HHW</Typography>
             <Grid sx={6}>
             <Box>
              <Typography
                variant="body2"
                sx={{
                  marginTop: "12px",
                 /// marginLeft: "-317px",
                  marginBottom: "12px",
                }}
              >
                Matrial below have been received for Recycling form:
              </Typography>
            
              
                <Typography variant="body2">CITY OF WASHINGTON HHW</Typography>
                <Typography variant="body2">CITY OF WASHINGTON3</Typography>
                <Typography variant="body2">CITY OF WASHINGTON HHW</Typography>
                <Typography sx={{marginTop:'14px', marginBottom:'14px'}} variant="body2">Inovice #:53-1244</Typography>
                </Box>
             <PdfReports />

             <Typography variant="body2" sx={{marginTop:'30px', marginBottom:'40px'}}>
                Title Transfer to Lighting Resources. LLC upon acceptance of the matrial. All matrial are transported by a licensed, registered universal/hazardous waste
                hauler. Thank you for safeguarding important natural resources while contributing to the preservations of the enviroment. 
             </Typography>
             <Typography variant="body2">
               Processing Facility Name: 53 greenwood
             </Typography>
             </Grid>
            </Box>
          </Grid>
        
        </Box>
      </Paper>
      
      </HeaderPaper>
    </div>
  );
};

export default CorPdf;





