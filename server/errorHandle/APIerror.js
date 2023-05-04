class APIerror extends Error {

    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static send = (message) => 
        new APIerror(440, message);

    static empty = (what = 'something') => 
        new APIerror(441, what + ' is empty');


    static emptyData = () =>
         new APIerror(442, 'data is empty');

    static emptyId = () => 
        new APIerror(443, 'id is empty');


    static notFound = (what = 'something') => 
        new APIerror(404, what + ' not found');

    static notAllData = () => 
        new APIerror(444, 'the data sent is incomplete');


    static alreadyInDb = (what = 'something') => 
        new APIerror(445, what + ' already in the database');

    static valueIsTooLong = (value = 'value') =>  
        new APIerror(446, value + ' is too long');

}

export default APIerror;