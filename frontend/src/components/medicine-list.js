import React from 'react';
var FontAwesome = require('react-fontawesome');

function MedicineList(props) {

    const medicineClicked = (medicine) => evt => {
        props.medicineClicked(medicine);
    };

    const editClicked = (medicine) => evt => {
        props.editClicked(medicine);
    };

    const removeClicked = (medicine) => evt => {
        fetch(`http://127.0.0.1:8000/api/medicines/${medicine.id}/`,{
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Token ${props.token}`
            },
            }).then(resp =>props.medicineDeleted(medicine))
            .catch(error => console.log(error))
    };

    const newMedicine = () => {
        props.newMedicine();
    }

    return (
        <React.Fragment>
            {props.medicines.map(medicine => {
            return (
                <div key={medicine.id}  className="medicine-item" >
                    <h3 className="med_list" key={medicine.id} onClick={medicineClicked(medicine)}>
                    {medicine.name}
                    </h3>
                    <FontAwesome name="edit" onClick={editClicked(medicine)}/>
                    <FontAwesome name="trash" onClick={removeClicked(medicine)}/>
    
                </div>
                
            )
            
        })}
        <button onClick={newMedicine}> Add New</button>
        </React.Fragment>
    )
}

export default MedicineList; 