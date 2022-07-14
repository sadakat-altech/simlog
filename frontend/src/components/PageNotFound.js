import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div>
            <h1>Page not Found</h1>
            <Link to={'/'}>Go back to home page</Link>
        </div>
    );
}

export default PageNotFound;