import Index from "./components/Home";
import {Route,Switch} from "react-router-dom";
import {AnimateSharedLayout} from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import Rooms from "./components/rooms";
import Chat from "./components/chat";

function App()
{
  return (
    <AnimateSharedLayout>
    <Switch>
      <Route component={Index} path="/" exact/>
      <PrivateRoute path="/rooms" component={Rooms} exact/>
      <PrivateRoute path="/chat/:id" component={Chat}/>
    </Switch>
    </AnimateSharedLayout>
  )
}

export default App;