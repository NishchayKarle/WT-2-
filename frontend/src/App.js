import React,{Component} from 'react';
import './App.css';
import MedicineList from './components/medicine-list';
import MedicineDetails from './components/medicine-details';
import MedicineForm from './components/medicine-form';
import FontAwesome from 'react-fontawesome';
import {withCookies} from 'react-cookie';

class App extends Component{
  
  state ={
    medicines: [],
    selectedMedicine: null,
    Token_admin:'Token ea0df0648b09800692c69718013883caead89d55',
    editedMedicine:null,
    token:this.props.cookies.get('token')
  }
  componentDidMount(){
    console.log(this.state.token);
    if(this.state.token!=='undefined' && this.state.token){
      fetch(`http://127.0.0.1:8000/api/medicines/`,{
            method: 'GET',
            header:{
              'Authorization': `Token ${this.state.token}`
            }
          }).then(resp => resp.json())
          .then(res => this.setState({medicines: res}))
          .catch(error => console.log(error))
    }
    else{
      window.location.href="/";
      
    }

    
  }

  loadMedicine = medicine => {
    this.setState({selectedMedicine: medicine, editedMedicine:null});
  }

  medicineDeleted = selmedicine => {
    const medicines = this.state.medicines.filter(medicine => medicine.id !== selmedicine.id);
    this.setState({medicines: medicines, selectedMedicine:null })
  } 

  editClicked = selmedicine => {
    this.setState({editedMedicine:selmedicine});
    //console.log(selmedicine)
  } 

  newMedicine = () => {
    this.setState({editedMedicine:{name:'',description:'',type:''}});
  }

  cancelForm = () => {
    this.setState({editedMedicine:null});
  }

  addMedicine = medicine => {
    this.setState({medicines:[...this.state.medicines,medicine], selectedMedicine:medicine, editedMedicine:null});

    console.log(medicine);

  }
  navigateClicked = () => {
    window.location.href="/";

  }
  logoutClicked = () => {
    window.location.href="http://localhost:8080/week5/index.html";
      this.props.cookies.set('token','');
  }

  render() {
    return (
    <div className="App">
      <button className="logout" onClick={this.logoutClicked}>Logout</button>
      <br/>
      <FontAwesome name="">
        <h1 className="main_title">
        <FontAwesome name="clinic-medical"/>
          Medicine Recommendation App
          </h1>
        </FontAwesome>
      <div className="layout">
        <div>
          <MedicineList medicines={this.state.medicines} medicineClicked={this.loadMedicine} 
          medicineDeleted = {this.medicineDeleted} editClicked={this.editClicked} newMedicine={this.newMedicine} token={this.state.token}/>
        </div>
        <div>
          {!this.state.editedMedicine ?(
            <MedicineDetails medicine={this.state.selectedMedicine} 
              updateMedicine={this.loadMedicine}token={this.state.token}/>
          ) :(
            <MedicineForm medicine={this.state.editedMedicine} cancelForm={this.cancelForm}
            newMedicine={this.addMedicine} editedMedicine={this.loadMedicine} token={this.state.token} />
          )}
        </div>
      </div>
    </div>
    
  );
  }
  
}

export default withCookies(App);
