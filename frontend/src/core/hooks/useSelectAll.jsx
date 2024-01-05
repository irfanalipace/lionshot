import { useState } from "react";

const useSelectAll = (data) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row, index) => row?.id || index));
    }
  };

  const handleRowSelect = (rowIndex) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((row) => row !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  const isRowSelected = (rowIndex) => selectedRows.includes(rowIndex);

  return {
    selectedRows,
    handleSelectAll,
    handleRowSelect,
    isRowSelected,
  };
};

export default useSelectAll;
