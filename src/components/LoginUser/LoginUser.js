import React, { Component } from 'react';
  
import Input from './Input/Input';

import userService from '../../services/user-service';

class LoginUser extends Component {

  state = {
    loginErorMessage: '',
    isFormValid: false,
    formControls: {
      user_name: {
        value: '',
        type: 'text',
        label: 'Type your username',
        errorMessage: 'Invalid User Name',
        placeholder: 'Type your username',
        valid: false,
        touched: false,
        validation: {
          required: true,
          maxLength: 50
        }
      },
      password: {
        value: '',
        type: 'password',
        label: 'Password',
        errorMessage: 'Invalid Password',
        placeholder: 'Type your username',
        valid: false,
        touched: false,
        validation: {
          required: true,
          minLenght: 6
        }
      }
    }
  };

  componentDidMount() {
    userService.logOut();
  }

  submitForm = (event) => {
    event.preventDefault();
    
    if(this.state.isFormValid) {
      let data = {
        user_name: this.state.formControls['user_name'].value,
        password: this.state.formControls['password'].value
      };


      userService.login(data, (success, user) => {
        if(success === true) {
          let path = '/user/' + user.user_name;

          this.props.history.push(path);

          userService.setUserData(user);
        } else {
          this.setState({
            loginErorMessage: 'Check your username and password, then try again'
          });
        }


      });

    } 
  }


  validateControl(value, validation) {
    if(!validation) {
      return true
    }

    let isValid = true;

    if(validation.required) {
      isValid = value.trim() !==  '' && isValid;
    }

    if(validation.minLenght) {
      isValid = value.length >= validation.minLenght && isValid;
    }

    if(validation.maxLength) {
      isValid = value.length <= validation.maxLength && isValid;
    }

    return isValid
  }

 onChangeHandler = (event, controlName) => {

  const formControls = {...this.state.formControls};
  const control = {...formControls[controlName]};

  control.value = event.target.value;
  control.touched = true;
  control.valid = this.validateControl(control.value, control.validation);

  formControls[controlName] = control;

  let isFormValid = true;

  Object.keys(formControls).forEach(name => {
    isFormValid = formControls[name].valid && isFormValid;
  }) 

  this.setState({
    formControls,
    isFormValid
  });

 }

 renderInputs() {
  return Object.keys(this.state.formControls).map((controlName, index) => {
    const control = this.state.formControls[controlName]
    return (
      <Input 
        key={controlName + index}
        type={control.type}
        value={control.value}
        valid={control.valid}
        touched={control.touched}
        label={control.label}
        placeholder={control.placeholder}
        shouldValidate={!!control.validation}
        errorMessage={control.errorMessage}
        onChange={(event) => this.onChangeHandler(event, controlName)}
      />
    )
  })

 }

  render() {
    return (
      <div className="row login-wrapp">
        <div className="col-xs-10 col-lg-3 col-sm-5">
          <legend>Login User:</legend>
          <hr/>
          <form onSubmit={this.submitForm}>

            {this.renderInputs()}
            <button type="submit" className='login-btn btn btn-primary btn-block' disabled={!this.state.isFormValid}>Login</button>
          </form> 
          {this.state.loginErorMessage !== '' ? <span>{this.state.loginErorMessage}</span> : null}
        </div>
      </div>
    );
  }
}

export default LoginUser;
