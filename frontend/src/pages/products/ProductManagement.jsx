// import React, { useState, useEffect } from "react";
// import productService from "../../services/product/productService";

// const ProductManagement = () => {
//   const [activeTab, setActiveTab] = useState("products");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [products, setProducts] = useState([]);
//   const [pagination, setPagination] = useState({});
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");

//   const [productForm, setProductForm] = useState({
//     name: "",
//     price: "",
//     description: "",
//     category: "",
//     unit: "",
//     location: "",
//   });

//   const [availableCategories] = useState([
//     "Electronics",
//     "Clothing",
//     "Books",
//     "Home & Garden",
//     "Sports",
//     "Beauty",
//     "Toys",
//     "Food & Beverages",
//     "Automotive",
//     "Health",
//   ]);

//   const [availableUnits] = useState([
//     "piece",
//     "kg",
//     "liter",
//     "meter",
//     "set",
//     "pack",
//   ]);

//   const fetchProducts = async (page = 1, limit = 8) => {
//     try {
//       setLoading(true);
//       const resp = await productService.getProducts(page, limit);

//      setProducts(resp.data);
//     setPagination(resp.pagination);
//     } catch (error) {
//       showMessage("error", error.message || "Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProductById = async (id) => {
//     try {
//       setLoading(true);
//       const response = await productService.getProductById(id);

//       setSelectedProduct(response.data);
//       setProductForm({
//         name: response.data.name,
//         price: response.data.price,
//         description: response.data.description,
//         category: response.data.category,
//         unit: response.data.unit,
//         location: response.data.location,
//       });

//       setActiveTab("edit");
//     } catch (error) {
//       showMessage("error", error.message || "Failed to fetch product details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createProduct = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await productService.createProduct(productForm);

//       showMessage("success", "Product created successfully!");
//       resetForm();
//       fetchProducts();
//       setActiveTab("products");
//     } catch (error) {
//       showMessage("error", error.message || "Failed to create product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProduct = async (e) => {
//     e.preventDefault();
//     if (!selectedProduct) return;

//     try {
//       setLoading(true);
//       await productService.updateProduct(selectedProduct.id, productForm);

//       showMessage("success", "Product updated successfully!");
//       fetchProducts();
//       setActiveTab("products");
//     } catch (error) {
//       showMessage("error", error.message || "Failed to update product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this product? This action cannot be undone."
//       )
//     )
//       return;

//     try {
//       setLoading(true);
//       await productService.deleteProduct(id);

//       showMessage("success", "Product deleted successfully!");
//       fetchProducts();
//     } catch (error) {
//       showMessage("error", error.message || "Failed to delete product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFormChange = (field, value) => {
//     setProductForm({
//       ...productForm,
//       [field]: value,
//     });
//   };

//   const resetForm = () => {
//     setProductForm({
//       name: "",
//       price: "",
//       description: "",
//       category: "",
//       unit: "",
//       location: "",
//     });
//     setSelectedProduct(null);
//   };

//   const showMessage = (type, text) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: "", text: "" }), 5000);
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       !categoryFilter || product.category === categoryFilter
//     return matchesSearch && matchesCategory;
//   });

//   useEffect(() => {
//     if (activeTab === "products") {
//       fetchProducts();
//     }
//   }, [activeTab]);

//   return (
//     <div className=" w-full max-w-full overflow-x-hidden">
//       <div className="text-center mb-8">
//         <h1 className="text-slate-600 mb-2 mt-10 text-4xl font-bold">
//           Product Management
//         </h1>
//         <p className="text-slate-600 text-lg">Manage your products</p>
//       </div>

//       {message.text && (
//         <div
//           className={`p-4 rounded-lg mb-6 font-medium text-center ${
//             message.type === "success"
//               ? "bg-green-100 text-green-800 border border-green-200"
//               : "bg-red-100 text-red-800 border border-red-200"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       <div className="flex rounded-xl p-2 mb-8 gap-5 shadow-md flex-wrap">
//         {selectedProduct && activeTab === "edit" && (
//           <button className="px-8 py-4 border-none bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 m-1 shadow-lg shadow-blue-500/30">
//             Edit Product
//           </button>
//         )}
//       </div>

