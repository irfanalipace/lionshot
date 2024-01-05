
import { Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import HeaderPaper from "../../../Components/Containers/HeaderPaper";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { PriceListForm } from "./PriceListForm";
function PriceListNew({title}) {
    console.log(title,'title')
    const navigate = useNavigate();
    return (
        <Grid container>
            <Grid item sm={12}>
                <HeaderPaper>
                    <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                        <Grid item xs={6}>
                            <Typography variant="h6" className="TextCapitalize">
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: "right" }}>
                            <IconButton
                                onClick={() => navigate("/price-lists")}
                                aria-label="delete"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </HeaderPaper>
                <PriceListForm />
            </Grid>
        </Grid>
    )
}
export default PriceListNew;