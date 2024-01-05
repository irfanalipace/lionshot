import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import DownloadIcon from '@mui/icons-material/Download';
import {
  FormControlLabel,
  Box,
  Checkbox,
  Typography,
  Card,
  Button,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  downloadFile,
  snakeCaseToPrettyText
} from '../../../core/utils/helpers';
// import { FileTypeEnum } from '../../../core/utils/constants';
import { getColumnNamesApi } from '../../../core/api/others';
import { TABLE_NAME_FROM_ROUTE } from '../../../core/utils/constants';

export default function ExportFileBody({
  exportApi, // The API function to call when exporting a file.
  ExportTypeEnum, // An array of possible export types, e.g., [ 'CSV', 'PDF' ].
  exportColumns = false, // A boolean indicating whether to export columns or not
  onClose
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [columnsList, setColumnsList] = useState([]);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    columns: exportColumns
      ? Yup.array().min(1, 'Please select atleast one column')
      : Yup.array()
  });
  const formik = useFormik({
    initialValues: {
      // export_type: ExportTypeEnum?.length ? ExportTypeEnum[0].key : "",
      columns: [],
      file_extension: 'xls'
    },
    validationSchema: validationSchema,

    onSubmit: () => {
      exportFile();
    }
  });
  const exportFile = async () => {
    try {
      setIsLoading(true);
      let response = await exportApi(formik.values);
      let fileUrl = response?.data?.file_url;
      if (process.env.NODE_ENV !== 'development') {
        fileUrl = fileUrl.replace(/http(?=:\/\/)/g, 'https');
      }
      // fileUrl = fileUrl.replace(/http(?=:\/\/)/g, 'https');
      // Remove the call to downloadFile
      // downloadFile(fileUrl);
      // window.open(fileUrl);
      // downloadFile(response.file_url);
      // showNotification('File Dowloaded Successfully', '');

      // Create an anchor element for download
      const downloadLink = document.createElement('a');
      downloadLink.href = fileUrl;
      downloadLink.download = 'filename.extension';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const fetchColumns = async () => {
    let response = await getColumnNamesApi(
      TABLE_NAME_FROM_ROUTE[location.pathname]
    );
    setColumnsList(response.data);
    // formik.setFieldValue('columns', response.data);
  };

  useEffect(() => {
    exportColumns && fetchColumns();
  }, []);

  return (
    <Box bgcolor='#f3f3f3' padding='10px 10px'>
      {/* <Card
        sx={{
          p: 1,
          boxShadow: 0,
          borderRadius: "10px",
        }}
      >
        {!!ExportTypeEnum.length && (
          <Box>
            <Typography variant="subtitle2Grey">Export Module</Typography>
            {ExportTypeEnum.map((exportType) =>
              exportType.key ? (
                <FormControlLabel
                  sx={{ display: "block", ml: "0px" }}
                  key={exportType.key}
                  control={
                    <Checkbox
                      name="exportType"
                      value={exportType.key}
                      onChange={() =>
                        formik.setValues((prevState) => ({
                          ...prevState,
                          export_type: exportType.key,
                        }))
                      }
                      checked={formik.values.export_type === exportType.key}
                    />
                  }
                  label={exportType.label}
                />
              ) : (
                <></>
              )
            )}
          </Box>
        )}

        <Typography variant="subtitle2Grey">Export File Type</Typography>
        {Object.values(FileTypeEnum).map((fileType) => (
          <FormControlLabel
            sx={{ display: "block", ml: "0px" }}
            key={fileType.key}
            control={
              <Checkbox
                name="exportAs"
                value={fileType.key}
                onChange={() => {
                  formik.setValues((prevState) => ({
                    ...prevState,
                    file_extension: fileType.key,
                  }));
                }}
                checked={formik.values.file_extension === fileType.key}
              />
            }
            label={fileType.label}
          />
        ))}
      </Card> */}
      {/* </CardContent> */}
      {exportColumns && columnsList?.length > 0 && (
        <Card
          sx={{
            p: 1,
            boxShadow: 0,
            borderRadius: '10px'
          }}>
          <Box>
            <Typography variant='subtitle2Grey'>Export Columns</Typography>
            <Grid container>
              {columnsList.map((exportCol, index) =>
                exportCol ? (
                  <Grid item xs={6}>
                    <FormControlLabel
                      sx={{ display: 'block', ml: '0px' }}
                      key={exportCol}
                      control={
                        <Checkbox
                          name='columns'
                          value={exportCol}
                          // onChange={() =>
                          // 	formik.setValues(prevState => ({
                          // 		...prevState,
                          // 		columns: exportCol,
                          // 	}))
                          // }
                          onChange={formik.handleChange}
                          checked={formik.values.columns.includes(exportCol)}
                        />
                      }
                      label={snakeCaseToPrettyText(exportCol)}
                    />
                  </Grid>
                ) : (
                  <></>
                )
              )}
            </Grid>
          </Box>
          {formik.errors.columns && (
            <Typography variant='body2' color={'error'}>
              {formik.errors.columns}
            </Typography>
          )}
        </Card>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '20px 0px 5px 0'
        }}>
        <Button
          sx={{ border: `1px solid ${window.themeColors.primary}` }}
          color='primary'
          disabled={isLoading || !formik.isValid}
          onClick={formik.handleSubmit}>
          <DownloadIcon /> Download
        </Button>
      </Box>
    </Box>
  );
}
