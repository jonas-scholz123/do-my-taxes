import React from 'react';
import Table from '../components/Table';
import ClipLoader from 'react-spinners/ClipLoader'

class PortfolioTable extends React.Component {

    constructor(props) {
      // props: apiURL, mainButton, 
      super(props);
  
      this.state = {
        error: null,
        isLoaded: false,
        data: []
      };
    }
  
    componentDidMount() {
      fetch(this.props.apiURL)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            data: result
          });
        },
  
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
    }
  
    render() {
  
      const {error, isLoaded, data } = this.state;

        if (error) {
            return <div> Error; {error.message} </div>;
            }
        else if (!isLoaded) {
            return (
                <div className="flex justify-center items-center">
                    <ClipLoader loading={!isLoaded} size={150} />
                </div>
            )
        }
  
          return (
              <div className="w-full">
                  <div className="w-full justify-center">
                      <Table
                          content={data}
                          />
                  </div>
              </div>
          )
      }
}

export default PortfolioTable;