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

import { BasicUserInfo, Hooks, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import REACT_LOGO from "../images/react-logo.png";
import { DefaultLayout } from "../layouts/default";
import { APIResponse } from "../components";
import { useLocation } from "react-router-dom";
import { LogoutRequestDenied } from "../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../constants/errors";
import axios from "axios";

interface Organization {
    handle: string;
    id: number;
    name: string;
    uuid: string;
    owner: User;
}

interface User {
    id?: number;
    idpId: string;
    createdAt?: Date;
}

/**
 * Home page for the Sample.
 *
 * @param props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HomePage: FunctionComponent = (): ReactElement => {

    const {
        state,
        signIn,
        signOut,
        getAccessToken,
        on
    } = useAuthContext();

    const [hasAuthenticationErrors, setHasAuthenticationErrors] = useState<boolean>(false);
    const [hasLogoutFailureError, setHasLogoutFailureError] = useState<boolean>();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    const [apiResponse, setApiResponse] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (state.isAuthenticated) {
                const token = await getAccessToken();
                try {
                    const response = await axios.get("https://apis.preview-dv.choreo.dev/user-mgt/1.0.0/validate/user", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const { data } = response;
                    if (data?.organizations.length) {
                        const { organizations } = data;
                        const orgNames: string[] = organizations.map((org: Organization) => org.name);
                        // setApiResponse(`${orgNames.join(", ")}`);
                        setApiResponse(JSON.stringify(orgNames, null, 2));
                    }
                } catch (error) {
                    setApiResponse("Error fetching API data");
                }
            }
        };

        fetchData();
    }, [state.isAuthenticated, getAccessToken]);

    useEffect(() => {
        if (stateParam && errorDescParam) {
            if (errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    const handleLogin = useCallback(() => {
        setHasLogoutFailureError(false);
        signIn()
            .catch(() => setHasAuthenticationErrors(true));
    }, [signIn]);

    /**
      * handles the error occurs when the logout consent page is enabled
      * and the user clicks 'NO' at the logout consent page
      */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if (!errorDescParam) {
                handleLogin();
            }
        })
    }, [on, handleLogin, errorDescParam]);

    const handleLogout = () => {
        signOut();
    };

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout
            isLoading={state.isLoading}
            hasErrors={hasAuthenticationErrors}
        >
            {
                state.isAuthenticated
                    ? (
                        <div className="content">
                            {<APIResponse apiResponse={apiResponse} />}
                            <button
                                className="btn primary mt-4"
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )
                    : (
                        <div className="content">
                            <div className="home-image">
                                <img alt="react-logo" src={REACT_LOGO} className="react-logo-image logo" />
                            </div>
                            <h4 className={"spa-app-description"}>
                                Sample demo to showcase authentication for a Single Page Application
                                via the OpenID Connect Authorization Code flow,
                                which is integrated using the&nbsp;
                                <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk" target="_blank" rel="noreferrer noopener">
                                    Asgardeo Auth React SDK
                                </a>.
                            </h4>
                            <button
                                className="btn primary"
                                onClick={() => {
                                    handleLogin();
                                }}
                            >
                                Login
                            </button>
                        </div>
                    )
            }
        </DefaultLayout>
    );
};
