import { Paper } from "@mui/material";
import React from "react";

function ContainerPaper({ children }) {
	return <Paper sx={{ p: "1.3rem 0 0 1.3rem", my: "10px" }}>{children}</Paper>;
}

export default ContainerPaper;
