import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import SNLHosts from '../../redux/SNLHosts';

class Hosts extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.getHosts().then(() => {
      // Hide Loader
    });
  }

  renderHostLists = ()=> {
    return this.props.hosts.map( (block, index)=>{
      let image = null;
      let DOB = { date_of_birth: null };
      if(index === 0){
        console.log(block.blather.split(')').length - 1);
      }
      if(block.image){
        image = <img src={ block.image.thumbImgUrl } />;
      }
      DOB = block.node.nodeProperties.find( property => property.propertyName === "date_of_birth" );



      return (
        <tr>
          <td>{ index + 1 }</td>
          <td>{ image }</td>
          <td>{ block.name }</td>
          <td>{ DOB.propertyValue }</td>
          <td>{ block.blather.split(')').length - 1 || 1 }</td>
          <td>First Hosted</td>
          <td>Last Hosted</td>
          <td>Time Between First and Last Hosting</td>
          <td>Hosting Dates</td>
        </tr>
      );
    });
  }

  render(){
    if(this.props.hosts.length === 0){
      return null;
    }
    return(
      <div className="content-Holder">
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Image</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Times</th>
              <th>First Hosted</th>
              <th>Last Hosted</th>
              <th>Time Between First and Last Hosting</th>
              <th>Hosting Dates</th>
            </tr>
          </thead>
          <tbody>
            { this.renderHostLists() }
          </tbody>
        </table>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      getHosts: () => dispatch(SNLHosts.actions.getHosts()),
    }
}

const mapStateToProps = (state) => {
  return {
    hosts: SNLHosts.selectors.hosts(state)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
