import React from 'react'
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import { FormattedMessage } from 'react-intl';
import update from 'immutability-helper'; //Manejo de arrays
import BarraNavegacion from './BarraNavegacion.jsx';

class Catalogo extends React.Component {

//==============================================================================
//                    Component Will Mount
//------------------------------------------------------------------------------
  componentWillMount(){
    this.checkCarrito(this.props.id);
  }
//===============================================================================
//                    Constructor
//------------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = { 
      inputValue : 1,
      disponible : this.props.disponible,
      contadorCarrito : 0,
      listaProductos: [],
      listaCarrito: JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : [] ,
      productoCarrito : {
          id : '',
          descripcion : '',
          imagen : '',
          cantidad : '',
        },
    };
  }
//==============================================================================
//                    Render
//------------------------------------------------------------------------------
  render() {
    return (
       
              <div class="col s12 m4 l3 caja-producto animated fadeIn fast">
                <div class="card producto z-depth-5">
                  <div  className={this.state.disponible ? 'card-image' : 'card-image grayscale'}>
                    <img class="responsive-img" src={this.props.imagen}></img>
                  </div>
                  <div class="card-content">
                    <span hidden={this.state.contadorCarrito ? false : true} className="badge carrito center">
                      <Link to="/carrito">
                        <span className="white-text text-shadow">{this.state.contadorCarrito}</span>
                      </Link>
                    </span>
                    

                    <span class="card-title grey-text text-darken-4"><b>{this.props.descripcion}</b></span>
                    <p><b>Precio: </b><FormattedMessage   id="precio"  defaultMessage={`$ {precio, number}`} values={{precio : this.props.precio}}  /></p>
                    <p><b>Disponibles: </b>{this.state.disponible ? this.state.disponible : 'Agotado'}</p>

                    <div class="box-add">
                            <button class="btn col s6 waves-effect waves-light" type="button" disabled={ (this.props.disponible <= 0) ? true : false } onClick={this.agregarProducto.bind(this)}>Añadir</button>
                               
                            <input type="number" value={this.state.inputValue} disabled={ (this.props.disponible <= 0 ) ? true : false } min="0" max={this.props.disponible} class="col s5 center offset-s1" onChange={evt => this.updateInputValue(evt)}></input>  
                          </div>
                  </div>
                  <div class="col s12 card-action blue lighten-1 center">
                    <Link to={`/producto/${this.props.id}`}><span className="white-text">Ver Detalles</span></Link>
                  </div>
                </div>  
              </div>
          
    )
  }


//==============================================================================
//                    Funciones
//------------------------------------------------------------------------------
//--------------------Agregar Productos-----------------------------------------
  agregarProducto(){
     let cantidad = this.state.inputValue
     if (cantidad <=0) {
      alert('Seleccione una cantidad válida');
      return
     }
     if(this.state.disponible < cantidad){
       alert('Máxima existencia es: '+ this.state.disponible);   
     }else{
       let disponibles = (Number(this.state.disponible) - Number(cantidad));
       let agregarACarrito = (Number(this.state.contadorCarrito) + Number(cantidad));
       this.setState({disponible : disponibles});
       this.setState({contadorCarrito : agregarACarrito});
       this.state.productoCarrito.id =  this.props.id;
       this.state.productoCarrito.descripcion =  this.props.descripcion;
       this.state.productoCarrito.imagen =  this.props.imagen;
       this.state.productoCarrito.precio =  this.props.precio;
       this.state.productoCarrito.cantidad = (Number(this.state.productoCarrito.cantidad) +  Number(cantidad));
       this.props.actualizarDisponible(this.state.productoCarrito, cantidad, false);
     }
  }
//------------------------------------------------------------------------------
//======================EventListener para campo de cantidades====================
  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
//---------------------Verificar carrito----------------------------------------
  checkCarrito(id){
    let productoCarrito = this.props
    for(let itemCarrito of this.state.listaCarrito){ 
      if(itemCarrito.id == productoCarrito.id){
        let actualizarDisponible = (Number(this.state.disponible) - Number(itemCarrito.cantidad));
        this.setState({disponible : actualizarDisponible, contadorCarrito : itemCarrito.cantidad});
      }
      //(itemCarrito.id, itemCarrito.cantidad); 
    }
  }
//------------------------------------------------------------------------------

}export default Catalogo
