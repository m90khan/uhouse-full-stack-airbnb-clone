import merge from 'lodash.merge';
import { viewerResolvers } from './Viewer/index';
import { userResolvers } from './User/index';

export const resolvers = merge(viewerResolvers, userResolvers);
