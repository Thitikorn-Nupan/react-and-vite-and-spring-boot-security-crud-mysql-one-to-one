import {useEffect, useState} from "react";
import {ResponseLogin} from "../../entities/response-login.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {UserRequest} from "../../entities/user-request.ts";


export const LoginFormComponent = () => {

    const [isUserLoggedIn,setIsUserLoggedId] = useState<boolean>(false);
    const [user, setUser] = useState<UserRequest>(new UserRequest());
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // **  render at the first time only
        console.log('render at the first time only')
        const responseToken : ResponseLogin = JSON.parse(sessionStorage.getItem("responseToken")!);
        setIsUserLoggedId(responseToken !== null);
    }, [])


    const handleClickLogin = () => {
        fetch("http://localhost:8080/api/register/login",{
            method:"POST",
            body : JSON.stringify({
                email : user.email,
                password: user.password,
            }),
            headers : {"content-type": "application/json"}
        }).then(async (response: any)  => {
            setTimeout(async () => {
                // delay .5s then do below
                const responseToken : ResponseLogin = await response?.json();
                // storing token to session storage
                sessionStorage.setItem("responseToken", JSON.stringify(responseToken as any));
                navigate('/option', {state: {previousUrl: location.pathname}});
                window.location.reload();
            },500)
        });
    }

    const formLoginComponent = () => {
        return (<div style={{marginTop: "100px"}}>
            <form className="max-w-sm mx-auto bg-gray-800 p-6 rounded-lg">
                <h1 className={"text-white text-center font-medium "}>Login</h1>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                        email</label>
                    {/*  user?.email || '' ***  it's working for second render  */ }
                    <input type="email" id="email"
                           onChange={event => setUser({...user, email: event.target.value})}
                           value={user?.email || ''}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="name@flowbite.com" required/>
                </div>
                <div className="mb-5">
                    <label htmlFor="password"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                        password</label>
                    <input type="password" id="password"
                           onChange={event => setUser({...user, password: event.target.value})}
                           value={user?.password || ''}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           required/>
                </div>
                {/*  You have to use type button with event on click. */}
                <button type="button"
                        onClick={handleClickLogin}
                        className="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800">Submit
                </button>
            </form>
        </div>)
    }

    let component = null
    // if user logged have to go another pange
    if (isUserLoggedIn) {
        navigate('/option', {state: {previousUrl: location.pathname}})
    }
    else {
        component = formLoginComponent()
    }
    return (component)

}