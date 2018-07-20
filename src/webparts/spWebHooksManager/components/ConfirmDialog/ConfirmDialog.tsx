

import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

export interface IConfirmDialogProps {
  onSubmit: () => Promise<void>;
  onClose: () => void;
  title: string;
  message: string;
  loadingMessage: string;
}

export interface IConfirmDialogState {
  loading: boolean;
}

export default class ConfirmDialog extends React.Component<IConfirmDialogProps, IConfirmDialogState> {
  constructor(props: IConfirmDialogProps) {
    super(props);

    this.state = {
      loading: false
    };
  }

  @autobind
  private async onSubmit() {
    this.setState({
      loading: true
    });
    await this.props.onSubmit();
    this.props.onClose();
    this.setState({
      loading: false
    });
  }

  public render(): React.ReactElement<IConfirmDialogProps> {
    const { title, message, loadingMessage, onClose } = this.props;

    return (
      <div>
        <Dialog
          hidden={false}
          onDismiss={onClose}
          dialogContentProps={{
            type: DialogType.normal,
            title: title,
            subText: message
          }}>
          {
            this.state.loading ?
              <div><Spinner className="" size={SpinnerSize.large} label={loadingMessage} /></div>
              :
              <DialogFooter>
                <DefaultButton disabled={this.state.loading} onClick={this.onSubmit} text="OK" primary={true} />
                <DefaultButton onClick={this.props.onClose} text="Cancel" />
              </DialogFooter>
          }
        </Dialog>
      </div>
    );
  }
}