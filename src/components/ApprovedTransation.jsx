
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Drawer,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CrossIcon from '../assets/cross.svg';
import {Link} from 'react-router-dom'
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

const ApprovedTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data,setData]=useState([]);
  const [columns,setColumn]=useState([]);
  const [activeColumn,setActiveColumn]=useState('')
  const handleColumnHeaderClick = (column) => {
    setActiveColumn(column.field === activeColumn ? null : column.field);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Convert both transaction.phone and searchQuery to strings, then filter based on the phone number
    const phoneAsString = String(transaction.phone);
    const searchQueryString = String(searchQuery);
  
    return phoneAsString.includes(searchQueryString);
  });
  
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername !== 'ashu' || storedPassword !== '54321@sHu') {
      window.location.replace('/');
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ajayluckybrust.today/wallet/approvedTrans`);
        setTransactions(response.data.wallets);
        const data = response.data.wallets.reduce((acc, user) => {
          return [
            ...acc,
            ...user.walletTrans.map((transaction) => ({
              key: transaction._id,
              phone: user.phone,
              amount: Math.abs(transaction.amount).toFixed(2),
              time: new Date(transaction.time).toLocaleString(),
              status: transaction.status,
              paymentId: transaction.paymentId,
              bankId: transaction.bankId,
              ifscCode: transaction.ifscCode,
            })),
          ];
        }, []);
        setData(data)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>`,data)
        const columns=[
          {
            "field":"phone",
            "headerName":"Phone",
            width:250,
            cellClassName:'property'
          },
          {
            "field":"amount",
            "headerName":"Amount",
            width:250,
            cellClassName:'property'
          },
          
          {
            "field":"time",
            "headerName":"Time",
            width:250,
            cellClassName:'property'
          },
          {
            "field":"status",
            "headerName":"Status",
            width:250,
            cellClassName:'property'
          },
          
          {
            "field":"paymentId",
            "headerName":"Payment Id",
            width:250,
            cellClassName:'property'
          },{
            "field":"bankId",
            "headerName":"Bank Id",
            width:250,
            cellClassName:'property'
          },
          {
            "field":"ifscCode",
            "headerName":"IFSC CODE",
            width:250,
            cellClassName:'property'
          }
          
      ]
      setColumn(columns)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const [sortModel, setSortModel] = useState([]);

  const handleSortModelChange = (newModel) => {
    setSortModel(newModel);
  };

  const renderSortIndicator = (field) => {
    const sortedColumn = sortModel.find((column) => column.field === field);
    if (sortedColumn) {
      return sortedColumn.sort === 'asc' ? '↑' : '↓';
    }
    return null;
  };

  const CustomHeaderCell = ({ column }) => (
    <div style={{fontSize:'20px',fontWeight:'bold'}}>
      {column.headerName}
      {renderSortIndicator(column.field)}
    </div>
  );
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const linkStyle = {
    textDecoration: 'none',
    fontSize: '16px',
    margin: '8px 0',
    display: 'block',
    transition: 'color 0.3s',
    backgroundColor:'#081A30',
    color:'lightblue'
  };
  
  linkStyle[':hover'] = {
    color: '#007bff',
  };

  return (
    <div>
      {/* Header with Sidebar Button */}
      <header
      style={{
        backgroundColor: '#102339',
        color: 'lightblue',
        textAlign: 'center',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow
        zIndex: 1, // Ensure header is on top of other elements
      }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{marginLeft:'6in'}}><h2>Approved Transactions</h2></div>
      </header>

      {/* Sidebar Drawer */}
      <Drawer 
      anchor="left"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      // style={{background:'#102339'}}
    >
      <div style={{ textAlign: 'left', padding: '10px', background:'#102339',  }}>
                <img src={CrossIcon} alt="Hamburger Icon" style={{ width: '25px', height: '25px', cursor: 'pointer', background:'white', borderRadius:'17px'}} onClick={toggleDrawer(false)}/>
                </div>
      {/* Sidebar content goes here */}
      <div style={{  height: '100vh',width: '250px', padding: '20px', background: '#102339'}}>
        {/* List of links in the drawer */}
        <Link to="/transaction" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Transactions</Link>
        <Link to="/pending" onClick={() => setDrawerOpen(false)} style={linkStyle}>Pending Requests</Link>
        <Link to="/approved" onClick={() => setDrawerOpen(false)} style={linkStyle}>Approved Transactions</Link>
        <Link to="/users" onClick={() => setDrawerOpen(false)} style={linkStyle}>All Users</Link>
        <Link to="/weeklyUsers" onClick={() => setDrawerOpen(false)} style={linkStyle}>Weekly Users</Link>
        <Link to="/daily" onClick={() => setDrawerOpen(false)} style={linkStyle}>Daily Transactions</Link>
        <Link to="/week" onClick={() => setDrawerOpen(false)} style={linkStyle}>Weekly Transactions</Link>
      </div>
    </Drawer>
            <DataGrid
        rows={data}
        columns={columns.map((column) => ({
          ...column,
          headerName: (
            <CustomHeaderCell column={column} />
          ),
        }))}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        components={{
          ColumnHeaderCell: ({ column }) => (
            <div onClick={() => handleColumnHeaderClick(column)}>
              {column.headerName}
              {renderSortIndicator(column.field)}
            </div>
          ),
        }}
        getRowId={(row) => row.key}
        pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 10,
          bottom: params.isLastVisible ? 0 : 10,
        })}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '&.MuiDataGrid-root': {
            bgcolor: '#081A30', // Change background color
            color: 'lightblue',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add shadow
          },
          '&.MuiDataGrid-filterIcon': {
            bgcolor: '#102339',
            color: 'lightblue',
            borderColor: 'transparent',
          },
          '& .MuiDataGrid-cell, & .MuiDataGrid-colCellTitle': {
            background:'#102339'
          },
          '.css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar': {
            color: 'lightblue'
            /* Add any other styles you want to apply */
          }
        }}/>
      {/* Main Content */}

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#102339',
          color: 'lightblue',
          textAlign: 'center',
          padding: '10px',
          boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)', // Add shadow at the bottom
        }}
      >
        <p>&copy; 2024 baazi Maar</p>
      </footer>
    </div>
  );
};

export default ApprovedTransaction;

