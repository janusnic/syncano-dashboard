import accounts from '../../tempAccounts';
import utils, { addTestNamePrefixes } from '../../utils';

export default addTestNamePrefixes({
  tags: ['apiKeys'],
  before: (client) => {
    const { accountKey } = accounts.instanceUser;

    client
      .loginUsingLocalStorage(accountKey)
      .setResolution(client);
  },
  after: (client) => client.end(),
  'Test Add Api Key': (client) => {
    const apiKeysPage = client.page.apiKeysPage();
    const description = utils.addSuffix();
    const { instanceName } = accounts.instanceUser;

    apiKeysPage
      .goToUrl(instanceName, 'api-keys')
      .clickElement('@addApiKeyButton')
      .fillInput('@createModalDescriptionInput', description)
      .clickElement('@createApiKeyButton')
      .waitForElementVisible('@apiKeysTableRow');
  },
  'Test Reset Api Key': (client) => {
    const apiKeysPage = client.page.apiKeysPage();
    const description = utils.addSuffix();
    const apiKeyValueElement = apiKeysPage.elements.apiKeyValue.selector;
    let apiKeyValue = null;

    apiKeysPage.waitForElementPresent('@apiKeysTableRow');
    client.element('css selector', apiKeyValueElement, (result) => {
      client.elementIdText(result.value.ELEMENT, (text) => (apiKeyValue = text.value));
    });

    apiKeysPage
      .clickListItemDropdown(description, 'Reset')
      .clickElement('@confirmButton');

    apiKeysPage.waitForElementPresent('@apiKeysTableRow');
    client.element('css selector', apiKeyValueElement, (result) => {
      client.elementIdText(result.value.ELEMENT, (text) => {
        client.assert.notEqual(text.value, apiKeyValue);
      });
    });
  },
  'Test Delete Api Key': (client) => {
    const apiKeysPage = client.page.apiKeysPage();
    const description = utils.addSuffix();

    apiKeysPage
      .clickListItemDropdown(description, 'Delete')
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@apiKeysTableRow');
  }
});
