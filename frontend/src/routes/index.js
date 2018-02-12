/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import App from '../components/App';

// Child routes
import home from './home';

import Header from '../components/Header';

export default [

  {
    path: '/',

  // keep in mind, routes are evaluated in order
    children: [
      home,
      // // contact,
      // table,
      // button,
      // flotcharts,
      // forms,
      // grid,
      // icons,
      // morrisjscharts,
      // notification,
      // panelwells,
      // typography,
      // // register,
      // blank,
      //
      // // place new routes before...
      // // content,
      // error,
    ],

    async action({ next, render, context }) {
      // console.log('inside dashboard');
      const component = await next();
      // console.log('inside dasdboard component', component);
      if (component === undefined) return component;
      return render(
        <div>
          <Header />
          <div id="page-wrapper" className="page-wrapper">
            <App context={context}>{component}</App>
          </div>
        </div>
      );
    },
  }
];
