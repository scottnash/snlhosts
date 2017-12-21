import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import moment from 'moment';
import 'moment-precise-range-plugin';
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

  getImage = (block) => {
    return block.image ? <img src={ block.image.thumbImgUrl } alt={ block.name } /> : null;
  }

  getDOB = (block) => {
    return block.node.nodeProperties.find( property => property.propertyName === "date_of_birth" ) || { date_of_birth: null };
  }

  getHostingDates = ( hostingDates ) => {
    hostingDates =hostingDates.split(')');
    hostingDates = hostingDates.filter( (hostingDate)=>{
      let tryDate = decodeURI(hostingDate.replace(/&nbsp;/gi,' ').split(';')[0]).replace(/(<([^>]+)>)/ig,"");
      var dateFormat = "DD/MM/YYYY";
      return !moment(tryDate, dateFormat, false).isValid();
    });

    hostingDates = hostingDates.map( (hostingDate) => {
      let returnDate = {
        showDate: decodeURI(hostingDate.replace(/&nbsp;/gi,' ').split(';')[0]).replace(/(<([^>]+)>)/ig, "")
      }
      let returnMonth = returnDate['showDate'].split(' ')[1].replace(/ /gi,' ').replace(/,/gi,' ');

      returnDate.dateArray = [
        parseInt(returnDate['showDate'].trim().split(',')[returnDate['showDate'].split(',').length-1]),
        returnMonth = moment().month(returnMonth).format("M") - 1,
        parseInt(returnDate['showDate'].trim().split(' ')[1].replace(/ /gi,' ').replace(/,/gi,' '))
      ];

      return returnDate
    });
    return hostingDates;
  }

  renderHostLists = ()=> {
    return this.props.hosts.map( (block, index)=>{
      let DOB = this.getDOB(block);
      let hostingDates = this.getHostingDates(block.blather);

      let timeBetween = hostingDates.length > 1 ? moment.preciseDiff(hostingDates[hostingDates.length - 1].dateArray, hostingDates[0].dateArray, true) : 'n/a';

      return (
        <tr key={ block.rank }>
          <td className="centerAlign">{ index + 1 }</td>
          <td className="hideOnMobile centerAlign">{ this.getImage(block) }</td>
          <td>{ block.name }</td>
          <td className="hideOnMobile centerAlign">{ moment(DOB.propertyValue).format("MM/DD/YYYY") }</td>
          <td className="centerAlign">{ hostingDates.length || 1 }</td>
          <td className="centerAlign">{ hostingDates[0].showDate }</td>
          <td className="centerAlign"> { this.getAge( moment(DOB.propertyValue).format("MM/DD/YYYY"), hostingDates[0].dateArray ) }</td>
          <td className="centerAlign">{ hostingDates[hostingDates.length - 1].showDate }</td>
          <td className="centerAlign"> { this.getAge( moment(DOB.propertyValue).format("MM/DD/YYYY"), hostingDates[hostingDates.length - 1].dateArray ) }</td>
          <td className="hideOnMobile centerAlign yearsBetween">{ typeof timeBetween === 'string' ? timeBetween :  `${ timeBetween.years } years ${ timeBetween.months } months ${ timeBetween.days } days` }</td>
          <td className="hideOnMobile"> <ul> { this.renderHostingDates( hostingDates )} </ul></td>
        </tr>
      );
    });
  }

  getAge = (dob, hostDate) => {
    const dobMoment = moment([
      parseInt(dob.split('/')[2]),
      parseInt(dob.split('/')[0]) - 1,
      parseInt(dob.split('/')[1])
    ]);

    let ageAt = moment.preciseDiff(hostDate, dobMoment, true);

    return `${ ageAt.years } years ${ ageAt.months } months ${ ageAt.days } days`;

  }

  renderHostingDates = (hostingDates) => {
    return hostingDates.map( (hostingDate, index) => <li key={ index }>{ hostingDate.showDate }</li> );
  }

  render(){
    if(this.props.hosts.length === 0){
      return null;
    }
    return(
      <div className="content-Holder">
        <table className="hostsTable" border="0" cellSpacing="0" cellPadding="0">
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
              <th className="hideOnMobile yearsBetween">Time Between First and Last Hosting</th>
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
