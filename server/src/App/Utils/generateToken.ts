import {sign} from 'jsonwebtoken';
import {UserDetails} from '../../Domain/Types/UserDetails';

export function generateToken(userDetails: UserDetails) {
    if (!process.env.JWT_KEY) {
        throw new Error('Missing JWT_KEY');
    }
    return sign({
        login: userDetails.login,
        isBanned: userDetails.isBanned,
        userRole: userDetails.userRole,
    }, process.env.JWT_KEY, {expiresIn: '1h'});
}
