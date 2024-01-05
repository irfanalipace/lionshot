import React from 'react';
import Dialog from '../Modal/Dialog';
import ImportFileBody from './importFIleBody';

const ImportFileModal = ({
  isOpen, // A boolean indicating whether the import modal is open.
  onClose, // A function to control the open/close state of the modal.
  importApi, // The API function to call when importing a file.
  ImportTypeEnum = [], // An array of possible import types, e.g., [ 'CSV', 'Excel' ].
  setRefresh
}) => {
  // console.log('setRefresh: ', setRefresh);
  return (
    <Dialog open={isOpen} onClose={onClose} size='md' title='Import File'>
      {isOpen ? (
        <ImportFileBody
          onClose={onClose}
          importApi={importApi}
          ImportTypeEnum={ImportTypeEnum}
          setRefresh={() => setRefresh()}
        />
      ) : (
        <></>
      )}
    </Dialog>
  );
};

export default ImportFileModal;
