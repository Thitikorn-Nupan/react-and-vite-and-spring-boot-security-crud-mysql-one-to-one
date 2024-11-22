import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ResponseLogin} from "../../entities/response-login.ts";
import {StatusLoginComponent} from "../status-login/StatusLoginComponent.tsx";

export const MenubarComponent = () => {

    const [isUserLoggedIn, setIsUserLoggedId] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Runs only on the first render
        const responseToken: ResponseLogin = JSON.parse(sessionStorage.getItem("responseToken")!);
        if (responseToken !== null) {
            setIsUserLoggedId(true);
        }
    }, [])

    // **
    const handleClickLogout = () => {
        sessionStorage.clear()
        // อาร์กิวเมนต์ที่สองที่ถูกส่งไปใน navigate เป็น object ที่ใช้เพื่อกำหนด state และค่าอื่นๆ เมื่อทำการเปลี่ยนเส้นทาง Url alert(location.state.previousUrl) // ** it will show previous url
        navigate('/', {state: {previousUrl: location.pathname}})
        window.location.reload();
    }

    // components
    const optionAndLogoutMenusComponent = () => {
        return (<>
            <li>
                <Link to={"option"}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Option</Link>
            </li>
            <li>
                <button onClick={handleClickLogout}
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Logout
                </button>
            </li>
        </>)
    }
    const loginMenuComponent = () => {
        return (
            <li>
                <Link to={"login"}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Login</Link>
            </li>
        )
    }

    let component = null
    if (isUserLoggedIn) {
        component = optionAndLogoutMenusComponent()
    } else {
        component = loginMenuComponent()
    }
    return (
        <>
            <nav
                className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://www.svgrepo.com/show/406080/letter-t.svg" className="h-8"/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Spring Boot + Vite & React + TS</span>
                    </a>

                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                         id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <Link to={""} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Home</Link>
                            </li>
                            {
                                // li condition
                                component
                            }
                        </ul>
                    </div>
                </div>
            </nav>
            <div style={{margin: "0 auto", marginTop: "70px"}}>
                <StatusLoginComponent/>
                {
                  // ** Route work below
                }
                <Outlet></Outlet>
            </div>
        </>
    )

}