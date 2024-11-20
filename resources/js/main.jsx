import React from "react";
import ReactDOM from 'react-dom/client'
import { ContextProvider } from './pages/context/contextAuth'
// import TodoProvider from './_helper/Todo/TodoProvider';
// import EmailProvider from './_helper/Email/EmailProvider';
// import SearchResultProvider from './_helper/SearchResult/SearchResult';
// import ProductProvider from './_helper/Ecommerce/Product/ProductProvider';
import CartProvider from './_helper/Ecommerce/Cart/CardProvider';
import FilterProvider from './_helper/Ecommerce/Filter/FilterProvider';
import WishListProvider from './_helper/Ecommerce/Wishlist/WishlistProvider';
// import JobSearchProvider from './_helper/JobSearch/JobSearchProvider';
// import LearningProvider from './_helper/Learning/LearningProvider';
// import FaqProvider from './_helper/Faq/FaqProvider';
import AnimationThemeProvider from './_helper/AnimationTheme/AnimationThemeProvider';
import CustomizerProvider from './_helper/Customizer/CustomizerProvider'

import Router from "./router";
import "./index.scss";

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
        <div className="App">
        <ContextProvider>
                <CustomizerProvider>
                    <WishListProvider>
                        <FilterProvider>
                            <CartProvider>
                            <AnimationThemeProvider>
                                <Router />
                                </AnimationThemeProvider>
                            </CartProvider>
                        </FilterProvider>
                    </WishListProvider>
                </CustomizerProvider>
        </ContextProvider>
        </div>
    // </React.StrictMode>
)
