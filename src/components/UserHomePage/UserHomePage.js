import React, { Component } from 'react';

import userService from '../../services/user-service';

class UserHomePage extends Component {

	state = {
		user: {
			user_name: '',
			user_type: ''
		},
		table: {
			rows: []
		}
	};

  constructor(props) {
    super(props);
  	this.getUserData(this.props.match.params.user);
  }

  componentDidMount() {

  	this.getDataTable();
  }

  getUserData = (user_name) => {
  	userService.loadUser((success, userData) => {
			if(success) {
				this.setState({
					user: userData.user
				})				
			} else {
				// go back to login page
				let path = '/';

				this.props.history.push(path);

			}
		}, user_name);
  }

  getDataTable = () => {
    	
      userService.getDataTable(dataTable => {
      	this.setState({
      		table: dataTable
      	})
      });
    }

  changeValue = (id, property, event) => {
  	let value = event.target.value
  	let table = this.state.table;

  	userService.changeDataTableRow(id, property, value, (id, row) => {
      table.rows[id] = row;
      this.setState({
      	table
      });
    });

  };


  addRow = () => {
  	userService.addRow(newDataTable => {
			this.setState({
				table: newDataTable
			});
    });
  }

  remove = id => {
  	let table = this.state.table;

  	userService.removeRow(id, id => {

      table.rows.splice(id, 1);

      this.setState({
      	table
      });
    })
  }

  render() {
    return (
      <div className="card w-100">
        <div className="card-body w-100">
          <div id="table" className="table-editable w-100">
            <table className="table table-bordered d table-striped text-center bg-white">
            <tbody>
            	<tr>
            	  <th className="text-center">Input Numerical Value</th>
            	  <th className="text-center">Input Unit of Measure</th>
            	  <th className="text-center">Target Unit of measure</th>
            	  <th className="text-center">Student Response</th>
            	  <th className="text-center">Output</th>
            	  {
            	  	this.state.user.user_type === 'admin' ? <th className="text-center">Remove</th> : null
            	  }
            	</tr>
              	{
              		this.state.table.rows.map((row, id) => {
              			return(
	              			<tr key={id}>
		              			<td>
		              				{
		              					this.state.user.user_type === 'admin' ?
		              					<input 
							             	 	type="number"  
							                className="form-control custom-min-w"
							                value={row.inputNumber}
							                onChange={event => this.changeValue(id, 'inputNumber', event)} />
		              					 : 	<div className="mt-2">{ row.inputNumber }</div>
		              				}			
		              			</td>

		              			<td>
		              				{
		              					this.state.user.user_type === 'admin' ?
			              					<select
		      					          	onChange={event => this.changeValue(id, 'inputUnitMeasureId', event)}
		      					            className="form-control custom-min-w"
		      					            defaultValue={+row.inputUnitMeasureId}>
		      					            	{
		      					            		row.avaliableUnitMeasure.map((unit, id) => {
		      					            			return(
		      					            				<option
		      					            				key={id}
		      					            				disabled={unit.group === true}
		      					            				value={id}>
		      					            					{unit.label}
		      					            				</option>
		      					            			)
		      					            		})
		      					            	}
		      					          </select>
		              					 :   row.inputUnitMeasureId !== '' ? <div className="mt-2"> { row.avaliableUnitMeasure[row.inputUnitMeasureId].label || '' } </div> : null
		              				}			
		              			</td>

		              			<td>
		              				{
		              					this.state.user.user_type === 'admin' ?
			              					<select
		      					          	onChange={event => this.changeValue(id, 'targetUnitMeasureId', event)}
		      					            className="form-control custom-min-w"
		      					            defaultValue={+row.targetUnitMeasureId}>
		      					            	{
		      					            		row.avaliableUnitMeasure.map((unit, id) => {
		      					            			return(
		      					            				<option
		      					            				key={id}
		      					            				disabled={unit.group === true}
		      					            				value={id}>
		      					            					{unit.label}
		      					            				</option>
		      					            			)
		      					            		})
		      					            	}
		      					          </select>
		              					 :   row.targetUnitMeasureId !== '' ? <div className="mt-2"> { row.avaliableUnitMeasure[row.targetUnitMeasureId].label || '' } </div> : null
		              				}
		              			</td>

		              			<td>
		              				{
		              					this.state.user.user_type === 'admin' ? 
	              							<div 
	    						           		className="w-75 d-inline-block h-50 mt-2">
	    						           		{ row.studentResponse }
	    						           	</div>
		              					:  <input 
									             className="border w-75 d-inline-block h-50 form-control"  
									             onChange={event => this.changeValue(id, 'studentResponse', event)} 
									             value={row.studentResponse} />
		              				}
		              			</td>

		              			<td>
		              				{
		              					this.state.user.user_type === 'admin' ? 
			              					<select
		      					          	onChange={event => this.changeValue(id, 'answerId', event)}
		      					            className="form-control custom-min-w"
		      					            defaultValue={+row.answerId}>
		      					            	{
		      					            		row.avaliableAnswers.map((unit, id) => {
		      					            			return(
		      					            				<option
		      					            				key={id}
		      					            				disabled={unit.group === true}
		      					            				value={id}>
		      					            					{unit.label}
		      					            				</option>
		      					            			)
		      					            		})
		      					            	}
		      					          </select> 
		      					          : row.answerId !== '' ? <div className="mt-2"> { row.avaliableAnswers[row.answerId].label || '' } </div> : null
		              				}
		              			</td>

		              			{
		              				this.state.user.user_type === 'admin' ? 
			              				<td >
								             <span className="table-remove">
								               <button type="button" className="my-0 btn btn-danger" onClick={() => this.remove(id)}>Remove</button>
								             </span>
								           </td> : null
		              			}
	              			</tr>
              			)
              		})
              	}
            </tbody>
               	  
						</table>
          </div>

          <div className="clearfix table-controls">
          	<span onClick={this.getDataTable} className="float-right refresh-btn text-primary mb-3 mt-3">
              Reload <i className="fa fa-sync" ></i>
            </span>
            {
            	this.state.user.user_type === 'admin' ?
            	 <span  className="table-add float-right mb-3 mr-5 mt-3">
            	   <span className="text-success" onClick={this.addRow}>
            	     Add row
            	     <i className="fa fa-plus"></i>
            	   </span>
            	 </span> : null
            }
          </div>

        </div>
      </div>

    );
  }
}

export default UserHomePage;
