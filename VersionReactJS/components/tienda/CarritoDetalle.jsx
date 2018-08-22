import React from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';

class CarritoDetalle extends React.Component {


  //===============================================================================
  //                    Constructor
  //------------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = { //Inicializar variables
      inputValue : 0,
      subtotal: 0,
      listaProductos: [],
      productoCarrito : {
        id : '',
        descripcion : '',
        imagen : '',
        cantidad : '',
      },
    };
  }
  //==============================================================================
  //                    Component Will Mount
  //------------------------------------------------------------------------------
  componentWillMount(){
    this.subtotal(this.props.precio, this.props.cantidad)                         
    this.setState({listaProductos : JSON.parse(sessionStorage.getItem('Carrito'))}) 
  }
  //==============================================================================
  //                    Render
  //------------------------------------------------------------------------------
  render() {
    return (

        <div className="card horizontal">
          <div class="card-image col s5">
            <img src={this.props.imagen} class="responsive-img"></img>
          </div>
          <div class="card-content col s4 center">
            <p class="center flow-text grey"><b>{this.props.descripcion}</b></p>
            <p><b>Precio: </b><FormattedMessage   id="precio"  defaultMessage={`$ {precio, number}`} values={{precio : this.props.precio}}  /></p>
            <p><b>Cantidad: </b>{this.props.cantidad ? this.props.cantidad : 'Agotado'}</p>
      
            <h5><b>Subtotal</b></h5>  
            <h5><FormattedMessage   id="subtotal"  defaultMessage={`$ {subtotal, number}`} values={{subtotal : this.state.subtotal}}  /></h5>
          </div>
          <div class="card-action col s4 ">
            <div className="file-field input-field">
              <button  onClick={this.eliminarProducto.bind(this)} className="btn orange darken-4 input waves-effect waves-light" type="button" disabled={ (this.props.cantidad <= 0) ? true : false } > <i className="material-icons">delete</i></button>
              <div className="file-path-wrapper">
                <input type="number" value={this.state.inputValue} disabled={ (this.props.cantidad <= 0 ) ? true : false } min="0" max={this.props.cantidad} className="form-control right-align" onChange={evt => this.updateInputValue(evt)}></input>
              </div>
            </div>
          </div>
        </div>

    )
  }
  //======================EventListener para campo de busqueda====================
  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
  //==============================================================================
  subtotal(precio, cantidad){
    let subtotal = Number(cantidad) * Number(precio);                               
    this.setState({subtotal : subtotal})                                            
  }

  eliminarProducto(remover:Boolean = false){                                  
    let cantidad = (Number(this.props.cantidad) - Number(this.state.inputValue))  
    if(cantidad < 0 || this.state.inputValue < 0){                                  
      alert('Verifique la cantidad a eliminar')                                     
      return                                                                        
    }
    this.state.productoCarrito.id =  this.props.id;                                 
    this.state.productoCarrito.descripcion =  this.props.descripcion;
    this.state.productoCarrito.imagen =  this.props.imagen;
    this.state.productoCarrito.precio =  this.props.precio;
    this.state.productoCarrito.cantidad = cantidad;

    this.props.actualizarDisponible(this.state.productoCarrito, cantidad, remover)     
    this.subtotal(this.props.precio, cantidad)                                       
    this.setState({productoCarrito : JSON.parse(sessionStorage.getItem("Carrito"))})  
  }



}


export default CarritoDetalle
