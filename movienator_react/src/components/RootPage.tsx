import {Link, Outlet} from "react-router-dom";
import "../Styles/allStyles.css"

export default function RootPage(){
    return(
        <div className={"rootPage"}>
            Hier ist die Root Page
            <div id="detail">
                <Outlet/>
            </div>
        </div>
    )
}