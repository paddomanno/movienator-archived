import {createBrowserRouter} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import RootPage from "./components/RootPage";

/*
Setting up the router to manage the frontend routes and determine what Components are to be shown at what routes
 */

let router = createBrowserRouter([
    {
        path: "/",
        element: <RootPage/>,
        errorElement: <ErrorPage/>
    }
])

export default router;