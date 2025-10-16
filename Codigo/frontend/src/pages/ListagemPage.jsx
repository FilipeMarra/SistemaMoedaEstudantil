import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ListagemAcervos from '../components/Acervos/ListagemAcervos';
import { Link } from 'react-router-dom';

const ListagemPage = () => {
  return (
    <>
      <Header />
      <ListagemAcervos />
      <Footer />
    </>
  );
};

export default ListagemPage;
 