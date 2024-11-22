import {useEffect, useState} from "react";
import {ResponseLogin} from "../../entities/response-login.ts";
import {Customer} from "../../entities/customer.ts";
import {Detail} from "../../entities/detail.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {UtcService} from "../../services/utc-service.ts";


export const OptionComponent = () => {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customer, setCustomer] = useState<Customer>(new Customer());
    const [detail, setDetail] = useState<Detail>(new Detail());
    const [detailForShow, setDetailForShow] = useState<Detail>(new Detail());

    const [isUserLoggedIn, setIsUserLoggedId] = useState<boolean>(false);
    const [option, setOption] = useState<string>('')
    const [responseToken, setResponseToken] = useState<ResponseLogin>()

    const [enableDetailTable, setEnableDetailTable] = useState<boolean>(false);
    const [enableFormEditCustomer, setEnableFormEditCustomer] = useState<boolean>(false);
    const [enableFormEditDetail, setEnableFormEditDetail] = useState<boolean>(false);
    const [statusQuery, setStatusQuery] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // **  render at the first time only
        const responseToken: ResponseLogin = JSON.parse(sessionStorage.getItem("responseToken")!);
        let status: boolean;
        status = responseToken !== null;
        setResponseToken(responseToken);
        setIsUserLoggedId(status);
        loadData(responseToken.token);
    }, [])

    const loadData = async (token: string) => {
        fetch("http://localhost:8080/api/customer/reads", {
            method: "GET",
            headers: {"Authorization": "Bearer " + token},
        }).then(async (response: any) => {
            let json: any = await response?.json();
            if (json.title === "Forbidden") {
                alert('token expired')
                sessionStorage.clear()
                navigate('/', {state: {previousUrl: location.pathname}})
                window.location.reload();
            } else {
                setCustomers(json);
            }
        });
    }
    const loadDataAfterUpdateDetail = async (token: string, did: number) => {
        fetch("http://localhost:8080/api/customer/reads", {
            method: "GET",
            headers: {"Authorization": "Bearer " + token},
        }).then(async (response: any) => {
            let json: any = await response?.json();
            if (json.title === "Forbidden") {
                alert('token expired')
                sessionStorage.clear()
                navigate('/', {state: {previousUrl: location.pathname}})
                window.location.reload();
            } else {
                setCustomers(json);
                // use customers didn't update
                json.map((customer: any) => {
                    if (customer.detail.did === did) {
                        setDetailForShow(customer.detail)
                    }
                })
            }
        });
    }

    // show sub table
    const handleOnClickCustomerId = (cid: number) => {
        let customerFound = customers.find((customer) => customer.cid == cid)!
        setDetailForShow(customerFound.detail)
        setEnableDetailTable(true)
        setEnableFormEditCustomer(false)
    }
    // show forms edit
    const handleOnClickEnableFormEditCustomer = (customer: Customer) => {
        setCustomer(customer);
        setEnableFormEditCustomer(true);
        setEnableFormEditDetail(false);
    }
    const handleOnClickEnableFormEditDetail = (detailForShow: Detail) => {
        setEnableFormEditDetail(true)
        setEnableFormEditCustomer(false);
        setDetail(detailForShow) // ** for request to api
        // setDetailForShow(detailForShow)
    }
    // handle http methods
    const handleOnClickEditCustomerButton = () => {
        fetch("http://localhost:8080/api/customer/update?cid=" + customer.cid, {
            method: "PUT",
            headers: {"content-type": "application/json", "Authorization": "Bearer " + responseToken?.token},
            body: JSON.stringify({
                email: customer.email,
                password: customer.password,
            })
        }).then(async (response: any) => {
            let json: any = await response?.json();
            if (json.title === "Forbidden") {
                alert('token expired')
                sessionStorage.clear()
                navigate('/', {state: {previousUrl: location.pathname}})
                window.location.reload();
            } else {
                await loadData(responseToken?.token!)
                setStatusQuery(true)
            }
        });
    }
    const handleOnClickEditDetailButton = () => {
        fetch("http://localhost:8080/api/detail/update?did=" + detail.did, {
            method: "PUT",
            headers: {"content-type": "application/json", "Authorization": "Bearer " + responseToken?.token},
            body: JSON.stringify(detail)
        }).then(async (response: any) => {
            let json: any = await response?.json();
            if (json.title === "Forbidden") {
                alert('token expired')
                sessionStorage.clear()
                navigate('/', {state: {previousUrl: location.pathname}})
                window.location.reload();
            } else {
                await loadDataAfterUpdateDetail(responseToken?.token!, detail.did)
                setStatusQuery(true)
            }
        });
    }
    const handleOnClickDeleteCustomerButton = (cid: number) => {
        fetch("http://localhost:8080/api/customer/delete?cid=" + cid, {
            method: "DELETE",
            headers: {"Authorization": "Bearer " + responseToken?.token},
        }).then(async (response: any) => {
            let json: any = await response?.json();
            if (json.title === "Forbidden") {
                alert('token expired')
                sessionStorage.clear()
                navigate('/', {state: {previousUrl: location.pathname}})
                window.location.reload();
            } else {
                await loadData(responseToken?.token!)
                setStatusQuery(true)
            }
        });
    }
    const handleOnClickCreateCustomerButton = () => {
        fetch("http://localhost:8080/api/customer/create", {
            method: "POST",
            headers: {"content-type": "application/json", "Authorization": "Bearer " + responseToken?.token},
            body: JSON.stringify({
                email: customer.email,
                password: customer.password,
                image: "",
                detail: {
                    birthday: UtcService.convertUTCToLocalTimeForInputTypeDate(detail.birthday.toString()), // need this format
                    maritalStatus: detail.maritalStatus,
                    salary: detail.salary,
                    phone: detail.phone
                }
            })
        }).then(async (response: any) => {
            let json: any = await response?.json();
            if (json.title === "Forbidden") {
                alert('token expired')
                sessionStorage.clear()
                navigate('/', {state: {previousUrl: location.pathname}})
                window.location.reload();
            } else {
                await loadData(responseToken?.token!)
                setStatusQuery(true)
            }
        });
    }

    // components html
    const optionsList = () => {
        return (<div style={{margin: "0 auto", maxWidth: "fit-content"}}>
            <div className="z-10  w-48 bg-white rounded-lg shadow dark:bg-gray-800 mt-2"
                 style={{margin: "20px -60px 15px auto", width: "430px", justifyContent: "center"}}>
                <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownBgHoverButton">
                    <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex items-center">
                                <input id="default-radio-1" type="radio"
                                       onChange={(e) => setOption(e.target.value)}
                                       value="1" name="option"
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                <label htmlFor="default-radio-1"
                                       className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Table
                                    Customers</label>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex items-center">
                                <input id="default-radio-1" type="radio"
                                       onChange={(e) => setOption(e.target.value)}
                                       value="2" name="option"
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                <label htmlFor="default-radio-1"
                                       className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Form Create
                                    Customer</label>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>)
    }
    const customersTable = () => {
        return (
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Password
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Datetime Created
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Option
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer: Customer) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            key={customer.cid}
                            style={{cursor: "pointer"}}
                        >
                            <th scope="row"
                                onClick={() => handleOnClickCustomerId(customer.cid)}
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {customer.cid}
                            </th>
                            <td className="px-6 py-4">
                                {customer.email}

                            </td>
                            <td className="px-6 py-4">
                                {customer.password}

                            </td>
                            <td className="px-6 py-4">
                                {UtcService.convertUTCToLocalTimeForShowOnCustomerTable(customer.timeCreateId.toString())}
                            </td>

                            <td className="px-6 py-4">
                                <div className="inline-flex rounded-md shadow-sm" role="group">
                                    <button type="button"
                                            onClick={() => handleOnClickEnableFormEditCustomer(customer)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path fillRule="evenodd"
                                                  d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                                                  clipRule="evenodd"/>
                                            <path fillRule="evenodd"
                                                  d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                    <button type="button"
                                            onClick={() => handleOnClickDeleteCustomerButton(customer.cid)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path fillRule="evenodd"
                                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
    const detailTable = () => {
        return (
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Birthday
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Marital Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Salary
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Phone
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Option
                            <button type="button"
                                    className={"absolute"}
                                    style={{"display": "flex", marginLeft: "70px", marginTop: "-20px"}}
                                    onClick={() => setEnableDetailTable(false)}>
                                <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                     viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        style={{cursor: "pointer"}}>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {detailForShow.did}
                        </td>
                        <td className="px-6 py-4">
                            {UtcService.convertUTCToLocalTimeForShowOnDetailTable(detailForShow.birthday.toString())}
                        </td>
                        <td className="px-6 py-4">
                            {detailForShow.maritalStatus ? "married" : "unmarried"}
                        </td>
                        <td className="px-6 py-4">
                            {detailForShow.salary}
                        </td>
                        <td className="px-6 py-4">
                            {detailForShow.phone}
                        </td>
                        <td className={"px-6 py-4"}>
                            <button type="button"
                                    onClick={() => handleOnClickEnableFormEditDetail(detailForShow)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     fill="currentColor"
                                     viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                                          clipRule="evenodd"/>
                                    <path fillRule="evenodd"
                                          d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    const formEditCustomer = () => {
        return (
            <div className="flex flex-col items-center pb-10 px-4 pt-4">
                <form className="max-w-sm mx-auto bg-gray-800 p-6 rounded-xl" style={{width: "300px"}}>
                    <button type="button" className={"absolute"}
                            style={{"display": "flex", marginLeft: "240px", marginTop: "-15px"}}
                            onClick={() => setEnableFormEditCustomer(false)}>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             fill="currentColor"
                             viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                    <h5 className=" text-xl font-medium text-gray-900 dark:text-white text-center mb-3">Edit
                        Customer id {customer.cid}</h5>
                    <input type="email"
                           onChange={(event) => setCustomer({...customer, email: event.target.value})}
                           value={customer.email}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input type="text"
                           onChange={(event) => setCustomer({...customer, password: event.target.value})}
                           value={customer.password}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <div className="flex mt-4 md:mt-6">
                        <button type="button"
                                onClick={handleOnClickEditCustomerButton}
                                className="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800">Submit
                        </button>
                    </div>
                </form>
            </div>
        )
    }
    const formEditDetail = () => {
        return (
            <div className="flex flex-col items-center pb-10 px-4 pt-4">
                <form className="max-w-sm mx-auto bg-gray-800 p-6 rounded-xl" style={{width: "300px"}}>
                    <button type="button" className={"absolute"}
                            style={{"display": "flex", marginLeft: "240px", marginTop: "-15px"}}
                            onClick={() => setEnableFormEditDetail(false)}>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             fill="currentColor"
                             viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                    <h5 className=" text-xl font-medium text-gray-900 dark:text-white text-center mb-3">Edit
                        Customer's detail id {detail.did} </h5>
                    <input type="text"
                           placeholder={"Phone"}
                           name="phone"
                           onChange={(event) => setDetail({...detail, phone: event.target.value})}
                           value={detail.phone}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input type="number"
                           placeholder={"Salary"}
                           name="salary"
                           onChange={(event) => setDetail({...detail, salary: Number(event.target.value)})}
                           value={detail.salary}
                           step="1000"
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input type="date"
                           name="birthday"
                           onChange={(event) => {
                               let date = new Date(event.target.value);
                               setDetail({...detail, birthday: date});
                           }}
                           value={UtcService.convertUTCToLocalTimeForInputTypeDate(detail.birthday.toString()!)}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownBgHoverButton">
                        <li>
                            <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div className="flex items-center">
                                    <input id="default-radio-1"
                                           type="radio"
                                           onChange={() => setDetail({...detail, maritalStatus: true})}
                                           value="true"
                                           checked={detail.maritalStatus}
                                           name="maritalStatus"
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="default-radio-1"
                                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Married</label>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div className="flex items-center">
                                    {/* {!detail.maritalStatus ? true : false} i need to show if marital is false */}
                                    <input id="default-radio-1" type="radio"
                                           onChange={() => setDetail({...detail, maritalStatus: false})}
                                           checked={!detail.maritalStatus ? true : false}
                                           value="false"
                                           name="maritalStatus"
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="default-radio-1"
                                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unmarried</label>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="flex mt-4 md:mt-6">
                        <button type="button"
                                onClick={handleOnClickEditDetailButton}
                                className="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800">Submit
                        </button>
                    </div>
                </form>
            </div>
        )
    }
    const formCreateCustomerAndDetail = () => {
        return (
            <div className="flex flex-col items-center pb-10 px-4 pt-4">
                <form className="max-w-sm mx-auto bg-gray-800 p-6 rounded-xl" style={{width: "300px",paddingBottom:"1.5rem"}}>
                    <h5 className=" text-xl font-medium text-gray-900 dark:text-white text-center mb-3">Create
                        Customer</h5>
                    <input type="email"
                           placeholder={"email"}
                           onChange={(event) => setCustomer({...customer, email: event.target.value})}
                           name="email"
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input type="text"
                           placeholder={"password"}

                           onChange={(event) => setCustomer({...customer, password: event.target.value})}
                           name="password"
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />

                    <input type="text"
                           name="phone"
                           placeholder={"phone"}

                           onChange={(event) => setDetail({...detail, phone: event.target.value})}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input type="number"
                           name="salary"
                           placeholder={"salary"}

                           onChange={(event) => setDetail({...detail, salary: Number(event.target.value)})}
                           step="1000"
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <input type="date"
                           name="birthday"
                           onChange={(event) => {
                               let date = new Date(event.target.value);
                               setDetail({...detail, birthday: date});
                           }}
                           className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownBgHoverButton">
                        <li>
                            <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div className="flex items-center">
                                    <input id="default-radio-1"
                                           type="radio"
                                           value="true"
                                           name="maritalStatus"
                                           onChange={() => setDetail({...detail, maritalStatus: true})}
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="default-radio-1"
                                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Married</label>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <div className="flex items-center">
                                    <input id="default-radio-1" type="radio"
                                           value="false"
                                           name="maritalStatus"
                                           onChange={() => setDetail({...detail, maritalStatus: false})}

                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="default-radio-1"
                                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unmarried</label>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div className="flex mt-4 md:mt-6">
                        <button type="button"
                                onClick={handleOnClickCreateCustomerButton}
                                className="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800">Submit
                        </button>
                    </div>
                </form>
            </div>)
    }

    let componentOptionsAsList = null
    let componentOption = null
    let componentOptionEdit = null
    let componentSubOption = null
    let componentSubOptionEdit = null
    const componentAlertSuccess = <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 mt-1" style={{width: "fit-content", margin: "0 auto"}} role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             fill="currentColor" viewBox="0 0 20 20">
            <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div>
            <span className="font-medium">Success query!</span>
        </div>
        <button type="button"
                onClick={() => setStatusQuery(false)}
                className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
                data-dismiss-target="#alert-3" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
    </div>

    if (isUserLoggedIn) {
        componentOptionsAsList = optionsList()
        switch (option) {
            case "1" :
                componentOption = customersTable()
                if (enableFormEditCustomer) {
                    componentOptionEdit = formEditCustomer()
                }
                if (enableDetailTable) {
                    componentSubOption = detailTable()
                }
                if (enableFormEditDetail) {
                    componentSubOptionEdit = formEditDetail()
                }
                break;
            case "2"   :
                componentOption = formCreateCustomerAndDetail()
                break;
            default :
                break
        }
    }
    return (
        <>
            {componentOptionsAsList}
            <div style={{maxWidth: '760px', margin: '0 auto', marginBottom: "60px"}}>
                {componentOption}
                {
                    // {enableDetailTable ? detailTable() : null }
                    componentSubOption
                }
                {componentOptionEdit}
                {componentSubOptionEdit}
                {
                    // <condition> ? <doing if true> : <doing if false>
                    statusQuery ? componentAlertSuccess : null
                }
            </div>
        </>
    )

}