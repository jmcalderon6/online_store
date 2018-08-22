import React from 'react';
import * as firebase from 'firebase';
import { BrowserRouter as Router, Route, Link, NavLink, IndexRoute } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Tienda from './Tienda.jsx';
import BarraNavegacion from './BarraNavegacion.jsx';
import Carrito from './Carrito.jsx';
import LoginForm from '../Login.jsx';

class Producto extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        producto : [],
        listaProductos : [],
        idProducto : [],
        atras : 0,
        siguiente : 0,
        refresh: false
      }
    }
    //==============================================================================
    //                    Component Will Mount
    //------------------------------------------------------------------------------
    componentWillMount(){
    const { idProducto } = this.props.match.params;
      const listaProductos = []
      const producto = []
        if(this.state.producto == ""){                                                   
        firebase.database().ref("producto").once("value").then((snapshot) => {
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if(childData.id == idProducto){
              producto.push(childData);
            }
            listaProductos.push(childData)
          });
          this.setState({listaProductos : listaProductos, producto : producto });
        })
      }
      this.navegacion(idProducto);
    }
    //==============================================================================
    //                    Render
    //------------------------------------------------------------------------------
    render() {
        return(
        <div className="detalle">
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
          </div>
          <div class="container detalle-productos animated fadeIn">
            <div class="row">   
                <span class="col offset-s6 s6 center ">
                  <Link to={`/producto/${this.state.atras}`} onClick={() => this.setState({refresh : true}).bind(this)} className="btn blue lighten-2"  disabled={(this.state.siguiente === 1 ) ? true : false} >  <i className="material-icons">keyboard_arrow_left</i> </Link>
                  <Link to={`/producto/${this.state.siguiente}`}  onClick={() => this.setState({refresh : true}).bind(this)} className="btn blue lighten-2" disabled={(this.state.siguiente >= this.state.listaProductos.length) ? true : false} ><i className="material-icons">keyboard_arrow_right</i> </Link>
                </span>
                {
                  this.mostrarProducto()
                }
            </div>
            <NavLink to="/tienda" > <i class="large material-icons">arrow_back</i></NavLink>
          </div>
        </div>
       );
    }

    mostrarProducto(){
      return this.state.producto.map(
        (producto) => { return (<DetalleProducto siguiente={this.state.siguiente} atras={this.state.atras} navegacion={this.navegacion.bind(this)} listaProductos={this.state.listaProductos} actualizarDisponible={this.actualizarDisponible.bind(this)} key={ producto.id } producto={producto} /> )}
      )
    }


    //==============================================================================
    //                    Verificar items en carrito
    //------------------------------------------------------------------------------
    itemsCarrito(){
      if(sessionStorage.getItem("Carrito")){                                   
        this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito")); 
        return JSON.parse(sessionStorage.getItem("Carrito"));                  
      }
      return 0;                                                                 
    }
    //--------------------Contador de items en menu---------------------------------
    contadorCarrito(){
      return this.itemsCarrito().length 
    }
    //=============================================================================
    //             Guardar Items en el carrito
    //--------------Actualizar Disponible------------------------------------------
    actualizarDisponible(item, cantidad){
      for (let productoLista of this.state.producto){
        if (productoLista.id == item.id){
          this.verificarCarrito(item, cantidad)
          productoLista.disponible = (Number(productoLista.disponible) - Number(cantidad))
          this.setState({producto : this.state.producto})
          this.setState({listaCarrito : this.state.listaCarrito})
        }
      }
    }

    //-------------Verificar Carrito------------------------------------------------
    verificarCarrito(item, cantidad){
      if(this.guardarCarrito(item, cantidad) == false){                                
        this.state.listaCarrito.push(item)                                            
      }
      this.setState({listaCarrito : this.state.listaCarrito})                          
      sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito));      
    }
    //------------Agregar a Carrito-------------------------------------------------
    guardarCarrito(item, cantidad){
      if(this.state.listaCarrito.length > 0){                                                    
        for(let itemGuardado of this.state.listaCarrito){                                        
          if(itemGuardado.id == item.id){                                                       
            itemGuardado.cantidad = (Number(itemGuardado.cantidad) + Number(cantidad))
            return true 
          }
        }
        return false; 
      }
      return false; 
    }

    navegacion(id:number){ 
      let back = Number(id-1); 
      if(back >= 0){ 
        this.setState({atras : back }) ;
      }

      let next = Number(id+1);
      if(id < this.state.listaProductos.length){ 
        this.setState({siguiente : next}); 
      }

    }
 }
export default Producto;









class DetalleProducto extends React.Component{

//===============================================================================
//                    Constructor
//------------------------------------------------------------------------------
constructor(props) {
  super(props);
  this.state = { //Inicializar variables
      inputValue : 1,
      disponible : this.props.producto.disponible,
      contadorCarrito : 0,
      listaProductos: this.props.listaProductos,
      listaCarrito: JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : [] ,
      producto : this.props.producto,
      productoCarrito : {
        id : '',
        descripcion : '',
        imagen : '',
        cantidad : '',
      },
        atras: this.props.atras,
        siguiente : this.props.siguiente,
      };
}
//==============================================================================
//                    Component Will Mount
//------------------------------------------------------------------------------
componentWillMount(){
      this.checkCarrito(this.props.producto);
      this.props.navegacion(this.props.producto.id);
}
//==============================================================================
//                    Render
//------------------------------------------------------------------------------
  render(){
  if(!sessionStorage.getItem('Session')){                                       //Verificar que exista sesion iniciada
    return <Redirect to="/" />
  }
    const producto = this.props.producto

    return (
     <div> <div class="col s12 m6">
        <img class="responsive-img detalle-foto" src={producto.imagen}></img>
      </div>
      <div class="center col s12 m6">
        <h3 class="blue lighten-2"><b>{producto.descripcion}</b></h3>
        <p><b>Precio: </b>${producto.precio} </p>
        <p><b>Disponibles: </b>{this.state.disponible ? this.state.disponible : 'Agotado'}</p>
      </div>
      <p class="col s12 m6 flow-text">{producto.informacion}</p></div>
    )
  }

  //==============================================================================
  //                    Funciones
  //------------------------------------------------------------------------------
  //--------------------Agregar Productos-----------------------------------------
  
  //------------------------------------------------------------------------------
  //======================EventListener para campo de cantidades====================
    updateInputValue(evt) {
      this.setState({
        inputValue: evt.target.value
      });
    }
        checkCarrito(producto){
      for(let itemCarrito of this.state.listaCarrito){ //Recorrer el arreglo de productos almacenados en el carrito
        if(itemCarrito.id == producto.id){
          let actualizarDisponible = (Number(this.state.disponible) - Number(itemCarrito.cantidad));
          this.setState({disponible : actualizarDisponible, contadorCarrito : itemCarrito.cantidad});
        }
      }
    }
}
