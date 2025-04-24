import './index.css';
const SlideIn = ({ title, children, show, setShowSlideIn }) => {
    return (
        <div className={"shadow-lg slidein" + (show ? " show" : "")} style={{minHeight:'100vh'}}>
            <div className="d-flex align-items-center">
                <span className="icon-btn m-0 me-2" onClick={() => setShowSlideIn && setShowSlideIn(false)}><i className="fa fa-times"></i></span>
                {title && <h5 className="m-0 ml-3">{title}</h5>}
            </div>
            <hr />

            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default SlideIn;