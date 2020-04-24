import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import FontAwesome from 'react-fontawesome';
class Symptoms extends Component {

    state = {
        symptoms:{
            fever:'',
            fatigue:'',
            cough:'',
            sneezing:'',
            aches_and_pains:'',
            runny_or_stuffy_nose:'',
            sore_throat:'',
            diarrhoea:'',
            headaches:'',
            shortness_of_breadth:'',
        },
        symptom_display:true,
        disease:''
    }
    navigateCicked = () => {
        this.props.toggleView2();
        this.props.patientinfo();
    }
    navigateCicked2 = () => {
       window.location.href = "/medicines";
    }

    onChangeRadio = evt => {
        let symptoms = this.state.symptoms;
        symptoms[evt.target.name] = evt.target.value;
        this.setState({symptoms: symptoms});
    }

    diagnosisClicked = () => {
        fetch(`http://127.0.0.1:8000/api/users/${this.props.login.id}/tree/`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(this.state.symptoms)
            }).then(resp => resp.json())
            .then(res => this.displayDisease(res))
            .catch(error => console.log(error));
            this.setState({symptom_display:false})
    }

    toggleView3 = () =>
    {
        this.setState({symptom_display:true})
    }

    displayDisease = res => {
        this.setState({disease:res})
        res=(res==='Cold'?'Common Cold':res);
        let dis = {
            p_t_f:res+'(24/04/2020)',
        }
        console.log(this.props.cookies.get('token'));
        fetch(`http://127.0.0.1:8000/api/users/10/ptf/`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Token ${this.props.cookies.get('token')}`
            },
            body:JSON.stringify(dis)
            }).then(resp => resp.json())
            .then(res => console.log(res))
            .catch(error => console.log(error));
    }
    logoutClicked = () => {
        window.location.href="http://localhost:8080/week5/index.html";
          this.props.cookies.set('token','');
    }
    
    render() {
        return(
            <div className="symptoms">
                {console.log(this.props.login.id)}
            <div>  
            <div className="menu"> 
            <button className="logout" onClick={this.logoutClicked}>Logout</button>
            <button className="logout" onClick={this.navigateCicked2}>Medicines</button> 
            <button className="logout" onClick={this.navigateCicked}>Patient Info</button>
            
            <br/>
            </div>
        <FontAwesome name="">
        <h1 className="main_title3">
        <FontAwesome name="clinic-medical"/>
          Medicine Recommendation App
          </h1>
        </FontAwesome>
        {this.state.symptom_display ? (
            <div>
                <div>
            <h1>Symptoms</h1>
            </div> 
            <div className="display-symptoms">
            <div>
                Fever
            </div>
            <div>
            <input type="radio" name ="fever" value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ="fever" value="rare" className="radio" 
            onChange={this.onChangeRadio} />Rare<br/><br/>
            </div>
            <div>
                Fatigue
            </div>
            <div>
            <input type="radio" name ="fatigue" value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ="fatigue" value="sometimes" className="radio" 
            onChange={this.onChangeRadio} />Sometimes<br/><br/>
            </div>
            <div>
                Cough
            </div>
            <div>
            <input type="radio" name ="cough" value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ="cough" value="mild" className="radio" 
            onChange={this.onChangeRadio} />Mild<br/><br/>
            </div>
            <div>
                Sneezing
            </div>
            <div>
            <input type="radio" name ="sneezing" value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ="sneezing" value="no" className="radio" 
            onChange={this.onChangeRadio} />No<br/><br/>
            </div>
            <div>
                Aches and Pains
            </div>
            <div>
            <input type="radio" name ='aches_and_pains' value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ="aches_and_pains" value="sometimes" className="radio" 
            onChange={this.onChangeRadio} />Sometimes<br/><br/>
            </div>
            <div>
                Runny or Stuffy Nose
            </div>
            <div>
            <input type="radio" name ='runny_or_stuffy_nose' value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ="runny_or_stuffy_nose" value="rare" className="radio" 
            onChange={this.onChangeRadio} />Rare<br/><br/>
            </div>
            <div>
                Sore Throat
            </div>
            <div>
            <input type="radio" name ='sore_throat' value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ='sore_throat' value="sometimes" className="radio" 
            onChange={this.onChangeRadio} />Sometimes<br/><br/>
            </div>
            <div>
                Diarrhoea
            </div>
            <div>
            <input type="radio" name ="diarrhoea" value="no" className="radio" 
            onChange={this.onChangeRadio} />No<br/><br/>
            </div>
            <div>
            <input type="radio" name ='diarrhoea' value="sometimes" className="radio" 
            onChange={this.onChangeRadio} />Sometimes<br/><br/>
            </div>
            <div>
                Headaches
            </div>
            <div>
            <input type="radio" name ='headaches' value="common" className="radio"
                onChange={this.onChangeRadio}/>Common<br/>
            </div>
            <div>
            <input type="radio" name ="headaches" value="rare" className="radio" 
            onChange={this.onChangeRadio} />Rare<br/><br/>
            </div>
            <div>
                Shortness of Breath
            </div>
            <div>
            <input type="radio" name ='shortness_of_breadth' value="no" className="radio" 
            onChange={this.onChangeRadio} />No<br/><br/>
            </div>
            <div>
            <input type="radio" name ='shortness_of_breadth' value="sometimes" className="radio" 
            onChange={this.onChangeRadio} />Sometimes
            </div>
        </div>
            </div>
             ) :(
                <h1>
                <br/>
                <br/>
                <br/>
                You have been diagnosed with the {this.state.disease}
                <br/>
                <br/>
                <br/>
                <br/>
                Go to the medicines tab to choose medicines
                <br/>
                <br/>
                <br/>
                or
                <br/>
                <br/>
                {!this.state.symptom_display ? 
                <button className="menu" onClick={this.toggleView3} display="none" > {this.state.symptom_display? '' :'Do diagnosis again' } </button>
                :''}
                <br/>
                <br/>
                <br/>
                <br/>
                </h1>
        )
         }
        
        </div>
        {this.state.symptom_display ?
            <button className="diagnosis" onClick={this.diagnosisClicked}><h1 className="nobr">Start Diagnosis</h1></button>
        :''}
        
       
        </div>
            
        )
}}

export default withCookies(Symptoms);