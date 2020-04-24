import React,{Component} from 'react';
//var FontAwesome = require('react-fontawesome');

class MedicineForm extends Component {

    state = {
        editedMedicine: this.props.medicine,
    }
    cancelClicked = () => {
        this.props.cancelForm();
    }

    inputChanged = event => {
        let medicine = this.state.editedMedicine;
        medicine[event.target.name] = event.target.value;
        this.setState({editedMedicine: medicine});

    }

    saveClicked = () => {
        fetch(`http://127.0.0.1:8000/api/medicines/`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Token ${this.props.token}`
            },
            body:JSON.stringify(this.state.editedMedicine)
            }).then(resp => resp.json())
            .then(res =>this.props.newMedicine(res))
            .catch(error => console.log(error))
    }

    updateClicked = () => {
        fetch(`http://127.0.0.1:8000/api/medicines/${this.props.medicine.id}/`,{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Token ${this.props.token}`
            },
            body:JSON.stringify(this.state.editedMedicine)
            }).then(resp => resp.json())
            .then(res =>this.props.editedMedicine(res))
            .catch(error => console.log(error))
    }

    render(){

        const isDisabled = this.state.editedMedicine.name.length ===0 || 
        this.state.editedMedicine.description.length === 0 ||
        this.state.editedMedicine.type.length ===0;

        return (
            <React.Fragment>
                <span>Name: </span><br/>
                <input type='text' name="name" value={this.props.medicine.name} onChange={this.inputChanged} /><br/>
                <span>Description: </span><br/>
                <textarea name="description" rows="5" value={this.props.medicine.description} onChange={this.inputChanged}/><br/>
                <span>Type: </span><br/>
                <input type="text" name="type" value={this.props.medicine.type} onChange={this.inputChanged} /><br/>
                {this.props.medicine.id? 
                <button disabled={isDisabled} onClick={this.updateClicked}>Update</button>
                :<button disabled={isDisabled} onClick={this.saveClicked}>Save</button>}
                <button onClick={this.cancelClicked}>Cancel</button>
                
                
            </React.Fragment>
        )
    }

}

export default MedicineForm;