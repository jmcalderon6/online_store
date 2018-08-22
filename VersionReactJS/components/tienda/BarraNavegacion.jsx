import React from 'react';
import { BrowserRouter as Router, Route, NavLink , IndexRoute, Link } from 'react-router-dom';

class Main extends React.Component{
  render(){
      return(
 
             <nav>
               <div class="nav-wrapper blue-grey lighten-2">
                 <Link to="/tienda" className="brand-logo hide-on-small-only">VirtualStore</Link>     
                 <Link to="/tienda" className="brand-logo hide-on-med-and-up">VS</Link>    

                <ul class="right">
                   <li>
                     <NavLink to="/carrito" activeClassName="active" class="text-shadow active">  <i class="large material-icons">shopping_basket</i><span hidden={(this.props.contador > 0) ? false : true } className="badge_nav">{this.props.contador}</span></NavLink>
                   </li>
                   <li>
                      <NavLink to="/tienda" class="text-shadow active" > <i class="large material-icons">shopping_cart</i>
                        
                      </NavLink>
                   </li>
                   <li onClick={this.logout}>
                     <Link  to="/" className="text-shadow"><i className="large material-icons">forward</i></Link >
                   </li>
                 </ul>
               </div>
            </nav>  
         
        );
  }
 //Eliminar los datos de la sesión
  logout(){
    sessionStorage.removeItem('Session');
  }
}
export default Main;
