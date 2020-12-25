import config from '../config/config';
import AxiosService from './axios-service'

export default class  EmployeeService{
    baseUrl = config.baseUrl;
    addEmployee(data) {
        return (new AxiosService()).postService(`${this.baseUrl}/create`, data);
    }
    getAllEmployees(){
        return (new AxiosService()).getService(`${this.baseUrl}/`);
    }
    updateEmployee(id, data) {
        console.log(id,data);
        return (new AxiosService()).putService(`${this.baseUrl}/update/${id}`, data);
    }
    deleteEmployee(id){
        return (new AxiosService()).deleteService(`${this.baseUrl}/delete/${id}`);
    }
}