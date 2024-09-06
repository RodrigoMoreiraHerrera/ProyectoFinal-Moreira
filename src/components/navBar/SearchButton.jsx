import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export const BtnSearch = (props) => {
    return (<>
        <Button variant="outline-primary" className='position-relative'>
            <i className="bi bi-search "></i>
            <Badge className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" bg="danger">{props.widGet}</Badge>
        </Button>
    </>)

}