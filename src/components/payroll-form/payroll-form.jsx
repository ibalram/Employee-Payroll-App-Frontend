import React, {useState} from  'react';
import './payroll-form.scss';
import { Link, withRouter } from 'react-router-dom';
import EmployeeService from '../../services/employee-service';
import validatorService from '../../services/validator-service';

const getDayList = {
    28: Array.from(new Array(28),(val,index)=>index+1),
    29: Array.from(new Array(29),(val,index)=>index+1),
    30: Array.from(new Array(30),(val,index)=>index+1),
    31: Array.from(new Array(31),(val,index)=>index+1)
};

const PayrollForm = (props) =>{
    let employeeService = new EmployeeService();
    let validator = new validatorService();
    let initialValue = {
        name: '',
        profileArray: [
            { url: '/assets/profile-images/Ellipse -1.png' },
            { url: '/assets/profile-images/Ellipse -2.png' },
            { url: '/assets/profile-images/Ellipse -3.png' },
            { url: '/assets/profile-images/Ellipse -4.png' },
            { url: '/assets/profile-images/Ellipse 1.png' },
            { url: '/assets/profile-images/Ellipse -8.png' },
            { url: '/assets/profile-images/Ellipse -7.png' }
        ],
        allDepartment: [
            'HR', 'Sales', 'Finance', 'Engineer', 'Others'
        ],
        days: Array.from(new Array(31),(val,index)=>index+1),
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        years: [2020,2019,2018,2017,2016],
        department: [],
        gender: '',
        salary: '400000',
        day: '1',
        month: 'Jan',
        year: '2020',
        startDate: '',
        note: '',
        id: '',
        profilePic: '',
        isUpdate: false,
        error: {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profilePic: '',
            startDate: ''
        }
    }

    if (props.location.state && props.location.state[0]==="update"){
        Object.assign(initialValue, props.location.state[1]);
        initialValue.isUpdate = true;
        [initialValue.day, initialValue.month, initialValue.year] = initialValue.startDate.split(" ");
        initialValue.day = parseInt(initialValue.day).toString();
        initialValue.salary = parseInt(initialValue.salary).toString();
    }

    const [formValue, setForm] = useState(initialValue);

    const changeValue  = (event) => {
        const {name, value} = event.target;
        let error=formValue.error;
        error = {...error,[name]:validator.validate(name, value)};
        setForm({...formValue, [name]: value, error: error});
    }
    const changeYearHandler = (event) =>{
        const {name, value} = event.target;
        if (formValue.month==="Feb"){
            setForm({...formValue, [name]: value, days: getDayList[new Date(value, 2, 0).getDate()]});
        }else{
            setForm({...formValue, [name]: value});
        }
    }
    const changeMonthHandler = (event) =>{
        const {name, value} = event.target;
        if (formValue.year.length>0){
            let monthValue = formValue.months.map(month=>month.slice(0,3)).indexOf(value)+1;
            setForm({...formValue, [name]: value, days: getDayList[new Date(formValue.year, monthValue, 0).getDate()]});
        }else{
            setForm({...formValue, [name]: value});
        }
    }

    const onCheckChange = (name) =>{
        let index = formValue.department.indexOf(name);
        let checkArray = [...formValue.department]
        if (index > -1)
            checkArray.splice(index, 1)
        else
            checkArray.push(name);
        setForm({ ...formValue, department: checkArray });
    }
    const getChecked = (name) =>{
        return formValue.department && formValue.department.includes(name);
    }

    const validData = async(object)=>{
        let error = {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profilePic: '',
            startDate: ''
        }
        const ls = error;
        let isError = false;
        Object.keys(ls).forEach(
            (val) => error={...error, [val]:validator.validate(val, object[val])}
        );
        Object.values(error).forEach(
            (val) => isError=isError||val.length>0
        );
        await setForm({...formValue, error:error});
        return isError;
    }

    const save = async (event) =>{
        event.preventDefault();
        let object = {
            name: formValue.name,
            profilePic: formValue.profilePic,
            gender: formValue.gender,
            department: formValue.department,
            salary: formValue.salary,
            startDate: `${formValue.day} ${formValue.month} ${formValue.year}`,
            note: formValue.note
        }
        if (await validData(object)){
            alert("Error: Invalid Form Values");
            return;
        }
        object.startDate = object.startDate.length<11?"0"+object.startDate : object.startDate;
        if(formValue.isUpdate){
            employeeService.updateEmployee(formValue.id, object).then(data =>  {
                alert("Success: Data updated successfully");
                props.history.push('')
            }).catch(err => alert(err));
        }else{
            employeeService.addEmployee(object).then(data =>  {
                alert("Success: Data added successfully");
                props.history.push('')
            }).catch(err => alert(err))
        }
    }
    const reset = () => {
        setForm({ ...initialValue, id: formValue.id, isUpdate: formValue.isUpdate});
    }

    // Components
    function ProfilePic(props){     
        return (
            <label>
                <input type="radio" name="profilePic" checked={formValue.profilePic===props.profile} value={props.profile} onChange={changeValue} />
                <img className="profile" alt="" src={props.profile} />
            </label>
        );
    }

    function Department(props){
        return (<>
            <input className="checkbox" type="checkbox" id={props.department} onChange={() => onCheckChange(props.department)} 
                    defaultChecked={getChecked(props.department)} name="department" value={props.department} />
            <label className="text" htmlFor={props.department}>{props.department}</label>
        </>);
    }
    return (
        <div className="payroll-main">
            <header className='header-content header row center'>
                <div className="logo">
                    <img src={'/assets/images/logo.png'} alt="" />
                    <div>
                        <span className="emp-text">EMPLOYEE</span> <br/>
                        <span className="emp-text emp-payroll">PAYROLL</span>
                    </div>
                </div>
            </header>
            <div className="form-content">
                <form className="form" action="#" onReset={reset} onSubmit={save}>
                    <div className="form-head">Employee Payroll Form</div>
                    <div className="row-content">
                        <label className="label text" >Name</label>
                        <input className="input" type="text" id="name" name="name" placeholder="Your Name.."  value={formValue.name} onChange={changeValue} />
                        <div className="error">{formValue.error.name}</div>
                    </div>

                    <div className="row-content">
                        <label className="label text" >Profile image</label>
                        <div className="profile-radio-content">
                            {initialValue.profileArray.map((profile, index)=><ProfilePic key={profile.url.toString()} profile={profile.url} index={index}/>)}
                        </div>
                        <div className="error">{formValue.error.profilePic}</div>
                    </div>

                    <div className="row-content">
                        <label className="label text" >Gender</label>
                        <div>
                            <input onChange={changeValue} type="radio" id="male" name="gender" checked={formValue.gender==="male"}  value="male" />
                            <label className="text" htmlFor="male">Male</label>
                            <input onChange={changeValue} type="radio" id="female" name="gender" checked={formValue.gender==="female"} value="female" />
                            <label className="text" htmlFor="female">Female</label>
                        </div>
                        <div className="error">{formValue.error.gender}</div>
                    </div>

                    <div className="row-content">
                        <label className="label text" >Department</label>
                        <div>
                            {formValue.allDepartment.map((department) => <Department key={department.toString()} department={department} />)}
                        </div>
                        <div className="error">{formValue.error.department}</div>
                    </div>

                    <div className="row-content">
                        <label className="label text" >Choose Your Salary: </label>
                        <input className="input" type="range" onChange={changeValue} name="salary" id="salary" min="300000" max="500000" step="100" defaultValue={formValue.salary} />
                        <output className="salary-output text" >{formValue.salary}</output>
                    </div>
                    <div className="error">{formValue.error.salary}</div>

                    <div className="row-content">
                        <label className="label text" >Start Date</label>
                        <div>
                            <select onChange={changeYearHandler} className="date" name="year" defaultValue={formValue.year}>
                                <option value="" hidden>Select Year</option>
                                {formValue.years.map((item) => <option key={"year"+item.toString()} value={item}>{item}</option> )}
                            </select>
                            <select onChange={changeMonthHandler} className="date" name="month" defaultValue={formValue.month}>
                                <option value="" hidden>Select Month</option>
                                {formValue.months.map((item) => <option key={"month"+item.toString()} value={item.slice(0,3)}>{item}</option> )}
                            </select>
                            <select onChange={changeValue} className="date" name="day" defaultValue={formValue.day}>
                                <option value="" hidden>Select Day</option>
                                {formValue.days.map((item) => <option key={"day"+item.toString()} value={item}>{item}</option> )}
                            </select>
                            <div className="error">{formValue.error.startDate}</div>
                        </div>
                    </div>

                    <div className="row-content">
                        <label className="label text">Notes</label>
                        <textarea onChange={changeValue} id="note" value={formValue.note} className="input" name="note" 
                            placeholder="Additional info.." style={{height: '100px'}}></textarea>
                    </div>
                    <div className="buttonParent">
                        <Link to="" className="resetButton button cancelButton">Cancel</Link>
                        <div className="submit-reset">
                            <button type="submit" className="button submitButton" id="submitButton" >{formValue.isUpdate ? 'Update' : 'Submit'}</button>
                            <button type="reset" onClick={reset} className="resetButton button">Reset</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withRouter(PayrollForm);