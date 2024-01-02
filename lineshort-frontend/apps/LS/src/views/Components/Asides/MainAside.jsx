import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import './MainAside.css';
import Divider from '@mui/material/Divider';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/system/Box';
import useTheme from '@mui/material/styles/useTheme';

export default function Sidebar({ list = [] }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(list);

  const handleItemClick = index => {
    setOpen(prev =>
      prev.map((p, _index) => ({
        ...p,
        open: _index === index ? true : false
      }))
    );
  };

  const handleParentClick = index => {
    setOpen(prev =>
      prev.map((p, _index) => ({
        ...p,
        open: _index === index ? !p.open : p.open
      }))
    );
  };

  const handleMenuItemClick = (index, subItemIndex) => {
    setOpen(prev =>
      prev.map((item, _index) => ({
        ...item,
        open: _index === index ? true : false,
        subItems: item.subItems
          ? item.subItems.map((subItem, _subIndex) => ({
              ...subItem,
              open: _subIndex === subItemIndex ? !subItem.open : subItem.open
            }))
          : item.subItems
      }))
    );
  };

  useEffect(() => {
    setOpen(prev =>
      prev.map(pre => ({
        ...pre,
        open:
          pre.path === pathname ||
          (Array.isArray(pre?.subItems) &&
            pre.subItems.some(item => pathname?.includes(item.path)))
            ? true
            : false
      }))
    );
  }, [pathname]);

  function createRegex(variable) {
    return new RegExp(`${variable}(\/|$)`);
  }

  return (
    <Box
      className='custom-drawer'
      sx={{
        width: '100%',
        paddingTop: '20px'
      }}>
      {list?.map((item, index) => (
        <React.Fragment key={item.name}>
          {item.subItems ? (
            <>
              <ListItem
                disablePadding
                onClick={() => handleParentClick(index)}
                className={`custom-list-item ${
                  open[index].open ? 'selected' : ''
                }`}>
                <ListItemButton
                  sx={{
                    color: open[index].open
                      ? theme.palette.primary.main
                      : theme.palette.dark
                  }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                  {open[index].open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
              </ListItem>
              <Collapse
                in={open[index].open || false}
                timeout='auto'
                unmountOnExit>
                <List
                  component='div'
                  disablePadding
                  className='custom-list-transition'>
                  <Divider />
                  {item.subItems.map((subItem, subItemIndex) => (
                    <Link
                      to={subItem?.path}
                      //   onClick={() => dispatch(CLEAR_HASH())}
                      key={subItem?.path + '-' + subItemIndex}
                      className='subitem'>
                      <ListItem
                        disablePadding
                        onClick={() => handleMenuItemClick(index, subItemIndex)}
                        className={`custom-list-item ${
                          createRegex(subItem?.path).test(pathname)
                            ? 'selected'
                            : ''
                        }`}
                        path={subItem.path}>
                        <ListItemButton tabIndex={0}>
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.name} />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ))}
                </List>
                <Divider />
              </Collapse>
            </>
          ) : (
            <Link
              to={item?.path}
              //   onClick={() => dispatch(CLEAR_HASH())}
              className='subitem'>
              <ListItem
                disablePadding
                onClick={() => handleItemClick(index)}
                className={`custom-list-item ${
                  createRegex(item?.path).test(pathname) ? 'selected' : ''
                }`}>
                <ListItemButton
                  sx={{
                    color: open[index].open
                      ? theme.palette.primary.main
                      : theme.palette.dark
                  }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}
