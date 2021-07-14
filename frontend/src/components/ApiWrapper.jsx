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
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])

    useEffect(() => {
      console.log("trying to fetch")
      fetch(apiUrl)
        .then(res => res.json())
        .then(
          (result) => {
            console.log("found in API wrapper: ", result)
            setData(result)
            setLoading(true)
          },
          (error) => {
            setError(error)
            setLoading(true)
          }
        )
    }, []);

    if (!loading) {
      return (
        <div>
          <ClipLoader loading={loading} size={150} />
        </div>
      )
    }

    if (error) {
      return <div> Error; {error.message} </div>;
    }
    
    console.log("Loaded... this is the data that was found: ", data)
    return <WrappedComponent data={data} {...props}/>
    
  }
}

export default withApiWrapper;