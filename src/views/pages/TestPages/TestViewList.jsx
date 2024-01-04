import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import ViewList from '../../Components/ViewPageList/ViewList';
import { getAllCustomers } from '../../../core/api/customer';
import ContainerPaper from '../../Components/Containers/ContainerPaper';
import { Button, Card } from '@mui/material';

function TestViewList() {
  const [selected, setSelected] = useState([]);

  const location = useLocation();
  const { pathname } = location;
  useEffect(() => {}, []);

  const rowJSX = data => {
    return (
      <Card>
        {data?.display_name}
        <Link to={pathname + '/' + data?.id}>View</Link>
      </Card>
    );
  };

  return (
    <ContainerPaper>
      <Box>
        {selected?.length > 0 && (
          <Button
            variant='contained'
            onClick={() => alert('delete : ' + selected)}
          >
            Bulk Delete
          </Button>
        )}

        <ViewList
          api={getAllCustomers}
          onSelect={setSelected}
          rowJSX={rowJSX}
        />
      </Box>
    </ContainerPaper>
  );
}

export default TestViewList;
