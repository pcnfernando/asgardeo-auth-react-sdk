import React, { FunctionComponent, ReactElement } from "react";
import { JsonViewer } from '@textea/json-viewer'

interface APIResponsePropsInterface {
    
    apiResponse: any;
}

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

export const APIResponse: FunctionComponent<APIResponsePropsInterface> = (
    props: APIResponsePropsInterface
): ReactElement => {

    const {
        apiResponse
    } = props;

    return (
        <>
            <h2>Response of 'validate/user'</h2>
            <div className="json">
                <JsonViewer
                    className="asg-json-viewer"
                    value={ apiResponse }
                    enableClipboard={ false }
                    displayObjectSize={ false }
                    displayDataTypes={ false }
                    rootName={ false }
                    theme="dark"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                />
            </div>
            <h2>Organizations</h2>
            <div className="json">
                <JsonViewer
                    className="asg-json-viewer"
                    value={ apiResponse.data.organizations.map((org: Organization) => org.name) }
                    enableClipboard={ false }
                    displayObjectSize={ false }
                    displayDataTypes={ false }
                    rootName={ false }
                    theme="dark"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                />
            </div>
        </>
    );
}
