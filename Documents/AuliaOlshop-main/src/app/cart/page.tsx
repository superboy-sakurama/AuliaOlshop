import Navbar from '../../components/Navbar';
import CartPage from '../../components/CartPage';

export default function CartPageRoute() {
  return (
    <div className="flex flex-col relative w-full">
      <Navbar cartCount={2} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="fade-in-container mt-8">
          <CartPage />
        </div>
      </main>
    </div>
  );
}
