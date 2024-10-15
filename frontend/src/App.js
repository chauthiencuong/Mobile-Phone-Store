import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Main from "./layout/Main";
import AppRoutes from "./route";
import useGoogleAuth from './page/User/useGoogleAuth';

function App() {
  useGoogleAuth();
  return (
    <div className="App">
      <img className="header-image" src="https://lh3.googleusercontent.com/3YjSsl02BY5KU6N2VEenV-RWYekzoP9qKd5AMYVXQOrfQCdfAS1ihDtpHU59EpuvgDBStvLcbkcgF_A0fwAB2-K3BHM1r2w=w1920-rw" />
      <Header />
      <Main />
      <AppRoutes />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default App;
