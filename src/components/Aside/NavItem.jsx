import { Link } from "react-router-dom"

export const NavItem = ({ destiny, pageTitle, ImageIcon, setPageTitle }) => {
    const hash = String(location.pathname).replace('/', '')
    return (
        <li>
            <Link to={`/${destiny}`} className={(hash === destiny) ? 'active' : ''} onClick={() => setPageTitle(pageTitle)}>
                {ImageIcon && <ImageIcon />}
                {pageTitle}
            </Link>
        </li >
    )
}