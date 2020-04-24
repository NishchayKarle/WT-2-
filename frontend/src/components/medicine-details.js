import React,{Component} from 'react';
var FontAwesome = require('react-fontawesome');

class MedicineDetails extends Component {

    state = {
        highlighted: -1, 
    }

    highlightRate = high => evt =>{
        this.setState({highlighted:high})
    }

    rateClicked = stars => evt => {
        fetch(`http://127.0.0.1:8000/api/medicines/${this.props.medicine.id}/rate_medicine/`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Token ${this.props.token}`
            },
            body:JSON.stringify({stars: stars+1})
            }).then(resp => resp.json())
            .then(res =>this.getDetails())
            .catch(error => console.log(error))
    }

    getDetails = () => {
        fetch(`http://127.0.0.1:8000/api/medicines/${this.props.medicine.id}/`,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Token ${this.props.token}`
            },
            }).then(resp => resp.json())
            .then(res => this.props.updateMedicine(res))
            .catch(error => console.log(error))
    }

    render(){
        const med = this.props.medicine; 
        return (
            <React.Fragment>
                {this.props.medicine? (
                <div>
                        <FontAwesome name=""><h3 className="title">{med.name}</h3></FontAwesome>
                        < br/>
                        <FontAwesome name=""><h3 className="type">{med.type}</h3></FontAwesome><br/>
                        <FontAwesome name="" className="fa">Effectivenes:  </FontAwesome>
                        <h3 className="nobr"> </h3>
                        <FontAwesome name="star" className={med.avg_rating > 0.5 ?'orange':''}/>
                        <FontAwesome name="star" className={med.avg_rating > 1.5 ?'orange':''}/>
                        <FontAwesome name="star" className={med.avg_rating > 2.5 ?'orange':''}/>
                        <FontAwesome name="star" className={med.avg_rating > 3.5 ?'orange':''}/>
                        <FontAwesome name="star" className={med.avg_rating > 4.5 ?'orange':''}/>
                        <span className="no_of_ratings">({med.no_of_ratings})</span>
                        <h3 className="description">{med.description}</h3>

                        <div className="rate-container">
                        <FontAwesome name=""className='fa'>Rate your experience:</FontAwesome>
                        <h3 className="nobr"> </h3>
                        {[...Array(5)].map( (e,i) => {
                            return <FontAwesome key={i} name ="star" className={this.state.highlighted >i-1 ?'purple':'' } 
                                onMouseEnter={this.highlightRate(i)} onMouseLeave={this.highlightRate(-1)} onClick={this.rateClicked(i)}/>
                        })}
                        </div>
                </div>
                    
            ):null}
            </React.Fragment>
            
        )
    }
}

export default MedicineDetails;