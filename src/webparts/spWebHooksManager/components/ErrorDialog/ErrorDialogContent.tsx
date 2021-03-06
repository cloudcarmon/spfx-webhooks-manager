import { DialogContent, DialogFooter } from "office-ui-fabric-react/lib/Dialog";
import * as React from "react";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import * as strings from 'SpWebHooksManagerWebPartStrings';

export class ErrorDialogContent extends React.Component<IErrorDialogContentProps, {}> {
  constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return <DialogContent
      title={this.props.title}
      subText={this.props.message}
      onDismiss={this.props.close}>
      <DialogFooter>
        <DefaultButton text={strings.OK} onClick={this.props.close} primary={true} />
      </DialogFooter>
    </DialogContent>;
  }
}
