import * as React from "react";
import * as ReactDOM from "react-dom";

import * as trcSheet from 'trc-sheet/sheet'

import { SheetContainer, IMajorState } from 'trc-react/dist/SheetContainer'

import * as bcl from 'trc-analyze/collections'

import { PluginShell } from 'trc-react/dist/PluginShell';


declare var _trcGlobal: IMajorState;


// Lets somebody lookup a voter, and then answer questions about them. 
// See all answers in Audit. 
export class App extends React.Component<{}, {
    _ci: trcSheet.IColumnInfo // currently selected column
    _mapping: any, // maps from _Ci's possible values to a color code. 
}>
{
    public constructor(props: any) {
        super(props);

        this.state = {
            _ci: undefined,
            _mapping: {}
        };
        
        this.renderBody1 = this.renderBody1.bind(this);
        this.onFullReset = this.onFullReset.bind(this);
    }

       // Remove the XColor column. 
    private onFullReset() {
        var ok = confirm("Are you sure you want to reset all pins?");
        if (!ok) {
            return;
        }
        _trcGlobal.SheetOps.beginAdminOp(admin => {
            return admin.postOpResetAllPins();
        });
    }

    

    private renderBody1() {
        {            
            return <div>                                
                <button onClick={this.onFullReset}>Reset all pins in this sheet!</button>            
            </div>
        }
    }

    render() {
        // fetch contents so we can get possible values from the contents . 
        return <PluginShell title="PinReset" details="Reset Pins">
            <SheetContainer
                onReady={this.renderBody1}
                fetchContents={false}
                requireTop={false}>
            </SheetContainer>
        </PluginShell>

    };
}

ReactDOM.render(
    <div>
        <App></App>
    </div>,
    document.getElementById("example")
);