import { useEffect, useState } from 'react';
import DataTable from '../../../Components/DataTable/DataTable';
import { importEstimate, exportEstimate } from '../../../../core/api/estimate';
import { getAllBillsApi } from '../../../../core/api/bills';
import {
  extractNumberFromHash,
  generateEncryptedID
} from '../../../../core/utils/helpers';
import { Grid } from '@mui/material';

import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../../Components/Containers/TableGrid';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';

import SearchBox from '../../../Components/SearchDialogBox/SearchBox';
//import ViewBills from '';
import BillsHeader from '../Headers/BillsHeader';
import { initialColumns, collapsedColumns } from '../TableColumns';
import ActionHeader from '../Headers/ActionHeader';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
import { useLocation } from 'react-router-dom';
const ViewBills = lazy(() => import('../ViewBills/ViewBills'));

const BillsTable = () => {
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewBills, setViewBills] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [id, setId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const loc = useLocation();
  const hash = loc.hash;

  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
  };
  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setViewBills(true);
    } else {
      setViewBills(false);
    }
  }, [hash]);

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row?.id);
  };

  return (
    <>
      <Grid container>
        <TableGrid sm={viewBills ? 3.5 : 12}>
          <HeaderPaper>
            {selectedRows.length ? (
              <ActionHeader
                selectedRows={selectedRows}
                setRefresh={() => setRefresh(prev => prev + 1)}
              />
            ) : (
              <BillsHeader />
            )}
          </HeaderPaper>

          <SearchBox
            open={isExportDialogOpen}
            onClose={handleExportDialogClose}
          />

          <DataTableContainer>
            <DataTable
              columns={viewBills ? collapsedColumns : initialColumns}
              api={getAllBillsApi}
              setSelectedRows={setSelectedRows}
              refresh={refresh}
              onRowClick={handleRowClick}
              collapsed={viewBills}
              manualFilter
              enableRowSelection={false}
            />
          </DataTableContainer>
        </TableGrid>
        {viewBills && (
          <Grid sm={8.5}>
            <DetailViewContainer>
              <ViewBills
                id={id}
                setRefresh={setRefresh}
                setViewBills={setViewBills}
              />
            </DetailViewContainer>
          </Grid>
        )}
      </Grid>

      {/* delete confirmation box  */}

      <ImportFileModal
        isOpen={openImport}
        onClose={() => setOpenImport(false)}
        ImportTypeEnum={ImportTypeEnum}
        importApi={importEstimate}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportEstimate}
      />
    </>
  );
};

export default BillsTable;

const ImportTypeEnum = [
  {
    key: 'customers_import',
    label: 'Customer Complete Detail',
    filePath: '/files/sample_contacts_new'
  },
  {
    key: 'customers_contacts_persons_import',
    label: 'Customer' + 's Contact Persons',
    filePath: '/files/sample_contactpersons'
  }
];
