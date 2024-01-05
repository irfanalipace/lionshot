import React, { useState } from 'react';
import FilesModule from '../../Components/FileUpload/FilesModule';
import FileUpload from '../../Components/FileUpload/FileUpload';

function TestPage() {
  const [files, setFiles] = useState([
    {
      id: 1,
      file_path: '',
      file_name: 'test'
    }
  ]);

  const handleDelete = file => {
    console.log('file deleted: ', file);
    if (file?.id) {
      const filteredFiles = files.filter(f => f.id !== file?.id);
      setFiles(filteredFiles);
    }
    // notyf.success('File Deleted');
  };

  return (
    <div>
      <FilesModule
        files={files}
        setFiles={f => setFiles(f)}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default TestPage;
