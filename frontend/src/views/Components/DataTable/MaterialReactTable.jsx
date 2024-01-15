import { useEffect, useRef, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

/*
 * This component is created to extract the datatable logic and ui boilerplate from the components (utilizing the MaterialReactTableLibrary)
 * This component is created assuming that the default key for data rows in api response will be 'data' `according to our backend`
 * If we have scenerio of multiple objects containing different row (Example multiple tables in one api) than use dataKeys and activeDataKey props
 * In case of multitable scenerio you will have to pass pagination keys for all the table keys to preserve the pagination in case you switch between multiple tables
 * The key for current page will be 'current_page'
 * The key for total pages will be 'total'
 * The key for per page will be 'per_page'
 * The Key for current page in payload will be 'page'
 * The Key for page size or rows per page in payload will be 'per_page'
 * The Key for search string in payload will be 'search' or 'name'
 */

const MReactTable = ({
  api, // Function that fetches data from an API .
  extraParams, // Function that fetches data from an API (This object contains query params other than pagination and searching that needs to be passed to the backend api).
  columns, // Array of column configuration objects for the table
  setSelectedRows, // Callback function to set the selected row IDs.
  onRowClick, // Callback function when a table row is clicked.
  collapsed = false, //  variable that check if table is collapsed or not (this is accoring to our frontend requirement of collapsed table view)
  refresh, // force refetching data (incrementing this variable will cause refetching)
  searchApi, // Function that search data from an API.
  manualFilter = false, // A boolean to enable manual filtering
  enableRowSelection = true, // boolean to disable selection or a function that return boolean in table,
  showApiError = true, // whether api errors be shown in datatable
  takenHeight = '280', // define the fix height of table
  enableColumnActions, // A boolean to enable column actions
  enableColumnOrdering = true, // A boolean to enable column ordering
  dataKeys = [], // Array of data keys used in api response (only use if data rows are in multiple objects in response)
  activeDataKey, // A boolean to show the content of only key at a time( only use if data rows are in multiple objects in response)
  initialState,
  ...rest // All of the rest props will be passed directly to MaterialReactTable
}) => {
  //data and fetching state
  const [data, setData] = useState(
    activeDataKey ? { [activeDataKey]: { data: [] } } : { data: [] }
  );
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(
    typeof api === 'function' ? true : false
  );
  const [rowCount, setRowCount] = useState(0);
  const [rowSelection, setRowSelection] = useState({});

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [searchString, setSearchString] = useState('');
  const dataKeysObject = {};
  if (dataKeys?.length > 0) {
    /*
     * If You pass data keys then create pagination keys with default values for all
     * the tables/keys to preserve pagination and save it in ref to prevent re rendering  and keep track
     */
    dataKeys.forEach(key => {
      dataKeysObject[`per_page_${key}`] = 10;
      dataKeysObject[key] = 1;
    });
  }
  const tempVariables = useRef({
    extraParams, // storing extraParams in ref to track prev values in useEffect
    dataKeysObject,
    reFetchOnPaginationChange: true, // this flag wil prevent data refetching in case of multi table scenerio when user switch between tables
    isMounted: false // this flag tracks if the component is mounted or not to prevent refetching in multiple useEffects
  });

  const fetchData = async (_params = {}) => {
    setIsLoading(true);
    const paginationKeys = tempVariables.current.dataKeysObject;
    if (dataKeys?.length > 0) {
      /*
       *This block only runs if you pass dataKeys from parent
       */
      paginationKeys[`per_page_${activeDataKey}`] =
        _params?.per_page || pagination.pageSize || 10;
      paginationKeys[activeDataKey] = _params?.page || pagination.pageIndex + 1;
    } else if (!dataKeys.length) {
      /*
       *These are conventional keys for pagination according to our backend
       */
      paginationKeys['per_page'] =
        _params?.per_page || pagination.pageSize || 10;
      paginationKeys['page'] = _params?.page || pagination.pageIndex + 1;
    }
    const params = {
      ...paginationKeys,
      ...extraParams,
      ..._params
    };
    try {
      const response = await api(params);
      let responseData = response;
      console.log(response,'KKKKKKKKKKKKKKKKKKKKKKKKK')
      setData(responseData);
      setRowCount(
        responseData?.total || responseData[activeDataKey]?.total || 0
      );
      tempVariables.current.isMounted = true; // set mount flag to true to prevent refetching of data in another useEffect
      setIsError(false);
      /*
       *set pagination keys in ref variables to store them for preserving pagination variables/keys
       */
      tempVariables.current.dataKeysObject[`per_page_${activeDataKey}`] =
        responseData[activeDataKey]?.per_page;
      tempVariables.current.dataKeysObject[activeDataKey] =
        responseData[activeDataKey]?.current_page;
    } catch (error) {
      setIsError(showApiError || false);
      console.error(error);
    }
    setIsLoading(false);
  };

  const searchData = async globalFilter => {
    setIsLoading(true);
    const paginationKeys = tempVariables.current.dataKeysObject;
    if (dataKeys?.length > 0) {
      paginationKeys[`per_page_${activeDataKey}`] =
        searchString !== globalFilter ? 10 : pagination.pageSize || 10;
      paginationKeys[activeDataKey] =
        searchString !== globalFilter ? 1 : pagination.pageIndex + 1;
    } else if (!dataKeys.length) {
      paginationKeys['per_page'] =
        searchString !== globalFilter ? 10 : pagination.pageSize || 10;
      paginationKeys['page'] =
        searchString !== globalFilter ? 1 : pagination.pageIndex + 1;
    }
    const params = {
      ...paginationKeys,
      ...extraParams,
      search: globalFilter,
      name: globalFilter
    };

    try {
      if (manualFilter && typeof searchApi === 'function') {
        const response = await searchApi(params);
        let responseData = response?.data;
        setData(response);
        tempVariables.current.dataKeysObject[`per_page_${activeDataKey}`] =
          responseData[activeDataKey]?.per_page;
        tempVariables.current.dataKeysObject[activeDataKey] =
          responseData[activeDataKey]?.current_page;
        setRowCount(
          responseData?.total || responseData[activeDataKey]?.total || 0
        );
        setIsError(false);
      } else if (manualFilter) {
        if (typeof api === 'function') fetchData(params);
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error(error);
    }
    setIsLoading(false);
    setSearchString(globalFilter);
  };

  useEffect(() => {
    if (tempVariables.current.reFetchOnPaginationChange) {
      if (globalFilter && manualFilter) {
        /*
         *This block will run if you have enabled manual filteration from parent and user have some search string
         */
        searchData(globalFilter);
      } else {
        if (typeof api === 'function') fetchData();
      }
    } else tempVariables.current.reFetchOnPaginationChange = true;
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  useEffect(() => {
    if (tempVariables.current.isMounted) {
      // prevent refetching on first mount
      setRowSelection({});

      if (tempVariables.current.extraParams !== extraParams) {
        /*
         * This block will only run when reference of extraParams object changes
         */
        if (typeof api === 'function')
          fetchData({
            page: 0,
            per_page: 10
          });
        tempVariables.current.extraParams = extraParams;
      } else if (typeof api === 'function') fetchData();
    }
  }, [refresh, extraParams]);

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection);
    if (enableRowSelection) setSelectedRows(() => selectedIds);
  }, [rowSelection]);

  useEffect(() => {
    /*
     *This block only runs when you shift between tables in multitable scenerio
     */
    if (tempVariables.current.isMounted) {
      setPagination(prev => {
        /*
         *Set Pagination according to the table you just switched to so that you can start from where you left
         */
        const _pageIndex = data[activeDataKey]?.current_page - 1 || 0;
        const _pageSize = data[activeDataKey]?.per_page || 10;
        if (prev.pageIndex !== _pageIndex || prev.pageSize !== _pageSize)
          tempVariables.current.reFetchOnPaginationChange = false;
        return {
          pageIndex: _pageIndex,
          pageSize: _pageSize
        };
      });
      setRowCount(data[activeDataKey]?.total || 0);
    }
  }, [activeDataKey]);

  const onPaginationChange = args => {
    window.scrollTo(0, 0);
    setPagination(args);
  };
  
  return (
    <MaterialReactTable
      columns={columns}
     
      data={
        activeDataKey
          ? data[activeDataKey]
          : typeof api === 'function'
          ? data
          : rest.data
      }
      enableRowSelection={
        typeof enableRowSelection === 'function'
          ? enableRowSelection
          : enableRowSelection === false
          ? false
          : true
      }
      onRowSelectionChange={setRowSelection}
      getRowId={row => row?.id}
      manualPagination
      manualFiltering={
        typeof searchApi === 'function' || manualFilter ? true : false
      }
      enableStickyHeader={!collapsed}
      enableFullScreenToggle={false}
      enableColumnActions={!collapsed && enableColumnActions}
      enableDensityToggle={!collapsed}
      enableHiding={!collapsed}
      enableFilters={!collapsed}
      enableColumnOrdering={!collapsed && enableColumnOrdering}
      enableColumnFilters={false}
      enableTableHead={!collapsed}
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={onPaginationChange}
      onSortingChange={setSorting}
      rowCount={rowCount}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isLoading,
        sorting,
        rowSelection
      }}
      muiSearchTextFieldProps={{
        sx: { '& .MuiInputBase-input': { height: '5px' } },
        variant: 'outlined'
      }}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () => typeof onRowClick === 'function' && onRowClick(row),
        sx: {
          cursor: 'pointer',
          '& .MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-e3lgss-MuiTableCell-root':
            {
              lineHeight: '2.43'
            },
          '&:hover .show-on-hover': {
            display: 'inline'
          }
        }
      })}
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: 'error',
              children: globalFilter ? 'Data Not Found' : 'Error loading data'
              
            }
          : undefined
      }
      muiTableBodyProps={
        collapsed
          ? {
              sx: {
                '& tr td:first-of-type': { width: '0', minWidth: '0' },
                '& .css-nx5x10-MuiTableRow-root ': {
                  // '&:hover':{backgroundColor:'red'},
                },
                '& tr td:nth-of-type(2)': {
                  paddingLeft: '0',
                  paddingTop: '10px',
                  paddingBottom: '10px'
                }
              }
            }
          : undefined
      }
      muiTopToolbarProps={
        collapsed
          ? {
              sx: { display: 'none' }
            }
          : undefined
      }
      muiTablePaginationProps={
        collapsed
          ? {
              sx: {
                '&  .MuiTablePagination-toolbar': {
                  paddingLeft: '0'
                },
                '&  .MuiTablePagination-actions': {
                  marginLeft: '4px'
                }
              }
            }
          : undefined
      }
      muiTableProps={
        !collapsed
          ? {
              sx: {
                '&.MuiTable-root': {
                  paddingBottom: '10px'
                }
              }
            }
          : undefined
      }
      muiTableContainerProps={
        !collapsed
          ? {
              sx: {
                height: `calc(100vh - ${takenHeight}px)`,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  height: '7px'
                }
              }
            }
          : undefined
      }
      initialState={{
        showGlobalFilter: true,
        ...initialState
      }}
      {...rest}
    />
  );
};

export default MReactTable;