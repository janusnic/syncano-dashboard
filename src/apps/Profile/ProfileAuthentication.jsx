import React from 'react';
import Reflux from 'reflux';
import Radium from 'radium';
import Helmet from 'react-helmet';

import { FormMixin, SnackbarNotificationMixin } from '../../mixins';

import Store from './ProfileAuthenticationStore';
import Actions from './ProfileActions';
import SessionStore from '../Session/SessionStore';

import { TextField, FlatButton, RaisedButton } from 'material-ui';
import { Clipboard, Container, InnerToolbar } from '../../common/';

export default Radium(React.createClass({
  displayName: 'ProfileAuthentication',

  mixins: [
    Reflux.connect(Store),
    Reflux.ListenerMixin,
    FormMixin,
    SnackbarNotificationMixin
  ],

  validatorConstraints: () => {
    const constraints = {
      newPassword: {
        presence: true
      },
      confirmNewPassword: {
        presence: true,
        equality: 'newPassword'
      }
    };

    if (SessionStore.getUser().has_password) {
      constraints.current_password = {
        presence: true
      };
    }

    return constraints;
  },

  getStyles() {
    return {
      content: {
        padding: '0px 0px 48px'
      },
      contentRow: {
        display: 'flex',
        alignItems: 'center'
      },
      accountKey: {
        fontFamily: 'monospace',
        paddingRight: 8
      },
      updateButton: {
        height: 36,
        lineHeight: '36px',
        boxShadow: 0
      },
      updateButtonLabel: {
        lineHeight: '36px',
        fontWeight: 400,
        paddingLeft: 30,
        paddingRight: 30
      },
      settingsTitle: {
        paddingBottom: 10
      }
    };
  },

  handleSuccessfullValidation() {
    if (!SessionStore.getUser().has_password) {
      Actions.setPassword(this.state.newPassword);
    } else {
      Actions.changePassword(this.state);
    }
  },

  render() {
    const styles = this.getStyles();
    const user = SessionStore.getUser();
    const hasPassword = user && user.has_password ? user.has_password : null;
    const title = 'Authentication';

    return (
      <div>
        <Helmet title={title} />
        <InnerToolbar title={title} />
        <Container>
          <div style={styles.content}>
            <div>Account key</div>
            <div className="row" style={styles.contentRow}>
              <div style={styles.accountKey}>{this.state.account_key}</div>
              <div className="flex-1">
                <Clipboard
                  copyText={this.state.account_key}
                  onCopy={() => this.setSnackbarNotification({
                    message: 'Account key copied to the clipboard'
                  })}
                  label="COPY"
                  type="button"
                />
                <FlatButton
                  label="RESET"
                  primary={true}
                  onClick={Actions.resetKey}
                />
              </div>
            </div>
          </div>
          <div style={styles.content}>
            <div style={styles.settingsTitle}>Password settings</div>
            <div className="row" style={styles.contentRow}>
              <div className="col-md-15">
                <form
                  onSubmit={this.handleFormValidation}
                  acceptCharset="UTF-8"
                  method="post"
                >
                  {this.renderFormNotifications()}
                  {hasPassword
                    ? <TextField
                      ref="currentPassword"
                      type="password"
                      value={this.state.current_password}
                      onChange={(event, value) => this.setState({ current_password: value })}
                      errorText={this.getValidationMessages('current_password').join(' ')}
                      name="currentPassword"
                      floatingLabelText="Current password"
                      autoComplete="currentPassword"
                      hintText="Current password"
                      fullWidth={true}
                    />
                    : null}
                  <TextField
                    ref="newPassword"
                    type="password"
                    value={this.state.newPassword}
                    onChange={(event, value) => this.setState({ newPassword: value })}
                    errorText={this.getValidationMessages('newPassword').join(' ')}
                    name="newPassword"
                    floatingLabelText="New password"
                    autoComplete="newPassword"
                    hintText="New password"
                    fullWidth={true}
                  />
                  <TextField
                    ref="confirmNewPassword"
                    type="password"
                    value={this.state.confirmNewPassword}
                    onChange={(event, value) => this.setState({ confirmNewPassword: value })}
                    errorText={this.getValidationMessages('confirmNewPassword').join(' ')}
                    name="confirmNewPassword"
                    floatingLabelText="Confirm new password"
                    className="vm-6-b"
                    autoComplete="confirmNewPassword"
                    hintText="Confirm new password"
                    fullWidth={true}
                  />
                  <RaisedButton
                    type="submit"
                    label="Update"
                    style={styles.updateButton}
                    labelStyle={styles.updateButtonLabel}
                    className="raised-button"
                    disabled={!this.state.canSubmit}
                    primary={true}
                  />
                </form>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}));
