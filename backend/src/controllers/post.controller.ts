import {RequestHandler} from 'express'
import {supabase} from '../utils/supa'
import appAssert from '../utils/appAssert'
import { BAD_REQUEST, OK } from '../constants/http';
import { BADRESP } from 'node:dns';



export const postHandler : RequestHandler = async (req, res) => {
    const person_name = req.params.person_name;
    //use the name to pull data from DB
    //get all data and return as object
    //maybe return an array of objects to make it easier?

    const {data, error} = await supabase.from('posts').select('*').eq('person_name', person_name);
    
    appAssert(data, BAD_REQUEST, 'Could not find posts');

    appAssert(data.length > 0, BAD_REQUEST, 'Could not find posts');

    return void res.status(OK).json(data);
    
}