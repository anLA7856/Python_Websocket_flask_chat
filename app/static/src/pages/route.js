import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import Store from "src/store";
import App from 'src/components/App';
import Chat from 'src/pages/Chat/Index';
//由Provider组件传递store，然后一层一层接着可以通过props来往下传递，
ReactDOM.render(
  <Provider store={Store}>
    <App>
  	<Chat />
    </App>
  </Provider>,
  document.getElementById('app')
);


