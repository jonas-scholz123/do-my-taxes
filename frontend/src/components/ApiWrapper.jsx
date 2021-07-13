import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

function Wrapper(props) {
  /*
  Requires two props: content (component) and apiUrl (string)
  Wraps content, fetches data from the provided apiUrl, while loading displays a loading wheel,
  after loaded, it displays content with the result of the api GET request result passed to the
  content component as a prop called "data".
  */
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([])

  const Content = props.content


  useEffect(() => {
    fetch(props.apiUrl)
      .then(res => res.json())
      .then(
        (result) => {
          //console.log("found in API wrapper: ", result)
          setLoading(true)
          setData(result)
        },
        (error) => {
          setLoading(true)
          setError(error)
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

  return <Content data={data}/>
}

export default Wrapper;