import React from 'react';
import { Container } from '@material-ui/core';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UsersTable from '../components/Users.table';

const Home = () => {

  return (
      <div className="wrapper">
        <Header />
        <Container className="home-container">
          <UsersTable />
        </Container>
        <Footer />
      </div>
  );

}

export default Home;