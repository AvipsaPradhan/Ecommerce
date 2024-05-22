import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import VerticalCard from '../components/VerticalCard';

const SearchProduct = () => {
    const query = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("query", query.search);

    const fetchProduct = async () => {
        setLoading(true);
        const response = await fetch(SummaryApi.searchProduct.url + query.search);
        const dataResponse = await response.json();
        setLoading(false);

        setData(dataResponse.data);

        // Update searchQuery for the current user
        const currentUser = JSON.parse(localStorage.getItem('user')); // Assuming you store user information in localStorage
        if (currentUser) {
            await updateUserSearchQuery(currentUser._id, query.search);
        }
    };

    const updateUserSearchQuery = async (userId, newSearchQuery) => {
      try {
          // Fetch current searchQuery of the user
          const userResponse = await fetch(`/api/users/${userId}`);
          const userData = await userResponse.json();
          const oldSearchQuery = userData.searchQuery || [];
  
          // Append the new search query to the existing array
          const updatedSearchQuery = [...oldSearchQuery, newSearchQuery];
  
          // Update user document with the updated search query
          const response = await fetch(`/api/users/${userId}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ searchQuery: updatedSearchQuery })
          });
          const data = await response.json();
          console.log('User search query updated successfully:', data);
      } catch (error) {
          console.error('Error updating user search query:', error);
      }
  };
  

    useEffect(() => {
        fetchProduct();
    }, [query]);

    return (
        <div className='container mx-auto p-4'>
            {loading && (
                <p className='text-lg text-center'>Loading ...</p>
            )}

            <p className='text-lg font-semibold my-3'>Search Results: {data.length}</p>

            {data.length === 0 && !loading && (
                <p className='bg-white text-lg text-center p-4'>No Data Found....</p>
            )}

            {data.length !== 0 && !loading && (
                <VerticalCard loading={loading} data={data} />
            )}
        </div>
    );
};

export default SearchProduct;
