/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useState, useEffect } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./app.css";
import { ErrorBoundary } from "./error-boundary";
import { HomePage, NotFoundPage } from "./pages";

const AppContent: FunctionComponent = (): ReactElement => {
    const { error } = useAuthContext();

    return (
        <ErrorBoundary error={error}>
            <Router>
            <Routes>
                <Route path="/" element={ <HomePage /> } />
                <Route path="/login" element={ <HomePage /> } />
                <Route element={ <NotFoundPage /> } />
            </Routes>
        </Router>
        </ErrorBoundary>
    )
};

const App: FunctionComponent = (): ReactElement => {
    const [authConfig, setAuthConfig] = useState(null);
    useEffect(() => {
        fetch("/public/config.json")
            .then((response) => response.json())
            .then((config) => {
                setAuthConfig(config);
            });
    }, []);

    if (!authConfig) {
        return <div>Loading...</div>;
    }
    return (
        <AuthProvider config={authConfig}>
            <AppContent />
        </AuthProvider>
    )
};

// const App = () => (
//     <AuthProvider config={authConfig}>
//         <AppContent />
//     </AuthProvider>
// );

render((<App />), document.getElementById("root"));
