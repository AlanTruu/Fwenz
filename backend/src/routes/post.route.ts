import {Router} from 'express'
import { postHandler } from '../controllers/post.controller';

const postRoutes = Router();

postRoutes.get('/:person_name', postHandler)

export default postRoutes