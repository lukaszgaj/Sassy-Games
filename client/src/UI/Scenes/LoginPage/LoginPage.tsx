import {LoginForm} from './LoginForm';

export function LoginPage() {
    return (
        <main className='justify-content-center'>
            <div className='overflow-hidden p-3 m-md-3 text-center bg-dark'>
                <div className='mx-auto my-5'>
                    <h1>Sign in</h1>
                    <p className='lead font-weight-normal'>
                        Enter your credentials and move to user dashboard
                    </p>
                    <p className='lead font-weight-normal'>
                        You don't have an account? <a href='register' className='btn btn-dark'>Register now</a>
                    </p>
                </div>
            </div>
            <div className='container col-sm-4'>
                <article className='card-body'>
                    <h4 className='card-title text-center mb-4 mt-1'>Sign in</h4>
                    <LoginForm/>
                </article>
            </div>
        </main>
    );
}