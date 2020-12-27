const stringifyDate = (date) => {
    const options = {day: 'numeric', month: 'short', year: 'numeric'};
    const newDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString('en-GB', options);
    return newDate;
};

export default class Validator{
    namePattern = RegExp("^[A-Z]{1}[a-zA-Z\\s]{2,}$");
    zipPattern = RegExp("^[0-9]{6,}$");

    validateName(name){
        return this.namePattern.test(name)?"":"Invalid Name";
    }
    
    validateDate(date){
        return stringifyDate(date)===date?"":"Invalid Date";
    }
    validate(name, value){
        switch(name){
            case "name":
                return this.validateName(value);
            case "startDate":
                return this.validateDate(value);
            default:
                return value.length>0?'':name+" is required";
        }
    }
}
// export default new Validator();