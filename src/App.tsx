import React, { useState } from 'react';
import './App.css';
import Form from './components/form';
import Home from './components/home';
import { Button,ButtonGroup } from "@mui/material"
import Families from './components/families';
import CompareFamilies from './components/comparator';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page:string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'form':
        return <Form />;
      case 'home':
        return <Home />;
      case 'families':
        return <Families />;
      case 'comparator':
        return <CompareFamilies />;
      default:
        return null;
    }
  };

  return (
    <BrowserRouter>
    <div>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => handlePageChange('home')}>Home</Button>
        <Button onClick={() => handlePageChange('form')}>Form</Button>
        <Button onClick={() => handlePageChange('families')}>Families</Button>
        <Button onClick={() => handlePageChange('comparator')}>Comparator</Button>
      </ButtonGroup>

      {renderPage()}
    </div>
    </BrowserRouter>
  );
}

export default App;