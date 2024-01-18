import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    boxShadow: "none",
    minHeight: '100vh'
  },
  table: {
    minWidth: 700,
  },
  tableCell: {
    //  border: '1px solid black',
    // padding:'6px',
    width: "40%",
  },
});

let id = 0;
function createData(srno, item, quantity) {
  id += 1;
  return { srno, item, quantity };
}

const rows = [
  createData("1", "4FT FLUORESCENT LAMPS", 6.0, 24, 4.0),
  createData("2", "4FT FLUORESCENT LAMPS", 9.0, 37, 4.3),
  createData("3", "4FT FLUORESCENT LAMPS", 16.0, 24, 6.0),
];

function SimpleTable(props) {
  const { classes, data } = props;
  const itemsArray = data?.itemsArray || [];
  //console.log(data?.itemsArray,'JJJJJJ')
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Sr#</TableCell>
            <TableCell align="left">Item</TableCell>
            <TableCell align="left">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemsArray.map((item, index) => (
            <TableRow key={index + 1}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="left">{item.itemName}</TableCell>
              <TableCell align="left">{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
