import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './home.scss';
import EmployeeService from '../../services/employee-service';

class Home extends React.Component{
    employeeService = new EmployeeService();
    constructor(props){
        super(props);
        this.state={
            employeeArray: [],
            allEmployeeArray: []
        }
    }
    componentDidMount(){
        this.getAllEmployees();
    }
    getAllEmployees(){
        this.employeeService.getAllEmployees().then(data => {
            this.setState({
                employeeArray: data.data.data,
                allEmployeeArray: data.data.data
            });
        }).catch(err => alert(err));
    }

    remove(id){
        if (window.confirm("Are you sure to delete? This is an irreversible process.")){
            this.employeeService.deleteEmployee(id).then(data => {
                alert("Success: Deleted Successfully");
                window.location.reload();
            }).catch(err => alert(err));
        }
    }
    
    search = async (event) => {
        let keyword = event.target.value.trim().toLowerCase();
        await this.setState({ employeeArray: this.state.allEmployeeArray });
        let empArray = this.state.employeeArray;
        if (keyword.trim().length > 0)
          empArray = empArray.filter(emp => emp.name.toLowerCase().indexOf(keyword)>-1 || emp.department.some(dep=>dep.toLowerCase().indexOf(keyword)>-1));
        this.setState({ employeeArray: empArray });
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
                        <div className="search-box">
                        <div>
                            <img className="search-icon" src="/assets/icons/search-black-18dp.svg" alt="" /></div>
                            <input onChange={this.search} type="text"/>
                        </div>
                        <a href="/employee-form" className="add-button"><img alt="" src='/assets/icons/add-24px.svg'/>Add User</a>
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
                                            <img id={employee.id} style={{marginRight: '10px'}} onClick={()=>this.remove(employee.id)} src="/assets/icons/delete-black-18dp.svg" alt="delete" />
                                            <Link to={{
                                                pathname: '/employee-form',
                                                state: ["update", employee]
                                            }}><img id={employee.id} style={{marginRight: '10px'}} src="/assets/icons/create-black-18dp.svg" alt="edit" /></Link>
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