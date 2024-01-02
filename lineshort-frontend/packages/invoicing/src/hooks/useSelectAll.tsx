import { useState } from 'react';

interface RowData {
  id: string | number;
  name: string;
  age: number;
  email: string;
  country: string;
}

const useSelectAll = (data: RowData[]) => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  console.log('selectedRows', selectedRows);

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row, index) => row.id || index));
    }
  };

  const handleRowSelect = (rowIndex: string | number) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter(row => row !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  const isRowSelected = (rowIndex: string | number) => selectedRows.includes(rowIndex);

  return {
    selectedRows,
    handleSelectAll,
    handleRowSelect,
    isRowSelected,
  };
};

export default useSelectAll;
