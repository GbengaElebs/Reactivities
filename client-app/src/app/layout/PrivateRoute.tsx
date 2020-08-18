import React, { useContext } from 'react'
import { RouteComponentProps, RouteProps, Route, Redirect } from 'react-router-dom';
import { RootStoreContext } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>
}

const PrivateRoute: React.FC<IProps> = ({component: Component,...rest}) => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedin} = rootStore.userStore;
    return (
       <Route
       {...rest}
       render={(props) => isLoggedin ? <Component {...props} /> : <Redirect to={'/'}/>}
       />
    )
}

export default observer(PrivateRoute);
