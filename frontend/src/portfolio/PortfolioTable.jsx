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
                <div class="flex justify-center items-center">
                    <ClipLoader loading={!isLoaded} size={150} />
                </div>
            )
        }
  
          const headers = Object.keys(data[0]).map(h => h.replaceAll("_", " "));
          const content = data.map(t => Object.values(t))
  
          return (
              <div class="w-full">
                  <div class="w-full justify-center">
                      <Table
                          headers={headers}
                          content={content}
                          />
                  </div>
              </div>
          )
      }
}

export default PortfolioTable;