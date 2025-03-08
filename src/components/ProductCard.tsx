export default function ProductCard() {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <img src="https://via.placeholder.com/150" alt="Product" className="w-full h-40 object-cover rounded-md" />
        <h3 className="text-lg font-semibold mt-2">Product Name</h3>
        <p className="text-gray-500">Description of the product...</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xl font-bold">Rp 100.000</span>
          <button className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors">Buy Now</button>
        </div>
      </div>
    );
  }
  