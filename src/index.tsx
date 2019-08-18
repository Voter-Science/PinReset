import * as React from "react";
import * as ReactDOM from "react-dom";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'

import { SheetContainer, IMajorState } from 'trc-react/dist/SheetContainer'

import * as bcl from 'trc-analyze/collections'
import { PluginLink } from "trc-react/dist/PluginLink";
import { ColumnNames } from "trc-sheet/sheetContents";

import { PluginShell} from 'trc-react/dist/PluginShell';
import { ColumnSelector} from 'trc-react/dist/ColumnSelector';
import { ColumnCheck} from 'trc-react/dist/ColumnCheck';

declare var _trcGlobal: IMajorState;


// Lets somebody lookup a voter, and then answer questions about them. 
// See all answers in Audit. 
export class App extends React.Component<{}, {    
    _ci : trcSheet.IColumnInfo // currently selected column
    _mapping : any, // maps from _Ci's possible values to a color code. 
}>
{
    public constructor(props: any) {
        super(props);

        this.state = {            
            _ci : undefined,
            _mapping : { }
        };
        this.renderBody1 = this.renderBody1.bind(this);
        this.columnUpdate = this.columnUpdate.bind(this);
        this.onColorChanged = this.onColorChanged.bind(this);
        this.onApply = this.onApply.bind(this);
        
    }

    private columnUpdate(ci : trcSheet.IColumnInfo) {
        // This will cause a re-render of renderColorChoices
        this.setState({
            _ci : ci
        });
    }

    // Called after user has determined a color mapping and wants to apply it. 
    private onApply()  {
        alert(JSON.stringify(this.state._mapping));
    }

    static colors : any = {
        'Green' : 'g',
        'Red' : 'r',
        'Blue' : 'b',
        'Yellow' : 'y'        
    }

    private onColorChanged(event : any, columnValue : string) {
        var idx = event.target.value;

        var map = this.state._mapping;
        map[columnValue]  = idx;
        this.setState({_mapping : map});
    }
    private renderColorChoices(columnValue : string) {
        return <select onChange={x => this.onColorChanged(x,columnValue)} >            
            <option key="k1" value="">(none)</option>
            <option key="k2" value="g">Green</option>
            <option key="k3" value="b">Blue</option>
            <option key="k4" value="r">Red</option>
        </select>
    }

    // Given a Column, let us select a color for each possible value. 
    private renderValues() {
        var ci = this.state._ci;
        if (!ci || !ci.PossibleValues || ci.PossibleValues.length==0) {
            return <div>(select a column)</div>
        }
        return <table>
            <thead>
                <tr>
                    <td>Value</td>
                    <td>Color</td>
                </tr>
            </thead>
            {ci.PossibleValues.map((columnValue,idx) =>                
                    <tr key={idx}>
                        <td>
                            {columnValue}
                        </td>
                        <td>
                            {this.renderColorChoices(columnValue)}
                        </td>
                    </tr>
                )}
        </table>
    }

    private renderCurrentColor(ci : trcSheet.IColumnInfo) { 
        if (ci.Expression) {
            return <div>{ci.Expression}</div>
        }
        return <div>(sheet has an existing color scheme)</div>
    }

    private renderBody1() {
        {
            // <ListColumns Include={ci => ci.IsReadOnly && ci.PossibleValues != null}></ListColumns>
            return <div>                
                <ColumnCheck columnName="XColor" OnFound={this.renderCurrentColor}>
                    Sheet does not have a custom color scheme
                </ColumnCheck>
                <div>------</div>
                <div>Set color scheme based on a column's values:</div>
                <ColumnSelector Include={ci=>true} OnChange={this.columnUpdate} ></ColumnSelector>      
                {this.renderValues()}          
                <button onClick={this.onApply}>Apply!</button>
             </div>
        }
    }

    render() {
        return <PluginShell title="PinColor" details="Set custom pin colors">
            <SheetContainer
                onReady={this.renderBody1}
                fetchContents={false}
                requireTop={true}>
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