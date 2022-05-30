import {RegisterForm} from './RegisterForm';

export function RegisterPage() {
    return (
        <main className='justify-content-center'>
            <div className='overflow-hidden p-3 m-md-3 text-center bg-dark'>
                <div className='mx-auto my-5'>
                    <h1>Please submit your data to register a new account</h1>
                </div>
            </div>
            <div className='d-md-flex justify-content-center w-100 my-md-3 pl-md-3'>
                <RegisterForm/>
            </div>
        </main>
    );
}