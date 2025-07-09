import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOrder, setSortOrder] = useState('relevant');
  const [locationSearch, setLocationSearch] = useState('');

  // Toggle Category Filter
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Toggle Subcategory (Location) Filter
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Apply Filters
  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    // Apply location search filter
    if (locationSearch) {
      productsCopy = productsCopy.filter((item) =>
        item.location?.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOrder === 'low-high') {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, sortOrder, search, showSearch, locationSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t">
      {/* Filter Sidebar */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
        </p>
        <img
          className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
          src={assets.dropdown_icon}
          alt="Toggle Filters"
        />

        {/* Search by Location */}
        <div className="border border-gray-300 p-3 mt-6">
          <p className="mb-2 text-sm font-medium">SEARCH BY LOCATION</p>
          <input
            type="text"
            placeholder="Enter location..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORY</p>
          {['Apartment', 'House', 'Villa', 'Commercial', 'Luxury Villa', 'Modern Apartment', 'Beachfront'].map(
            (item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={category.includes(item)}
                  onChange={toggleCategory}
                />
                <label className="text-sm">{item}</label>
              </div>
            )
          )}
        </div>

        {/* Subcategory (Location) Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">LOCATIONS</p>
          {['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya'].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={item}
                checked={subCategory.includes(item)}
                onChange={toggleSubCategory}
              />
              <label className="text-sm">{item}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Product Listing */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1="  ALL  " text2=" Properties " />
          {/* Sorting Dropdown */}
          <select
            className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none focus:ring focus:ring-gray-200"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              location={item.location} // Added location to ProductItem
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
