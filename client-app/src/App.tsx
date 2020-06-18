import React,{Component} from 'react';
import { Header, Icon, List } from 'semantic-ui-react'
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';
import axios from 'axios';

class App extends Component {

  state= {
    values: []
  }
  componentDidMount() {
    axios.get('http://localhost:5000/api/values')
        .then((response) => (
          this.setState({
            values: response.data
          })
        ))
    // this.setState({
    //   values: [{id:1, name:'Value 101'},{id:2, name:'Value 102'}]
    // })////we are setting the state of the values in side state function once the page is loaded or triggered
  }
  render() {
    return (
      <div>
           <Header as='h2'>
    <Icon name='users' />
    <Header.Content>Reactivities</Header.Content>
  </Header>
  <List>
  {this.state.values.map((value: any) => (
    <List.Item key={value.id}>{value.name}</List.Item>
    ))}
  </List>
           <ul>
            
           </ul>

      </div>
    );
  }
  
}


///class extends from component and must be rendered.

export default App;
