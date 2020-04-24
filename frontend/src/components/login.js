import React,{Component}from 'react'; 
import {withCookies} from 'react-cookie';
import Symptoms from './symptoms';
import FontAwesome from 'react-fontawesome';
import symptoms from './symptoms';
class Login extends Component {

    state = {
        credentials:{
            username:'',
            password:'',
            email:'',
            age:'',
            gender:''
        },
        token:'',
        isLoginView:true,
        id:null,
        something:true,
        something2:true,
        info:{
            username:'',
            p_t_f:'',
            email:'',
            gender:'1',
            age:''
        }
    }

    inputChanged = event => {
        let credentials = this.state.credentials;
        credentials[event.target.name] = event.target.value;
        this.setState({credentials: credentials});

    }

    login = event => {
        fetch(`http://127.0.0.1:8000/auth/`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(this.state.credentials)
            }).then(resp => resp.json())
            .then(res =>{
                    
                this.props.cookies.set('token',res.token);
                this.setState({token:res.token});
                console.log(res.token)
                if(this.props.cookies.get('token')!=='undefined'){
                    this.setState({id:res.id});
                    this.func();
                }
                else{
                    alert('The provided credentials are invalid'); 
                }

            })
            .catch(error => console.log(error))
    }
    toggleView = () => {
        this.setState({isLoginView:!this.state.isLoginView})
    }
    toggleView2 = () => {
        this.setState({something2:true})
    }
    func = () => {

        this.setState({something:false});
        fetch(`http://127.0.0.1:8000/api/users/${this.state.id}/`,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
            },
            }).then(resp => resp.json())
            .then(res => this.copyInfo(res))
            .catch(error => console.log(error))
    }

    copyInfo = res => {
        this.setState({info:res});
    }

    navigateClicked = () => {
       this.setState({something2:false});
    }
    registerClicked = () => {
        fetch(`http://127.0.0.1:8000/api/users/`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(this.state.credentials)
            }).then(resp => resp.json())
            .then(res => console.log(res))
            .catch(error => console.log(error));
            this.setState({isLoginView:!this.state.isLoginView});
    }
    logoutClicked = () => {
        window.location.href="http://localhost:8080/week5/index.html";
    }

    medicinesClicked = () => {
        window.location.href="/medicines";
    }

    render(){
        return(
        <div className="loginn">
        <div className="login">
        {this.state.something?
        <div className="login-container">
            <FontAwesome name="">
        <h1 className="main_title2">
        <FontAwesome name="clinic-medical"/>
          Medicine Recommendation App
          </h1>
        </FontAwesome>
            
                {this.state.isLoginView?
                <div>
                <h1>
                Login
                </h1>
                <span>Username: </span><br/>
                <input className="login-input" type="text" name="username" value={this.state.credentials.username}
                    onChange={this.inputChanged}/> <br/>
                <span>Password: </span><br/>
                <input className="login-input" type="password" name="password" value={this.state.credentials.password}
                    onChange={this.inputChanged} /><br/>
                <button className="login-button" onClick={this.login}>Login</button>
                </div>
                :
                <div>
                    <h1>Register</h1>
                    <span>Username: </span><br/>
                    <input className="login-input" type="text" name="username" value={this.state.credentials.username}
                        onChange={this.inputChanged}/> <br/>

                    <span>Password: </span><br/>
                    <input className="login-input" type="password" name="password" value={this.state.credentials.password}
                        onChange={this.inputChanged} /><br/>

                    <span>Email: </span><br/>
                    <input className="login-input" type="text" name="email" value={this.state.credentials.email}
                        onChange={this.inputChanged}/> <br/>

                    <span>Age:</span><br/>
                    <input className="login-input" type="text" name="age" value={this.state.credentials.age}
                        onChange={this.inputChanged}/> <br/>
                    <span>Gender:</span><br/>
                    Male <input type="radio" name ='gender' value="1" className="radio"
                onChange={this.inputChanged}/>
                Female <input type="radio" name ='gender' value="2" className="radio"
                onChange={this.inputChanged}/><br/>
                    <button className="login-button" onClick={this.registerClicked}>Register</button>
                </div>   
                
                
                }
            <p className="x"onClick={this.toggleView}>{this.state.isLoginView?'Create Account':'Back to Login'}</p>
        </div>: (this.state.something2 ? 
        <div className="patientinfo">
            <button className="logout" onClick={this.medicinesClicked}>medicines</button>
        {this.state.something2? <button className="logout" onClick={this.logoutClicked}>Logout</button>:''}
            <FontAwesome name="">
        <h1 className="main_title2">
        <FontAwesome name="clinic-medical"/>
          Medicine Recommendation App
          </h1>
        </FontAwesome>
                <h1 className="xyz">Patient Info:-</h1>
                <h1>Name: {this.state.info.username}</h1>
                <h1>Patient History: {this.state.info.p_t_f}</h1>
                <h1>Email: {this.state.info.email}</h1>
                <h1>Age: {this.state.info.age}</h1>
                <h1>gender: {this.state.info.gender=='1'?'Male':'Female'}</h1>
                <button onClick={this.navigateClicked}>Get Checked</button>
        </div>
        : <Symptoms className="symptoms" login={this.state} patientinfo={this.func} toggleView2={this.toggleView2}/>)
        
    }   
        
        </div>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>
        )
     
    }

}

export default withCookies(Login);  