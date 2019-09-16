import * as React from "react";
import * as ReactDOM from "react-dom";

import * as trcSheet from 'trc-sheet/sheet'

import { SheetContainer, IMajorState } from 'trc-react/dist/SheetContainer'

import * as bcl from 'trc-analyze/collections'

import { PluginShell } from 'trc-react/dist/PluginShell';
import { CsvMatchInput } from 'trc-react/dist/CsvMatchInput';
import { ISheetContents } from "trc-sheet/sheetContents";


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
        this.onPartialReset = this.onPartialReset.bind(this);
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

    // Remove the XColor column. 
    private onPartialReset(data: ISheetContents): Promise<void> {
        var recIds: string[] = data["RecId"];
        var count = recIds.length; // <CsvMatchInput> already verified this was present.
        var ok = confirm("Are you sure you want to reset these " + count + "pins?");
        if (!ok) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve, reject) => {
            _trcGlobal.SheetOps.beginAdminOp(
                admin => admin.postOpResetSomePins(recIds)
            );
            // Promise is never fulfilled. but beginAdminOp() will reload the page when done. 
        });
    }



    private renderBody1() {
        {
            return <div>
                <h3>Option 1: Reset all pins</h3>
                <button onClick={this.onFullReset}>Reset all pins in this sheet!</button>

                <h3>Option 2: Reset specific pins</h3>
                <div>Just reset the these recIds:</div>
                <CsvMatchInput onSubmit={this.onPartialReset}></CsvMatchInput>

            </div >
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