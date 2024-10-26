import React, { FunctionComponent, ReactElement } from "react";
import { JsonViewer } from '@textea/json-viewer'
// import ReactJson from "react18-json-view";

interface APIResponsePropsInterface {
    
    apiResponse: any;
}

export const APIResponse: FunctionComponent<APIResponsePropsInterface> = (
    props: APIResponsePropsInterface
): ReactElement => {

    const {
        apiResponse
    } = props;

    return (
        <>
            <h2>API Response</h2>
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
        </>
    );
}
