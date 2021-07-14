import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

function withApiWrapper(WrappedComponent, apiUrl) {
  /*
  Requires two props: content (component) and apiUrl (string)
  Wraps content, fetches data from the provided apiUrl, while loading displays a loading wheel,
  after loaded, it displays content with the result of the api GET request result passed to the
  content component as a prop called "data".
  */
  return (props) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
      fetch(apiUrl)
        .then(res => res.json())
        .then(
          (result) => {
            setData(result)
            setLoading(false)
          },
          (error) => {
            setError(error)
            setLoading(false)
          }
        )
    }, []);

    if (loading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <ClipLoader loading={loading} size={150} />
        </div>
      )
    }

    if (error) {
      return <div> Error; {error.message} </div>;
    }
    
    return <WrappedComponent data={data} {...props}/>
    
  }
}

export default withApiWrapper;