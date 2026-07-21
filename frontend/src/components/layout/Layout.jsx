import Header from "./Navbar";
import Footer from "./footer";
import CartDrawer from "./CartDrawer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
