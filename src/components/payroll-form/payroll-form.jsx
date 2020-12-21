import React, {useState, useEffect} from  'react';
import './payroll-form.scss';
import { useParams, Link, withRouter } from 'react-router-dom';
import EmployeeService from '../../services/employee-service';

const PayrollForm = (props) =>{
    let employeeService = new EmployeeService();
    let initialValue = {
        name: '',
        profileArray: [
            { url: '/assets/profile-images/Ellipse -3.png' },
            { url: '/assets/profile-images/Ellipse 1.png' },
            { url: '/assets/profile-images/Ellipse -8.png' },
            { url: '/assets/profile-images/Ellipse -7.png' }
        ],
        allDepartment: [
            'HR', 'Sales', 'Finance', 'Engineer', 'Others'
        ],
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
        // console.log(props.location.state[1]);
        Object.assign(initialValue, props.location.state[1]);
        initialValue.isUpdate = true;
        [initialValue.day, initialValue.month, initialValue.year] = initialValue.startDate.split(" ");
        initialValue.day = parseInt(initialValue.day);

    }

    const [formValue, setForm] = useState(initialValue);

    const changeValue  = (event) => {
        let error = {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profilePic: '',
            startDate: ''
        }
        let nameRegex = RegExp("^[A-Z]{1}[a-zA-Z\\s]{2,}$");
        if ((event.target.name=="name") && !nameRegex.test(event.target.value)){
            formValue.error.name="Incorrect Name";
        }else{
            formValue.error.name="";
        }
        setForm({ ...formValue, [event.target.name]: event.target.value })

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

    const validData = async () =>{
        let isError = false;
        let error = {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profilePic: '',
            startDate: ''
        }
        let nameRegex = RegExp("^[A-Z]{1}[a-zA-Z\\s]{2,}$");
        if (formValue.name.length < 1){
            error.name = 'name is required field'
            isError = true;
        }
        if ((!nameRegex.test(formValue.name))){
            error.name="Incorrect Name";
            isError = true;
        }
        if (formValue.gender.length < 1){
            error.gender = 'gender is required field'
            isError = true;
        }
        if (formValue.salary.length < 1){
            error.salary = 'salary is required field'
            isError = true;
        }
        if (formValue.profilePic.length < 1){
            error.profilePic = 'profile is required field'
            isError = true;
        }
        if (formValue.department.length < 1){
            error.department = 'department is required field'
            isError = true;
        }

        await setForm({ ...formValue, error: error })
        return isError;

    }

    const save = async (event) =>{
        event.preventDefault();

        if (await validData()){
            console.log('error', formValue);
            return;
        }

        let object = {
            name: formValue.name,
            profilePic: formValue.profilePic,
            gender: formValue.gender,
            department: formValue.department,
            salary: formValue.salary,
            startDate: `${formValue.day.length==1?"0"+formValue.day: formValue.day} ${formValue.month} ${formValue.year}`,
            note: formValue.note,
            id: formValue.id,
        }
        
        if(formValue.isUpdate){
            employeeService.updateEmployee(formValue.id, object).then(data =>  {
                alert("data updated successfully");
                console.log("data updated successfully");
                props.history.push('')
            }).catch(err => console.log(err));
        }else{
            employeeService.addEmployee(object).then(data =>  {
            alert("data added successfully");
            console.log("data added successfully");
            props.history.push('')
        }).catch(err => console.log(err));}
    }
    const reset = () => {
        setForm({ ...initialValue, id: formValue.id, isUpdate: formValue.isUpdate});
        console.log(formValue);
    }

    // Components
    function ProfilePic(props){     
        return (
            <label>
                <input type="radio" name="profilePic" checked={formValue.profilePic==props.profile} value={props.profile} onChange={changeValue} />
                <img className="profile" alt="" src={props.profile} />
            </label>
        );
    }

    const departments = ["HR", "Sales", "Finance", "Engineer", "Others"];

    function Department(props){
        return (<>
            <input className="checkbox" type="checkbox" id={props.department} onChange={() => onCheckChange(props.department)} 
                    defaultChecked={getChecked(props.department)} name="department" value={props.department} />
            <label className="text" htmlFor={props.department}>{props.department}</label>
        </>);
    }

    const days = Array.from(new Array(31),(val,index)=>index+1);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = [2020,2019,2018,2017,2016];
    return (
        <div className="payroll-main">
            <header className='header row center'>
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
                        <label className="label text" hmtlFor="name">Name</label>
                        <input className="input" type="text" id="name" name="name" placeholder="Your Name.."  value={formValue.name} onChange={changeValue} />
                    </div>
                    <div className="error">{formValue.error.name}</div>

                    <div className="row-content">
                        <label className="label text" htmlFor="profilePic">Profile image</label>
                        <div className="profile-radio-content">
                            {initialValue.profileArray.map((profile, index)=><ProfilePic key={profile.url.toString()} profile={profile.url} index={index}/>)}
                        </div>
                    </div>
                    <div className="error">{formValue.error.profilePic}</div>

                    <div className="row-content">
                        <label className="label text" htmlFor="gender">Gender</label>
                        <div>
                            <input onChange={changeValue} type="radio" id="male" name="gender" checked={formValue.gender=="male"}  value="male" />
                            <label className="text" htmlFor="male">Male</label>
                            <input onChange={changeValue} type="radio" id="female" name="gender" checked={formValue.gender=="female"} value="female" />
                            <label className="text" htmlFor="female">Female</label>
                        </div>
                    </div>
                    <div className="error">{formValue.error.gender}</div>

                    <div className="row-content">
                        <label className="label text" htmlFor="department">Department</label>
                        <div>
                            {departments.map((department) => <Department key={department.toString()} department={department} />)}
                        </div>
                    </div>
                    <div className="error">{formValue.error.department}</div>

                    <div className="row-content">
                        <label className="label text" htmlFor="salary">Choose Your Salary: </label>
                        <input className="input" type="range" onChange={changeValue} name="salary" id="salary" min="300000" max="500000" step="100" defaultValue={formValue.salary} />
                        <output className="salary-output text" htmlFor="salary">{formValue.salary}</output>
                    </div>
                    <div className="error">{formValue.error.salary}</div>

                    <div className="row-content">
                        <label className="label text" htmlFor="startDate">Start Date</label>
                        <div>
                            <select onChange={changeValue} id="day" className="date" name="day" defaultValue={formValue.day}>
                                {days.map((item) => <option key={"day"+item.toString()} value={item}>{item}</option> )}
                            </select>
                            <select onChange={changeValue} id="month" className="date" name="month" defaultValue={formValue.month}>
                                {months.map((item) => <option key={"month"+item.toString()} value={item.slice(0,3)}>{item}</option> )}
                            </select>
                            <select onChange={changeValue} id="year" className="date" name="year" defaultValue={formValue.year}>
                                {years.map((item) => <option key={"year"+item.toString()} value={item}>{item}</option> )}
                            </select>
                        </div>
                    </div>
                    <div className="error">{formValue.error.startDate}</div>

                    <div className="row-content">
                        <label className="label text" htmlFor="notes">Notes</label>
                        <textarea onChange={changeValue} id="notes" value={formValue.note} className="input" name="notes" 
                            placeholder="additional info.." style={{height: '100%'}}></textarea>
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