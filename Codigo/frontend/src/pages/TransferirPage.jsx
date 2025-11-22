import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import TransferirMoedas from '../components/Transferir';

const ListagemPage = () => {
  return (
    <div className="page-wrapper">
      <Header />

      <main className="page-content">
        <TransferirMoedas />
      </main>

      <Footer />
    </div>
  );
};

export default ListagemPage;
