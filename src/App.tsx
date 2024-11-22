import {BrowserRouter, Routes, Route} from "react-router-dom";
import {MenubarComponent} from "./components/navigation/MenubarComponent.tsx";
import {LoginFormComponent} from "./components/register/LoginFormComponent.tsx";
import {OptionComponent} from "./components/option/OptionComponent.tsx";
function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                {/* path main "/"  render 2 compoennts */}
                <Route path={"/"} element={
                    <>
                        <MenubarComponent/>
                    </>

                } >
                        <Route path={"option"} element={
                            <OptionComponent/>
                        }/>
                        <Route path={"login"} element={
                            <LoginFormComponent/>
                        }/>

                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
