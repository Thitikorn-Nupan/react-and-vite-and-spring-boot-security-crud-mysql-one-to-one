import {JwtPayload} from "jwt-decode";
import * as jwt_decode from "jwt-decode";
import {useEffect, useState} from "react";
import {ResponseLogin} from "../../entities/response-login.ts";

export const StatusLoginComponent = () => {

    const [payload, setPayload] = useState<JwtPayload>();
    const [isUserLoggedIn,setIsUserLoggedId] = useState(false);

    useEffect(() => {
        const responseToken : ResponseLogin = JSON.parse(sessionStorage.getItem("responseToken")!);
        if (responseToken !== null) {
            setIsUserLoggedId(true);
            setPayload(jwt_decode.jwtDecode(responseToken.token))
        }
    }, [])

    const convertUnixTimeToRealTime =(unixTimestamp: number)=> {
        const date = new Date(unixTimestamp * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are 0-based
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const cardStatusLoginComponent = () => {
        return (
            <div style={{margin : "0 auto", maxWidth:"fit-content"}}>
                <div
                    style={{position : "unset",marginTop: "90px"}}
                    className="w-full  max-h-40 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-4 ml-6">
                    <div className="flex flex-col items-center pb-10 mt-4">
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Welcome</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Datetime Expired : {convertUnixTimeToRealTime(payload!.exp!)} </span>
                        <ul role="list" className=" divide-gray-200 dark:divide-gray-700 w-full">
                            <li className="ml-4 sm:py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="w-10 rounded-full" src="https://www.svgrepo.com/show/535711/user.svg" alt="Neil image"/>
                                    </div>
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            Username : {payload!.sub!}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-white mr-4">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                                        Online
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    let componentCardStatus = null

    if (isUserLoggedIn) {
        componentCardStatus = cardStatusLoginComponent()
    }

    return (componentCardStatus)


}