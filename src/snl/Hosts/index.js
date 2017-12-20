import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import moment from 'moment';
import SNLHosts from '../../redux/SNLHosts';
import './hosts.css';

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

      if(block.image){
        image = <img src={ block.image.thumbImgUrl } />;
      }
      DOB = block.node.nodeProperties.find( property => property.propertyName === "date_of_birth" );
      let hostingDates = block.blather.split(')');
      hostingDates = hostingDates.filter( (hostingDate)=>{
        let tryDate = decodeURI(hostingDate.replace(/&nbsp;/gi,' ').split(';')[0]).replace(/(<([^>]+)>)/ig,"");
        var dateFormat = "DD/MM/YYYY";
        return !moment(tryDate, dateFormat, false).isValid();
      });
      hostingDates = hostingDates.map( hostingDate => decodeURI(hostingDate.replace(/&nbsp;/gi,' ').split(';')[0]).replace(/(<([^>]+)>)/ig, "") );

      let yearsBetween = 'n/a';
      let lastMonth = hostingDates[hostingDates.length - 1].split(' ')[1].replace(/ /gi,' ').replace(/,/gi,' ');
      let firstMonth = hostingDates[0].split(' ')[1].replace(/ /gi,' ').replace(/,/gi,' ');

      if(isNaN(lastMonth)){
        const lastDate = moment([
          hostingDates[hostingDates.length - 1].split(',')[hostingDates[hostingDates.length - 1].split(',').length-1],
          moment().month(lastMonth).format("M") - 1,
          parseInt(hostingDates[hostingDates.length - 1].split(' ')[2].replace(/ /gi,' ').replace(/,/gi,' '))
        ]);
        const firstDate = moment([
          hostingDates[0].split(',')[hostingDates[0].split(',').length-1],
          moment().month(firstMonth).format("M") - 1,
          parseInt(hostingDates[0].split(' ')[2].replace(/ /gi,' ').replace(/,/gi,' '))
        ]);

        yearsBetween = (lastDate.diff(firstDate, 'days')/365).toFixed(2);
      }


      return (
        <tr>
          <td className="centerAlign">{ index + 1 }</td>
          <td className="hideOnMobile centerAlign">{ image }</td>
          <td>{ block.name }</td>
          <td className="hideOnMobile centerAlign">{ moment(DOB.propertyValue).format("MM/DD/YYYY") }</td>
          <td className="centerAlign">{ hostingDates.length - 1 || 1 }</td>
          <td className="centerAlign">{ hostingDates[0] }</td>
          <td className="centerAlign"> { this.getAge( moment(DOB.propertyValue).format("MM/DD/YYYY"), hostingDates[0].replace(/ /gi,' ') ) }</td>
          <td className="centerAlign">{ hostingDates[hostingDates.length - 1] }</td>
          <td className="centerAlign"> { this.getAge( moment(DOB.propertyValue).format("MM/DD/YYYY"), hostingDates[hostingDates.length - 1].replace(/ /gi,' ') ) }</td>
          <td className="hideOnMobile centerAlign yearsBetween">{ yearsBetween}</td>
          <td className="hideOnMobile"> <ul> { this.renderHostingDates( hostingDates )} </ul></td>
        </tr>
      );
    });
  }

  getAge = (dob, hostDate) => {
    const dobMoment = moment([
      dob.split('/')[2],
      dob.split('/')[0],
      dob.split('/')[1]
    ]);
    let hostMonth = hostDate.split(' ')[1].replace(/ /gi,' ').replace(/,/gi,' ');
    let hostYear = hostDate.split(',')[hostDate.split(',').length-1];
    let hostDay = parseInt(hostDate.split(' ')[2].replace(/ /gi,' ').replace(/,/gi,' '));
    if(!isNaN(hostMonth)){
      hostMonth = hostDate.split(' ')[0].replace(/ /gi,' ').replace(/,/gi,' ');
    }
    if(hostDay.toString().length > 2){
      hostDay = parseInt(hostDate.split(' ')[1].replace(/ /gi,' ').replace(/,/gi,' '));
    }

    hostDate = moment([
      hostYear,
      moment().month(hostMonth).format("M") - 1,
      hostDay
    ]);

    let ageAtHostDate = (hostDate.diff(dobMoment, 'days')/365).toFixed(2);

    return ageAtHostDate;
  }

  renderHostingDates = (hostingDates) => {
    return hostingDates.map( hostingDate => <li>{ hostingDate }</li> );
  }

  render(){
    if(this.props.hosts.length === 0){
      return null;
    }
    return(
      <div className="content-Holder">
        <table className="hostsTable" border="0" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th>Index</th>
              <th className="hideOnMobile">Image</th>
              <th className="leftAlign">Name</th>
              <th className="hideOnMobile">DOB</th>
              <th>Times</th>
              <th>First Hosted</th>
              <th>Age</th>
              <th>Last Hosted</th>
              <th>Age</th>
              <th className="hideOnMobile yearsBetween">Years Between First and Last Hosting</th>
              <th className="hideOnMobile leftAlign">Hosting Dates</th>
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
