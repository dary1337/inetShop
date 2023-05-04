
import {fileURLToPath} from 'url';
import fs from 'fs';


let metaUrl = import.meta.url;

class helper {

    static upFirstChar = (string = 'string is empty') => string.charAt(0).toUpperCase() + string.slice(1);

    static validateEmail = (email = '') => email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )

    static getFileName = (file) => 
        file.md5 +'.' + file.mimetype.substring(file.mimetype.indexOf("/") + 1);

    static getFileUrl = () => fileURLToPath(metaUrl);


    static fileExists = (path = '') => fs.existsSync(path);

    static deleteFile = (directory = '') => {

        try { 
            fs.unlinkSync(directory);
            return true;
        
        } catch {
            return false;
        }
    };

    static filterObject = (object = {}, keysToFilterKeep = []) => 
        Object.entries(
            Object.fromEntries(
                    Object.entries(object).map(
                        ([key, value]) => [key, Object.fromEntries(
                        Object.entries(value).filter(
                            ([subkey]) => keysToFilterKeep.includes(subkey)
                        )
                    )]
                )
            )
        ).map(([name, obj]) => ({ name, ...obj }));
    

}

export default helper;