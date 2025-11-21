// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAnimation } from '../context/AnimationContext';

// const Market = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { motion, fadeIn } = useAnimation();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get('/api/market/products');
//       setProducts(response.data);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="container mx-auto px-4 py-8"
//       {...fadeIn}
//     >
//       <h1 className="text-3xl font-bold text-green-800 mb-6">Marketplace</h1>

//       {loading ? (
//         <div className="text-center">Loading products...</div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product, index) => (
//             <motion.div
//               key={product._id}
//               className="bg-white rounded-lg shadow-md p-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
//               <p className="text-green-600 font-bold">ETB {product.price}</p>
//               <p className="text-gray-600">By: {product.farmer?.name}</p>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default Market;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { useAnimation } from "../context/AnimationContext";

// const Market = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Try to access animation helpers safely
//   let fadeIn = {};
//   try {
//     const animation = useAnimation?.();
//     fadeIn = animation?.fadeIn || {};
//   } catch (err) {
//     console.warn("Animation context not available:", err);
//   }

//   // Fetch products on mount
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const { data } = await axios.get("/api/market/products");
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <motion.div
//       className="container mx-auto px-4 py-8"
//       {...fadeIn}
//     >
//       <h1 className="text-3xl font-bold text-green-800 mb-6">Marketplace</h1>

//       {loading ? (
//         <div className="text-center">Loading products...</div>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product, index) => (
//             <motion.div
//               key={product._id || index}
//               className="bg-white rounded-lg shadow-md p-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
//               <p className="text-green-600 font-bold">ETB {product.price}</p>
//               <p className="text-gray-600">
//                 By: {product.farmer?.name || "Unknown"}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default Market;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Market = () => {
  const [products, setProducts] = useState([]); // ✅ Always start as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fadeIn } = useAnimation?.() || { fadeIn: {} }; // ✅ Safe animation access

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/market/products");

        // ✅ Ensure data is always an array
        const data = response.data;
        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        setProducts(productList);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <motion.div className="container mx-auto px-4 py-8" {...fadeIn}>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Marketplace</h1>

      {loading && <div className="text-center">Loading products...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center text-gray-600">
              No products available.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  className="bg-white rounded-lg shadow-md p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <p className="text-green-600 font-bold">
                    ETB {product.price ?? "N/A"}
                  </p>
                  <p className="text-gray-600">
                    By: {product.farmer?.name || "Unknown"}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Market;
