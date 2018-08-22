import React from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
//=========Importar Componentes=========================
import BarraNavegacion from './BarraNavegacion.jsx';
import Catalogo from './Catalogo.jsx';
//======================================================

class Tienda extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      catalogo: [],
      productos: [],
      listaCarrito : [],
      loader : true,
      termino: ""
    }
    this.actualizarDisponible = this.actualizarDisponible.bind(this)
  }
  //==================Component Will Mount========================================
  componentWillMount(){
      const listaProductos = []                                                 
      firebase.database().ref("producto").once("value").then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          listaProductos.push(childData);
        });
        this.setState({catalogo : listaProductos });
        this.setState({productos : this.state.catalogo});
      })
  }
  //==============================================================================
  //                    Render
  //------------------------------------------------------------------------------
  render(){
  if(!sessionStorage.getItem('Session')){                                       
    return <Redirect to="/" />
  }

    return(
    <div className="catalogo ">
      <div className="container">
        <BarraNavegacion contador={this.contadorCarrito()}/>
      </div>
      <div className="container  catalogo-productos animated fadeIn">
        <div class="row">
          <div class="col s12 m9 center">
            <h3 class="titulo">Catalogo de productos</h3>
          </div>
          <div class="col s12 m3 center busqueda">
            <p>¿Que estas buscando?</p> 
            <input onChange={this.filtrarCatalogo.bind(this)} placeholder="Buscar productos" type="text" id="descripcion" type="text" className="white-text no-margin-bottom"/>
            <small><span class="left-align">Predicción: <ins>{ this.state.termino}</ins></span></small>
          </div>
        </div>
        <div class="divider"></div>
        <div class="row box">
          {
            this.mostrarProductos()
          }
        </div>
        </div>
      </div>
     
    )
  }
  //==============================================================================
  //                    Funciones
  //------------------------------------------------------------------------------
  mostrarProductos(){
    return this.state.productos.map(                                            
      (producto) => { return <Catalogo actualizarDisponible={this.actualizarDisponible} productos={this.state.productos} key={ producto.id } id={producto.id}  nombre={ producto.nombre } imagen={ producto.imagen } descripcion={ producto.descripcion } disponible={ producto.disponible } precio ={producto.precio} /> }
    )
  }
  //============================================================================
  //                    Filtrar Productos
  //----------------------------------------------------------------------------
  filtrarCatalogo(event){
    this.state.productos = this.state.catalogo;             
    let palabraFiltro = event.target.value.toLowerCase();   
    let itemMatch = [];                                    

    for(let item of this.state.productos){                  
      let nombre = item.nombre.toLowerCase();              
      if(nombre.includes( palabraFiltro )){                
        itemMatch.push(item)}                               
      }
      this.setState({productos : itemMatch});              
      this.setState({termino : itemMatch[0].nombre});
      if(itemMatch.length == 0){                           
        this.state.productos = []
      }
    }
    //=============================================================================
    //             Guardar Items en el carrito
    //--------------Actualizar Disponible------------------------------------------
    actualizarDisponible(item, cantidad){
      for (let productoLista of this.state.productos){                                      
        if (productoLista.id == item.id){                                                   
          this.verificarCarrito(item, cantidad)                                            
          productoLista.disponible = (Number(productoLista.disponible) - Number(cantidad))  
          this.setState({productos : this.state.productos})                                
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
    //==============================================================================
    //==============================================================================
    //                    Verificar items en carrito
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
  }
  export default Tienda;
