import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as request from 'superagent';
import { FormattedMessage } from 'react-intl';
import BarraNavegacion from './BarraNavegacion.jsx';
import CarritoDetalle from './CarritoDetalle.jsx'

class Carrito extends React.Component{
  //===============================================================================
  //                    Constructor
  //------------------------------------------------------------------------------
  constructor(props) {
    super(props)
    this.state = {
      listaCarrito : [],
      inputValue:0,
      redirect : false,
      counter : 1,
      pagar : false
    }
    this.vaciarCarrito = this.vaciarCarrito.bind(this)
  }
  //==============================================================================
  //                    Component Will Mount
  //------------------------------------------------------------------------------
  componentWillMount(){
    this.setState({listaCarrito : JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : '[]' })
  }
  //============================================================================
  //                    Render
  //----------------------------------------------------------------------------
  render(){
    if(!sessionStorage.getItem('Session')){     
      return <Redirect to="/" />
    }
    if(this.contadorCarrito()){
      return(
        <div className="tienda">
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
          </div>
          <div class="container carrito-detalle animated fadeIn">
              <h2 class="header">Carrito de Compras</h2>
              <div class="row">
                <div class="col s12 l8">
                  {
                    this.mostrarCarrito()
                  }
                </div>
                <div class="col s12 l4">
                  <div class="center">
                    <h2> Total a pagar</h2>
                    <h3><FormattedMessage   id="total"  defaultMessage={`$ {total, number}`} values={{total : this.total()}} /></h3>
                    
                    <button class="col s6 btn red waves-effect waves-red" type="button" onClick={this.vaciarCarrito}><i class="material-icons left">delete</i>Vaciar Carrito</button>
                    <button class="col s6 btn green waves-effect waves-green" type="button"  onClick={this.pagarCarrito.bind(this)}><i class="material-icons left">credit_card</i>Pagar</button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      )
    }else if(!this.contadorCarrito() && this.state.redirect == false){
      return (
        <div className="tienda row">
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
            <div className="animated fadeIn slow">
              <div className="box white col s12 center-align" style={{padding: '5%'}}>
                <h5  style={{height : '70vh', display : 'table-cell', verticalAlign : 'middle'}} >No ha agregado productos al carrito de compras. Lo invitamos a dar un paseo por nuestra <Link to="/tienda">Tienda Virtual</Link></h5>
              </div>
            </div>
          </div>
        </div>
      )
    }else{
      return <Redirect to="/tienda"/>; 
    }
  }
  //==============================================================================
  //                    Funciones
  //----------------------Mostrar items en carrito=-------------------------------
  mostrarCarrito(){
    return this.state.listaCarrito.map(
      (producto) => { return <CarritoDetalle key={ producto.id } id={producto.id}  descripcion={ producto.descripcion } imagen={ producto.imagen } descripcion={ producto.descripcion } cantidad={ producto.cantidad } precio ={producto.precio} actualizarDisponible={this.actualizarDisponible.bind(this)}/> }
    )
  }
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
  //=============================================================================
  //             Guardar Items en el carrito
  //--------------Actualizar Disponible------------------------------------------
  actualizarDisponible(item:Object, cantidad:Number, remover:Boolean = false){
    for (let productoLista of this.state.listaCarrito){
      if (productoLista.id == item.id){
        productoLista.cantidad = cantidad
        if(productoLista.cantidad == 0 || remover == true){
          this.removerItem(item)
        }
      }
    }
    sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito))
    this.setState({listaCarrito : this.state.listaCarrito})
  }
  //---------------Remover item del carrito--------------------------------------
  removerItem(item){
    let index = this.state.listaCarrito.findIndex(producto => producto.id === item.id)
    let newArray =   this.state.listaCarrito.splice(index, 1)
  }
  //-----------------Vaciar los items del carrito------------------------------------
  vaciarCarrito(){
    this.setState({listaCarrito : []})
    sessionStorage.setItem('Carrito', '[]') 
  }
  //==============Calcular Totales================================================
  total(){
    let total :number = 0 
    let items = this.state.listaCarrito; 
    for(let subtotal of items ){ 
      total += subtotal.cantidad * subtotal.precio; 
    }
    return total;
  }
  //=============Pagar Carrito==================================================
  pagarCarrito(){
    const listaCarrito = this.state.listaCarrito                                 
    this.setState({ pagar : true})
    request
    .get('https://tienda-angular2-82354.firebaseio.com/producto/.json')                
    .then((res) => {
      if( res.error || !res.ok){                                                 
        console.log('Se produjo un error al realizar la petición al servidor. '+error )
        alert('Se produjo un error al realizar la petición al servidor. '+error )
      }else{
        console.log('Conexión establecida. Actualizando base de datos')          
        const respuesta = res.text                                               
        let catalogo = JSON.parse(respuesta) 
        console.log(res)  
        for (let itemCatalogo of catalogo){      
                                       
          for (let item of listaCarrito){                                        
            if ( itemCatalogo.id == item.id ){                                   
              let cantidad = Number(item.cantidad);                              
              itemCatalogo.disponible = itemCatalogo.disponible - cantidad;      
              this.actualizarDB(itemCatalogo, cantidad)                          
            }
          }
        }
      }
    }
  )
}

actualizarDB(itemCatalogo, cantidad){
  request.put(`https://tienda-angular2-82354.firebaseio.com/producto/${itemCatalogo.id}.json`)  
  .set('Content-Type', 'application/json')                                                
  .send(itemCatalogo)                                                                    
  .then((res) => {                                                                     
    if( res.error || !res.ok){                                                            
      console.log('Se produjo un error al actualizar la base de datos. '+error );
      alert('Se produjo un error al actualizar la base de datos. '+error)                 
    }else{
      if(this.state.listaCarrito.length == 1){                                         
        this.vaciarCarrito()
        this.setState({ redirect : true })
      }else{
        let counter = (Number(this.state.counter) + 1)                                    
        if(counter == this.state.listaCarrito.length){                                    
          this.vaciarCarrito()                                                              
          this.setState({ counter : counter})                                                
          this.setState({ redirect : true })                                                
        }else{
          this.setState({ counter : counter})                                              
        }
      }
    }
  })
}

  componentDidUpdate(){
    console.log('Actualización de disponibilidad correcta.');                             
  }
}

export default Carrito;
