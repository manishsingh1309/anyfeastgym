import { Navigate } from 'react-router-dom';

// Registration is handled via Google Sign-In or Mobile OTP on the Login page.
// There is no separate email/password sign-up flow.
const Register = () => <Navigate to="/login" replace />;

export default Register;