//       <div className="snow rounded-xl p-8 shadow-lg">
//         {activeTab === "products" && (
//           <div className="animate-fade-in">
//             <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//               <div className="flex gap-4 items-center flex-wrap">
//                 <div className="relative min-w-64">
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base w-full text-gray-800 transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
//                   />
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></span>
//                 </div>

//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   className="px-3 py-3 border border-gray-300 rounded-lg text-base min-w-48 bg-white text-gray-900"
//                 >
//                   <option value="">All Categories</option>
//                   {availableCategories.map((category) => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex gap-8">
//                 <span className="text-gray-500 text-sm">
//                   Total:{" "}
//                   <strong className="text-slate-800">
//                     {pagination.totalProducts || 0}
//                   </strong>
//                 </span>
//               </div>
//             </div>

//             <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//               <div className="flex gap-4 items-center flex-wrap">...</div>
//               <div className="flex gap-4">
//                 <button
//                   onClick={() => setActiveTab("create")}
//                   className="bg-linear-to-br from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg"
//                 >
//                   Create Product
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className="text-center py-8 text-gray-500 italic">
//                 Loading products...
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//                   {filteredProducts.map((product) => (
//                     <div
//                       key={product.id}
//                       className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
//                     >
//                       <div className="relative h-30 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                         <div className="w-15 h-15 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
//                           {product.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="absolute top-3 left-3 right-3 flex justify-between">
//                           <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-full text-xs font-semibold">
//                             {product.category}
//                           </span>
//                           <span className="bg-white/90 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
//                             {formatPrice(product.price)}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="p-6 flex-1 flex flex-col">
//                         <h3 className="text-slate-800 mb-3 text-lg font-semibold leading-snug">
//                           {product.name}
//                         </h3>
//                         <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
//                           {product.description || "No description available"}
//                         </p>
//                         <div className="flex flex-col gap-1 mb-4">
//                           <span className="text-gray-500 text-xs">
//                             <strong className="text-slate-800">Unit:</strong>{" "}
//                             {product.unit}
//                           </span>
//                           <span className="text-gray-500 text-xs">
//                             <strong className="text-slate-800">
//                               Location:
//                             </strong>{" "}
//                             {product.location}
//                           </span>
//                         </div>
//                         <div className="text-gray-400 text-xs mt-auto">
//                           Added: {formatDate(product.createdAt)}
//                         </div>
//                       </div>
//                       <div className="p-6 border-t border-gray-100 flex gap-2">
//                         <button
//                           onClick={() => fetchProductById(product.id)}
//                           className="bg-gray-600 text-white border-none px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700 text-sm"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => deleteProduct(product.id)}
//                           className="bg-red-600 text-white border-none px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700 text-sm"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {filteredProducts.length === 0 && (
//                   <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
//                     <div className="text-5xl mb-4">📦</div>
//                     <h4 className="text-gray-500 mb-2 text-xl">
//                       No products found
//                     </h4>
//                     <p className="mb-6">
//                       {searchTerm || categoryFilter
//                         ? "Try adjusting your search or filters"
//                         : "Get started by adding your first product"}
//                     </p>
//                     {searchTerm || categoryFilter ? (
//                       <button
//                         onClick={() => {
//                           setSearchTerm("");
//                           setCategoryFilter("");
//                         }}
//                         className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700"
//                       >
//                         Clear Filters
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => setActiveTab("create")}
//                         className="bg-linear-to-br from-blue-500 to-purple-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
//                       >
//                         Add First Product
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {pagination && pagination.totalPages > 1 && (
//                   <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-200">
//                     <button
//                       onClick={() => fetchProducts(pagination.prevPage)}
//                       disabled={!pagination.hasPrev}
//                       className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                       Previous
//                     </button>
//                     <span className="text-gray-500 font-semibold">
//                       Page {pagination.currentPage} of {pagination.totalPages}
//                     </span>
//                     <button
//                       onClick={() => fetchProducts(pagination.nextPage)}
//                       disabled={!pagination.hasNext}
//                       className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {(activeTab === "create" || activeTab === "edit") && (
//           <div className="animate-fade-in">
//             <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//               <h3 className="text-2xl font-bold text-slate-800">
//                 {selectedProduct ? "Edit Product" : "Add New Product"}
//               </h3>
//               <button
//                 onClick={() => setActiveTab("products")}
//                 className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700"
//               >
//                 Back to Products
//               </button>
//             </div>

//             <form
//               onSubmit={selectedProduct ? updateProduct : createProduct}
//               className="flex flex-col gap-8 text-gray-800"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="name"
//                     className="mb-2 text-slate-800 font-semibold text-sm"
//                   >
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={productForm.name}
//                     onChange={(e) => handleFormChange("name", e.target.value)}
//                     required
//                     placeholder="Enter product name"
//                     className="px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="price"
//                     className="mb-2 text-slate-800 font-semibold text-sm"
//                   >
//                     Price *
//                   </label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
//                       $
//                     </span>
//                     <input
//                       type="number"
//                       id="price"
//                       value={productForm.price}
//                       onChange={(e) =>
//                         handleFormChange("price", e.target.value)
//                       }
//                       required
//                       min="0"
//                       step="0.01"
//                       placeholder="0.00"
//                       className="pl-8 pr-3 py-3 border border-gray-300 rounded-lg text-base w-full transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="category"
//                     className="mb-2 text-slate-800 font-semibold text-sm"
//                   >
//                     Category *
//                   </label>
//                   <select
//                     id="category"
//                     value={productForm.category}
//                     onChange={(e) =>
//                       handleFormChange("category", e.target.value)
//                     }
//                     required
//                     className="px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
//                   >
//                     <option value="">Select a category</option>
//                     {availableCategories.map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="unit"
//                     className="mb-2 text-slate-800 font-semibold text-sm"
//                   >
//                     Unit *
//                   </label>
//                   <select
//                     id="unit"
//                     value={productForm.unit}
//                     onChange={(e) => handleFormChange("unit", e.target.value)}
//                     required
//                     className="px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
//                   >
//                     <option value="">Select unit</option>
//                     {availableUnits.map((unit) => (
//                       <option key={unit} value={unit}>
//                         {unit}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex flex-col md:col-span-2 lg:col-span-3">
//                   <label
//                     htmlFor="description"
//                     className="mb-2 text-slate-800 font-semibold text-sm"
//                   >
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     value={productForm.description}
//                     onChange={(e) =>
//                       handleFormChange("description", e.target.value)
//                     }
//                     rows="4"
//                     placeholder="Enter product description..."
//                     className="px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
//                   />
//                 </div>

//                 <div className="flex flex-col md:col-span-2 lg:col-span-3">
//                   <label
//                     htmlFor="location"
//                     className="mb-2 text-slate-800 font-semibold text-sm"
//                   >
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     id="location"
//                     value={productForm.location}
//                     onChange={(e) =>
//                       handleFormChange("location", e.target.value)
//                     }
//                     placeholder="Enter storage location"
//                     className="px-3 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/10"
//                   />
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                 <h4 className="text-slate-800 mb-4 pb-2 border-b border-gray-200 text-lg font-semibold">
//                   Product Preview
//                 </h4>
//                 <div className="bg-white p-6 rounded-lg border border-gray-200">
//                   <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
//                     <strong className="text-slate-800 text-lg">
//                       {productForm.name || "Product Name"}
//                     </strong>
//                     <span className="text-green-600 font-semibold text-lg">
//                       {productForm.price
//                         ? formatPrice(productForm.price)
//                         : "$0.00"}
//                     </span>
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <div className="flex justify-between text-gray-500 text-sm">
//                       <span>Category:</span>
//                       <span>{productForm.category || "Not specified"}</span>
//                     </div>
//                     <div className="flex justify-between text-gray-500 text-sm">
//                       <span>Unit:</span>
//                       <span>{productForm.unit || "Not specified"}</span>
//                     </div>
//                     <div className="flex justify-between text-gray-500 text-sm">
//                       <span>Location:</span>
//                       <span>{productForm.location || "Not specified"}</span>
//                     </div>
//                     <div className="mt-4 pt-4 border-t border-gray-200 text-gray-500 italic leading-relaxed">
//                       {productForm.description || "No description provided"}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 justify-start flex-wrap">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="bg-linear-to-br from-blue-500 to-purple-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {loading
//                     ? selectedProduct
//                       ? "Updating..."
//                       : "Creating..."
//                     : selectedProduct
//                     ? "Update Product"
//                     : "Create Product"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     resetForm();
//                     setActiveTab("products");
//                   }}
//                   className="bg-gray-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//                 {selectedProduct && (
//                   <button
//                     type="button"
//                     onClick={() => deleteProduct(selectedProduct.id)}
//                     className="bg-red-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700"
//                   >
//                     Delete Product
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;


import React, { useState, useEffect } from "react";
import productService from "../../services/product/productService";

const ProductsManagement = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    unit: "",
    location: "",
  });

  const [availableCategories] = useState([
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Beauty",
    "Toys",
    "Food & Beverages",
    "Automotive",
    "Health",
    "Other",
  ]);

  const [availableUnits] = useState([
    "piece",
    "kg",
    "liter",
    "meter",
    "set",
    "pack",
    "box",
  ]);

  const fetchProducts = async (page = 1, limit = 8) => {
    try {
      setLoading(true);
      const resp = await productService.getProducts(page, limit);
      setProducts(resp.data);
      setPagination(resp.pagination);
    } catch (error) {
      showMessage("error", error.message || "Failed to fetch productsdd");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      
      setSelectedProduct(response.data);
      setProductForm({
        name: response.name,
        price: response.price,
        description: response.description,
        category: response.category,
        unit: response.unit,
        location: response.location,
      });
      
      setActiveTab("edit");
    } catch (error) {
      showMessage("error", error.message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await productService.createProduct(productForm);
      
      showMessage("success", "Product created successfully!");
      resetForm();
      fetchProducts();
      setActiveTab("products");
    } catch (error) {
      showMessage("error", error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      await productService.updateProduct(selectedProduct.id, productForm);
      
      showMessage("success", "Product updated successfully!");
      fetchProducts();
      setActiveTab("products");
    } catch (error) {
      showMessage("error", error.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    )) return;
    
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      
      showMessage("success", "Product deleted successfully!");
      fetchProducts();
      if (selectedProduct && selectedProduct.id === id) {
        resetForm();
        setActiveTab("products");
      }
    } catch (error) {
      showMessage("error", error.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setProductForm({
      ...productForm,
      [field]: value,
    });
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      price: "",
      description: "",
      category: "",
      unit: "",
      location: "",
    });
    setSelectedProduct(null);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="text-center mb-8 pt-6">
        <h1 className="text-slate-800 mb-3 mt-6 text-5xl font-bold bg-clip-text text:transparent bg-linear-to-r from-blue-600 to-purple-600">
          Products Management
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Manage your product inventory with ease. Create, edit, and organize all your products in one place.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 mx-4 font-medium text-center animate-fade-in ${
          message.type === "success"
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <div className="flex items-center justify-center gap-2">
            {message.type === "success" ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-red-500">✗</span>
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="flex rounded-xl p-2 mb-8 mx-4 gap-5 shadow-md flex-wrap bg-white/50 backdrop-blur-sm">
        <button
          onClick={() => {
            resetForm();
            setActiveTab("products");
          }}
          className={`px-8 py-4 border-none font-semibold rounded-lg cursor-pointer transition-all duration-300 m-1 ${
            activeTab === "products"
              ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-white text-slate-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => {
            resetForm();
            setActiveTab("create");
          }}
          className={`px-8 py-4 border-none font-semibold rounded-lg cursor-pointer transition-all duration-300 m-1 ${
            activeTab === "create"
              ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-white text-slate-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Add New Product
        </button>
        {selectedProduct && activeTab === "edit" && (
          <button className="px-8 py-4 border-none bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold rounded-lg cursor-pointer transition-all duration-300 m-1 shadow-lg shadow-blue-500/30">
            Edit Product
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 mx-4 shadow-xl border border-gray-100 mb-8">
        {activeTab === "products" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div className="flex gap-4 items-center flex-wrap">
                <div className="relative min-w-64">
                  <input
                    type="text"
                    placeholder="Search products by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-base w-full text-gray-800 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    🔍
                  </span>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-base min-w-48 bg-white text-gray-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-6 items-center">
                <div className="text-gray-600 text-sm">
                  Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of{" "}
                  <strong className="text-slate-800">{pagination.totalProducts || 0}</strong> products
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                    fetchProducts(1);
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 hover:shadow-sm flex items-center gap-2"
                >
                  <span>↻</span> Refresh
                </button>
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 flex flex-col"
                    >
                      <div className="relative h-40 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                            {product.category}
                          </span>
                          <span className="bg-white/90 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-slate-800 mb-3 text-lg font-semibold leading-snug group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                          {product.description || "No description available"}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="text-gray-400">📦</span>
                            <span><strong className="text-slate-700">Unit:</strong> {product.unit}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className="text-gray-400">📍</span>
                            <span><strong className="text-slate-700">Location:</strong> {product.location}</span>
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs mt-auto pt-4 border-t border-gray-100">
                          Added: {formatDate(product.createdAt)}
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
                        <button
                          onClick={() => fetchProductById(product.id)}
                          className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 text-white border-none px-4 py-2.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-sm text-sm flex items-center justify-center gap-2"
                        >
                          <span>✏️</span> Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="flex-1 bg-linear-to-r from-red-500 to-red-600 text-white border-none px-4 py-2.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-sm text-sm flex items-center justify-center gap-2"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 text-gray-500 bg-linear-to-b from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-6">📦</div>
                    <h4 className="text-gray-600 mb-3 text-2xl font-semibold">
                      {searchTerm || categoryFilter ? "No matching products found" : "No products yet"}
                    </h4>
                    <p className="mb-8 text-gray-500 max-w-md mx-auto">
                      {searchTerm || categoryFilter
                        ? "Try adjusting your search terms or filters to find what you're looking for."
                        : "Start building your product catalog by adding your first product."}
                    </p>
                    {searchTerm || categoryFilter ? (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("");
                        }}
                        className="bg-linear-to-r from-gray-600 to-gray-700 text-white border-none px-8 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:from-gray-700 hover:to-gray-800 hover:shadow-lg text-sm"
                      >
                        Clear All Filters
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab("create")}
                        className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-none px-8 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/30 text-sm"
                      >
                        Add Your First Product
                      </button>
                    )}
                  </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
                    <div className="text-gray-500 text-sm">
                      Page <strong className="text-slate-800">{pagination.currentPage}</strong> of{" "}
                      <strong className="text-slate-800">{pagination.totalPages}</strong> •{" "}
                      <strong className="text-slate-800">{pagination.totalProducts || 0}</strong> total products
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => fetchProducts(pagination.prevPage)}
                        disabled={!pagination.hasPrev}
                        className="bg-gray-100 text-gray-700 border-none px-5 py-2.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 flex items-center gap-2"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => fetchProducts(pagination.nextPage)}
                        disabled={!pagination.hasNext}
                        className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-none px-5 py-2.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-purple-600 flex items-center gap-2"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {(activeTab === "create" || activeTab === "edit") && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-gray-500">
                  {selectedProduct
                    ? "Update product details below"
                    : "Fill in the details to add a new product to your catalog"}
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab("products");
                }}
                className="bg-gray-100 text-gray-700 border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:shadow-sm flex items-center gap-2"
              >
                ← Back to Products
              </button>
            </div>

            <form
              onSubmit={selectedProduct ? updateProduct : createProduct}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="mb-2 text-slate-800 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>📝</span> Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={productForm.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                    placeholder="Enter product name"
                    className="px-4 py-3.5 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="price"
                    className="mb-2 text-slate-800 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>💰</span> Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      value={productForm.price}
                      onChange={(e) =>
                        handleFormChange("price", e.target.value)
                      }
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10 pr-4 py-3.5 border border-gray-300 rounded-lg text-base w-full transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="category"
                    className="mb-2 text-slate-800 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>🏷️</span> Category *
                  </label>
                  <select
                    id="category"
                    value={productForm.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    required
                    className="px-4 py-3.5 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm bg-white"
                  >
                    <option value="">Select a category</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="unit"
                    className="mb-2 text-slate-800 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>📦</span> Unit *
                  </label>
                  <select
                    id="unit"
                    value={productForm.unit}
                    onChange={(e) => handleFormChange("unit", e.target.value)}
                    required
                    className="px-4 py-3.5 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm bg-white"
                  >
                    <option value="">Select unit</option>
                    {availableUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="location"
                    className="mb-2 text-slate-800 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>📍</span> Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={productForm.location}
                    onChange={(e) =>
                      handleFormChange("location", e.target.value)
                    }
                    placeholder="Enter storage location"
                    className="px-4 py-3.5 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm"
                  />
                </div>

                <div className="flex flex-col md:col-span-2 lg:col-span-3">
                  <label
                    htmlFor="description"
                    className="mb-2 text-slate-800 font-semibold text-sm flex items-center gap-2"
                  >
                    <span>📄</span> Description
                  </label>
                  <textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                    rows="4"
                    placeholder="Enter product description..."
                    className="px-4 py-3.5 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:shadow-sm resize-none"
                  />
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                <h4 className="text-slate-800 mb-4 pb-3 border-b border-blue-200 text-xl font-bold flex items-center gap-2">
                  <span>👁️</span> Product Preview
                </h4>
                <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <strong className="text-slate-800 text-xl">
                        {productForm.name || "Product Name"}
                      </strong>
                      <div className="text-blue-600 text-sm font-medium mt-1">
                        {productForm.category || "Category"}
                      </div>
                    </div>
                    <span className="text-green-600 font-bold text-xl">
                      {productForm.price
                        ? formatPrice(productForm.price)
                        : "$0.00"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="flex items-center gap-2">
                        <span>📦</span> Unit:
                      </span>
                      <span className="font-medium">{productForm.unit || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="flex items-center gap-2">
                        <span>📍</span> Location:
                      </span>
                      <span className="font-medium">{productForm.location || "Not specified"}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-gray-700 mb-2 font-medium">Description:</div>
                      <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {productForm.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-start flex-wrap pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-linear-to-r from-blue-500 to-purple-600 text-white border-none px-8 py-3.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                      {selectedProduct ? "Updating..." : "Creating..."}
                    </>
                  ) : selectedProduct ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab("products");
                  }}
                  className="bg-gray-100 text-gray-700 border-none px-6 py-3.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:shadow-sm"
                >
                  Cancel
                </button>
                {selectedProduct && (
                  <button
                    type="button"
                    onClick={() => deleteProduct(selectedProduct.id)}
                    className="bg-linear-to-r from-red-500 to-red-600 text-white border-none px-6 py-3.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-sm"
                  >
                    Delete Product
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;
