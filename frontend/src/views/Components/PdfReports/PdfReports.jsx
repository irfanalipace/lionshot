import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    
  
  },
  table: {
    minWidth: 400,
  },
  tableCell: {
    border: '1px solid black',
    padding:'6px',
    width:'90%'
  },
});

let id = 0;
function createData(name, quantity) {
  id += 1;
  return { id, name, quantity };
}

const rows = [
  createData('Frozen yoghurt', 24),
  createData('Ice cream sandwich', 37),
  createData('Eclair', 24),
  createData('Cupcake', 67),
  createData('Gingerbread', 49),
];

function PdfReports(props) {
  const { classes } = props;

  return (
    
    <Box className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>Item</TableCell>
            <TableCell align="right" className={classes.tableCell}>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id} style={{ borderBottom: '1px solid #c0bfbf' }}>
              <TableCell component="th" scope="row" className={classes.tableCell}>
                {row.name}
              </TableCell>
              <TableCell align="right" className={classes.tableCell}>{row.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

PdfReports.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PdfReports);
