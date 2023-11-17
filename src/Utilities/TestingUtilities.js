import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

export const ComponentWithContext = ({
  Component,
  componentProps,
  renderOptions = {},
}) => {
  const mockStore = configureStore();

  return (
    <IntlProvider locale="en">
      <Provider store={renderOptions?.store || mockStore()}>
        <MemoryRouter initialEntries={renderOptions?.initialEntries || ['/']}>
          {renderOptions?.componentPath ? (
            <Routes>
              <Route>
                <Component {...componentProps} />
              </Route>
            </Routes>
          ) : (
            <Component {...componentProps} />
          )}
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );
};

ComponentWithContext.propTypes = {
  Component: PropTypes.element,
  componentProps: PropTypes.object,
  renderOptions: PropTypes.object,
};