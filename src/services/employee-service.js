import config from '../config/config';
import AxiosService from './axios-service'

export default class  EmployeeService{
    baseUrl = config.baseUrl;
    addEmployee(data) {
        return (new AxiosService()).postService(`${this.baseUrl}/employee`, data);
        // return axios.post(`${this.baseUrl}/employeepayrollservice/create`, data);
    }
    getAllEmployees(){
        return (new AxiosService()).getService(`${this.baseUrl}/employee`);
    }
}