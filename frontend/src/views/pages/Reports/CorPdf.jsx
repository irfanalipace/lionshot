import React from "react";
import HeaderPaper from "../../Components/Containers/HeaderPaper";
import { Typography, Grid, Box } from "@mui/material";
import TemplateTable from "../../Components/ViewTemplate/TemplateTable";
import ViewTemplates from "../../Components/ViewTemplate/ViewTemplates";
import PdfReports from "../../Components/PdfReports/PdfReports";
import pdflogo from "../../../assets/images/pdf-logo.png"

const CorPdf = () => {
  return (
    <div>
      <HeaderPaper sx={{paddingLeft:'260px',paddingRight: '260px'}}>
       
        <Box>
          <Grid sx={{ boxShadow: "0px 1px 1px 1px gray", padding: "44px" }}>
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
      </HeaderPaper>
    </div>
  );
};

export default CorPdf;





