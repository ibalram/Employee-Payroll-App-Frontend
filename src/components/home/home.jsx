import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './home.scss';
import EmployeeService from '../../services/employee-service';

class Home extends React.Component{
    employeeService = new EmployeeService();
    constructor(props){
        super(props);
        this.state={
            employeeArray: []
        }
        // this.getAllEmployees();
    }
    componentDidMount(){
        this.getAllEmployees();
    }
    getAllEmployees(){
        (new EmployeeService()).getAllEmployees().then(data => {
            console.log(data);
            // this.setState({employeeArray : data.data});
            this.setState({employeeArray: data.data.data});
        }).catch(err => console.log(err));
    }

    remove(id){
        (new EmployeeService()).deleteEmployee(id).then(data => {
            alert("Delete successfully");
            console.log("Delete successfully");
            window.location.reload();
        }).catch(err => console.log(err));
    }

    render(){
        return (
            <div className="body">
                <header className='header-content header row center'>
                    <div className="logo">
                        <img src='/assets/images/logo.png' alt="" />
                        <div>
                            <span className="emp-text">EMPLOYEE</span> <br/>
                            <span className="emp-text emp-payroll">PAYROLL</span>
                        </div>
                    </div>
                </header>
                <div className="main-content">
                    <div className="header-content">
                        <div className="emp-detail-text">
                            Employee Details <div className="emp-count">{this.state.employeeArray.length}</div>
                        </div>
                        <a href="/employee-form" className="add-button">
                            <img alt="" src='/assets/icons/add-24px.svg' />Add User</a>
                    </div>
                    <div className="table-main">
                        <table id="display" className="table">
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Department</th>
                                    <th>Salary</th>
                                    <th>Start Date</th>
                                    <th>Action</th>
                                </tr>
                            </tbody>
                            <tbody>
                                {this.state.employeeArray && this.state.employeeArray.map(employee => (
                                    <tr key={employee.id.toString()}>
                                        <td><img className="profile" src={employee.profilePic} alt=""/></td>
                                        <td>{employee.name}</td>
                                        <td>{employee.gender}</td>
                                        <td>
                                            {employee.department && employee.department.map(department => <div key={department} className="dept-label">{department}</div>)}
                                        </td>
                                        <td>₹ {employee.salary}</td>
                                        <td>{employee.startDate}</td>
                                        <td>
                                            <img id={employee.id} style={{paddingRight: '10px'}} onClick={()=>this.remove(employee.id)} src="/assets/icons/delete-black-18dp.svg" alt="delete" />
                                            <Link to={{
                                                pathname: '/employee-form',
                                                state: ["update", employee]
                                            }}><img id={employee.id} style={{paddingLeft: '10px'}} src="/assets/icons/create-black-18dp.svg" alt="edit" /></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>   
                </div>
            </div>
        );
    }
}

export default withRouter(Home);